"""Send eval scores to LangSmith as feedback on the run."""

import asyncio
import os

from langsmith import Client

_client: Client | None = None


def tracing_enabled() -> bool:
    return (
        os.getenv("LANGSMITH_TRACING", "").lower() == "true"
        or os.getenv("LANGCHAIN_TRACING_V2", "").lower() == "true"
    )


async def log_report(run_id, report: dict, prefix: str, attempts: int | None = None):
    """
    Adds columns like  site_factual_accuracy, site_passed, site_attempts
    to the trace in LangSmith (you can filter / chart on them).
    """

    if not tracing_enabled() or not report:
        return

    def _send():
        global _client

        # make sure the run has been uploaded before attaching feedback
        from langchain_core.tracers.langchain import wait_for_all_tracers
        wait_for_all_tracers()

        _client = _client or Client()

        for name, score in (report.get("scores") or {}).items():
            _client.create_feedback(
                run_id=run_id,
                key=f"{prefix}_{name}",
                score=score / 5,
            )

        _client.create_feedback(
            run_id=run_id,
            key=f"{prefix}_passed",
            score=1.0 if report.get("passed") else 0.0,
            comment=("; ".join(report.get("issues") or []))[:1000] or None,
        )

        if attempts is not None:
            _client.create_feedback(
                run_id=run_id,
                key=f"{prefix}_attempts",
                score=float(attempts),
            )

    try:
        await asyncio.to_thread(_send)
    except Exception as error:
        print("LANGSMITH FEEDBACK ERROR:", error)
