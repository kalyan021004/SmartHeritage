import asyncio
import uuid
from typing import Annotated, AsyncIterator

from typing_extensions import TypedDict

from langchain_core.messages import (
    AIMessage,
    AIMessageChunk,
    AnyMessage,
    HumanMessage,
    SystemMessage,
)
from langchain_core.runnables import RunnableConfig
from langgraph.graph import END, START, StateGraph
from langgraph.graph.message import add_messages

from app.evals.checks import chat_checks
from app.evals.feedback import log_report
from app.evals.judge import evaluate_output
from app.evals.rubrics import CHAT_CRITERIA
from app.graphs.llm import chat_llm


MAX_HISTORY = 20  # keep only the most recent messages

# keep references so background eval tasks are not garbage-collected
_background_tasks: set = set()


# ============================================================
# STATE
# ============================================================

class ChatState(TypedDict):
    system_prompt: str
    messages: Annotated[list[AnyMessage], add_messages]


# ============================================================
# HELPERS
# ============================================================

def to_langchain_messages(messages: list[dict]) -> list[AnyMessage]:
    """Convert [{"role": "user", "content": "..."}] into LangChain messages."""

    result: list[AnyMessage] = []

    for message in messages:
        role = message.get("role")
        content = message.get("content", "")

        if role == "user":
            result.append(HumanMessage(content=content))
        elif role == "assistant":
            result.append(AIMessage(content=content))

    return result


# ============================================================
# NODES
# ============================================================

async def call_model(state: ChatState, config: RunnableConfig):
    history = state["messages"][-MAX_HISTORY:]

    prompt = [
        SystemMessage(content=state["system_prompt"]),
        *history,
    ]

    response = await chat_llm.ainvoke(prompt, config)

    return {"messages": [response]}


# ============================================================
# GRAPH
#   START -> call_model -> END
# ============================================================

_builder = StateGraph(ChatState)
_builder.add_node("call_model", call_model)
_builder.add_edge(START, "call_model")
_builder.add_edge("call_model", END)

chat_graph = _builder.compile(name="heritage_chat")


# ============================================================
# POST-STREAM EVAL (runs in the background)
#
# Tokens are already on the user's screen, so a chat reply cannot be
# "corrected" - we score it and log the result to LangSmith instead.
# ============================================================

async def _evaluate_reply(
    run_id,
    reply: str,
    question: str,
    site_name: str | None,
    language: str,
):
    try:
        report = await evaluate_output(
            task="chat",
            subject=reply,
            rule_issues=chat_checks(reply, language),
            criteria=CHAT_CRITERIA,
            context=(
                f"Heritage site: {site_name}\n"
                f"Requested language: {language}\n"
                f"User message: {question}"
            ),
            config={
                "tags": ["heritage", "chat-eval"],
                "metadata": {"chat_run_id": str(run_id)},
            },
        )

        await log_report(run_id, report.to_dict(), "chat")

        if not report.passed:
            print("CHAT EVAL FAILED:", report.issues)

    except Exception as error:
        print("CHAT EVAL ERROR:", error)


# ============================================================
# PUBLIC API
# ============================================================

async def stream_chat_graph(
    system_prompt: str,
    messages: list[dict],
    site_name: str | None = None,
    language: str | None = None,
) -> AsyncIterator[str]:

    language = language or "en"
    run_id = uuid.uuid4()

    state = {
        "system_prompt": system_prompt,
        "messages": to_langchain_messages(messages),
    }

    config: RunnableConfig = {
        "run_id": run_id,
        "run_name": "heritage_chat",
        "tags": ["heritage", "chat"],
        "metadata": {
            "site_name": site_name,
            "language": language,
            "history_length": len(messages),
        },
    }

    parts: list[str] = []

    async for chunk, meta in chat_graph.astream(
        state,
        config=config,
        stream_mode="messages",
    ):
        if meta.get("langgraph_node") != "call_model":
            continue

        if isinstance(chunk, AIMessageChunk) and chunk.content:
            parts.append(chunk.content)
            yield chunk.content

    # stream finished -> score the full reply without slowing the user down
    last_user = next(
        (m.get("content", "") for m in reversed(messages) if m.get("role") == "user"),
        "",
    )

    task = asyncio.create_task(
        _evaluate_reply(run_id, "".join(parts), last_user, site_name, language)
    )
    _background_tasks.add(task)
    task.add_done_callback(_background_tasks.discard)