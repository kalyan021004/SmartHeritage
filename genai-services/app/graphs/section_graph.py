import uuid
from typing import Literal

from typing_extensions import TypedDict

from langchain_core.messages import HumanMessage, SystemMessage
from langchain_core.runnables import RunnableConfig
from langgraph.graph import END, START, StateGraph

from app.evals.checks import section_checks
from app.evals.feedback import log_report
from app.evals.judge import evaluate_output
from app.evals.rubrics import SECTION_CRITERIA
from app.graphs.llm import content_llm
from app.prompts.heritage_prompt import create_section_prompt


SECTION_SYSTEM = "You are a professional heritage historian."
MAX_ATTEMPTS = 3


# ============================================================
# STATE
# ============================================================

class SectionState(TypedDict, total=False):
    site_name: str
    section: str
    max_attempts: int

    content: str
    feedback: str | None
    report: dict | None

    best_content: str | None
    best_report: dict | None
    best_rank: float

    attempts: int


# ============================================================
# NODES
# ============================================================

async def write_section(state: SectionState, config: RunnableConfig):
    prompt = create_section_prompt(state["site_name"], state["section"])

    if state.get("feedback"):
        prompt += (
            f"\n\nYour previous draft:\n{state.get('content', '')}\n\n"
            f"It was rejected for these reasons:\n{state['feedback']}\n\n"
            "Rewrite the article and fix EVERY problem."
        )

    response = await content_llm.ainvoke(
        [
            SystemMessage(content=SECTION_SYSTEM),
            HumanMessage(content=prompt),
        ],
        config,
    )

    return {
        "content": (response.content or "").strip(),
        "attempts": state.get("attempts", 0) + 1,
    }


async def evaluate(state: SectionState, config: RunnableConfig):
    content = state["content"]

    report = await evaluate_output(
        task="section",
        subject=content,
        rule_issues=section_checks(content),
        criteria=SECTION_CRITERIA,
        context=(
            f"Heritage site: {state['site_name']}\n"
            f"Requested section: {state['section']}"
        ),
        config=config,
    )

    update = {
        "report": report.to_dict(),
        "feedback": None if report.passed else report.feedback_text(),
    }

    rank = (1.0 if report.passed else 0.0) + report.score

    if rank > state.get("best_rank", -1.0):
        update.update(
            best_content=content,
            best_report=report.to_dict(),
            best_rank=rank,
        )

    return update


def route_after_evaluate(state: SectionState) -> Literal["write_section", "__end__"]:
    if (state.get("report") or {}).get("passed"):
        return END

    if state.get("attempts", 0) < state.get("max_attempts", MAX_ATTEMPTS):
        return "write_section"

    return END


# ============================================================
# GRAPH
#   START -> write_section -> evaluate -> END
#                 ^               |
#                 +---------------+  (retry with feedback)
# ============================================================

_builder = StateGraph(SectionState)
_builder.add_node("write_section", write_section)
_builder.add_node("evaluate", evaluate)

_builder.add_edge(START, "write_section")
_builder.add_edge("write_section", "evaluate")
_builder.add_conditional_edges(
    "evaluate",
    route_after_evaluate,
    {"write_section": "write_section", END: END},
)

section_graph = _builder.compile(name="heritage_section")


# ============================================================
# PUBLIC API
# ============================================================

async def run_section_graph(
    site_name: str,
    section: str,
    max_attempts: int = MAX_ATTEMPTS,
) -> str:

    run_id = uuid.uuid4()

    config: RunnableConfig = {
        "run_id": run_id,
        "run_name": "heritage_section",
        "tags": ["heritage", "section"],
        "metadata": {"site_name": site_name, "section": section},
    }

    result = await section_graph.ainvoke(
        {
            "site_name": site_name,
            "section": section,
            "max_attempts": max_attempts,
            "attempts": 0,
        },
        config=config,
    )

    report = result.get("best_report")

    await log_report(run_id, report, "section", attempts=result.get("attempts"))

    if report and not report["passed"]:
        print("SECTION EVAL FAILED after retries:", report["issues"])

    return result.get("best_content", "")