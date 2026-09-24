import json
from typing import Literal

from typing_extensions import TypedDict

from langchain_core.messages import HumanMessage, SystemMessage
from langchain_core.runnables import RunnableConfig
from langgraph.graph import END, START, StateGraph

from app.graphs.llm import json_llm


MAX_ATTEMPTS = 3

REQUIRED_KEYS = [
    "name",
    "slug",
    "location",
    "category",
    "historical_background",
    "cultural_significance",
    "architectural_highlights",
    "virtual_tour_hotspots",
    "visitor_info",
    "nearby_sites",
]


# ============================================================
# STATE
# ============================================================

class SiteState(TypedDict, total=False):
    system_prompt: str
    user_prompt: str
    raw: str
    site_data: dict | None
    error: str | None
    attempts: int


# ============================================================
# HELPERS
# ============================================================

def clean_json_text(text: str) -> str:
    """Remove markdown fences and any text around the JSON object."""

    text = (text or "").strip()

    if text.startswith("```json"):
        text = text[7:]
    elif text.startswith("```"):
        text = text[3:]

    if text.endswith("```"):
        text = text[:-3]

    text = text.strip()

    start = text.find("{")
    end = text.rfind("}")

    if start != -1 and end != -1 and end > start:
        text = text[start : end + 1]

    return text


# ============================================================
# NODES
# ============================================================

async def generate(state: SiteState, config: RunnableConfig):
    attempts = state.get("attempts", 0) + 1
    user_prompt = state["user_prompt"]

    # On a retry, tell the model what was wrong
    if state.get("error"):
        user_prompt += (
            f"\n\nYour previous answer was rejected: {state['error']}\n"
            "Return ONLY the corrected, valid JSON object."
        )

    response = await json_llm.ainvoke(
        [
            SystemMessage(content=state["system_prompt"]),
            HumanMessage(content=user_prompt),
        ],
        config,
    )

    return {"raw": response.content, "attempts": attempts}


def validate(state: SiteState):
    text = clean_json_text(state.get("raw", ""))

    try:
        data = json.loads(text)
    except json.JSONDecodeError as error:
        print("SITE JSON PARSE ERROR:", error)
        return {"site_data": None, "error": f"Invalid JSON: {error}"}

    if not isinstance(data, dict):
        return {"site_data": None, "error": "Top-level JSON must be an object"}

    missing = [key for key in REQUIRED_KEYS if key not in data]

    if missing:
        return {
            "site_data": None,
            "error": f"Missing required keys: {', '.join(missing)}",
        }

    return {"site_data": data, "error": None}


def route_after_validate(state: SiteState) -> Literal["generate", "__end__"]:
    if state.get("error") and state.get("attempts", 0) < MAX_ATTEMPTS:
        return "generate"

    return END


# ============================================================
# GRAPH
#   START -> generate -> validate -> (retry generate | END)
# ============================================================

_builder = StateGraph(SiteState)
_builder.add_node("generate", generate)
_builder.add_node("validate", validate)

_builder.add_edge(START, "generate")
_builder.add_edge("generate", "validate")
_builder.add_conditional_edges(
    "validate",
    route_after_validate,
    {"generate": "generate", END: END},
)

site_graph = _builder.compile(name="heritage_site_generation")


# ============================================================
# PUBLIC API
# ============================================================

async def run_site_graph(
    system_prompt: str,
    user_prompt: str,
    place_name: str | None = None,
    language: str | None = None,
) -> dict:

    config: RunnableConfig = {
        "run_name": "heritage_site_generation",
        "tags": ["heritage", "site-generation"],
        "metadata": {"place_name": place_name, "language": language},
    }

    result = await site_graph.ainvoke(
        {
            "system_prompt": system_prompt,
            "user_prompt": user_prompt,
            "attempts": 0,
        },
        config=config,
    )

    if result.get("error") or not result.get("site_data"):
        print("RAW LLM RESPONSE:", result.get("raw"))
        raise ValueError(result.get("error") or "LLM returned invalid JSON")

    return result["site_data"]