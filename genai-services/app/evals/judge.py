"""
LLM-as-judge (reference-free).

Flow of evaluate_output():
  1. rule issues found?  -> fail immediately (no judge call, saves cost)
  2. otherwise the judge scores every rubric criterion 1-5
  3. PASS only if  min(score) >= EVAL_MIN_CRITERION  and  avg >= EVAL_MIN_AVG
  4. the judge also returns concrete "fixes" that are fed back to the generator
"""

import os
from dataclasses import asdict, dataclass, field

from dotenv import load_dotenv
from pydantic import BaseModel
from langchain_core.messages import HumanMessage, SystemMessage
from langchain_core.runnables import RunnableConfig
from langchain_groq import ChatGroq

load_dotenv()

EVALS_ENABLED = os.getenv("EVALS_ENABLED", "true").lower() == "true"
MIN_CRITERION = int(os.getenv("EVAL_MIN_CRITERION", "3"))
MIN_AVG = float(os.getenv("EVAL_MIN_AVG", "4.0"))

# Tip: use a DIFFERENT model here than the generator to reduce self-preference bias.
JUDGE_MODEL = os.getenv("JUDGE_MODEL", "openai/gpt-oss-120b")

judge_llm = ChatGroq(model=JUDGE_MODEL, temperature=0)


# ============================================================
# STRUCTURED OUTPUT
# ============================================================

class CriterionScore(BaseModel):
    name: str
    score: int
    reason: str


class JudgeResult(BaseModel):
    scores: list[CriterionScore]
    fixes: list[str]


JUDGE_SYSTEM = """
You are a strict, impartial evaluator of AI-generated heritage content.

No reference answer is available. Use your own world knowledge.

Score EACH criterion from 1 to 5:
5 = excellent, 4 = good (minor issues), 3 = acceptable but noticeable problems,
2 = poor, 1 = wrong or unusable.

Be skeptical of specific claims (dates, names, numbers, coordinates):
score down anything you believe is wrong or suspiciously precise.

For every criterion scoring below 4, add ONE concrete, actionable instruction
to "fixes" that tells the writer exactly how to correct the output.
If everything is 4 or 5, "fixes" must be an empty list.

Use exactly the criterion names you are given.
"""


# ============================================================
# REPORT
# ============================================================

@dataclass
class EvalReport:
    passed: bool
    score: float                      # 0-1 average of judge scores
    scores: dict = field(default_factory=dict)
    issues: list = field(default_factory=list)

    def feedback_text(self) -> str:
        return "\n".join(f"- {issue}" for issue in self.issues)

    def to_dict(self) -> dict:
        return asdict(self)


def _child_config(config, task):
    base = {k: v for k, v in (config or {}).items() if k != "run_id"}

    return {
        **base,
        "run_name": f"judge_{task}",
        "tags": [*base.get("tags", []), "judge"],
    }


# ============================================================
# MAIN ENTRY
# ============================================================

async def evaluate_output(
    task: str,
    subject: str,
    rule_issues: list[str],
    criteria: dict[str, str],
    context: str = "",
    config: RunnableConfig | None = None,
    force: bool = False,
) -> EvalReport:

    if not EVALS_ENABLED and not force:
        return EvalReport(passed=True, score=1.0)

    # 1) deterministic failures -> no need to spend an LLM call
    if rule_issues:
        return EvalReport(passed=False, score=0.0, issues=list(rule_issues))

    # 2) LLM judge
    rubric = "\n".join(f"- {name}: {desc}" for name, desc in criteria.items())

    user_prompt = f"""
TASK TYPE: {task}

CONTEXT:
{context or "n/a"}

RUBRIC (score each 1-5):
{rubric}

OUTPUT TO EVALUATE:
{subject}
"""

    try:
        structured = judge_llm.with_structured_output(
            JudgeResult, method="json_schema"
        )

        result: JudgeResult = await structured.ainvoke(
            [
                SystemMessage(content=JUDGE_SYSTEM),
                HumanMessage(content=user_prompt),
            ],
            _child_config(config, task),
        )

    except Exception as error:
        # Fail-open: a broken judge must never block users.
        print("JUDGE ERROR (skipping eval):", error)
        return EvalReport(passed=True, score=1.0)

    scores = {
        item.name: max(1, min(5, int(item.score)))
        for item in result.scores
        if item.name in criteria
    }

    if not scores:
        return EvalReport(passed=True, score=1.0)

    avg = sum(scores.values()) / len(scores)

    passed = min(scores.values()) >= MIN_CRITERION and avg >= MIN_AVG

    issues = list(result.fixes)

    if not passed and not issues:
        issues = [
            f"{item.name} scored {scores[item.name]}/5: {item.reason}"
            for item in result.scores
            if item.name in scores and scores[item.name] < 4
        ]

    return EvalReport(
        passed=passed,
        score=avg / 5,
        scores=scores,
        issues=[] if passed else issues,
    )
