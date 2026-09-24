from dotenv import load_dotenv
from langchain_groq import ChatGroq

# Must run before any LangChain / LangGraph / LangSmith call so that
# LANGSMITH_TRACING, LANGSMITH_API_KEY and LANGSMITH_PROJECT are in os.environ.
load_dotenv()

MODEL_NAME = "openai/gpt-oss-120b"

# Token-streamed chat answers
chat_llm = ChatGroq(
    model=MODEL_NAME,
    temperature=0.3,
    streaming=True,
)

# Long-form section articles (not streamed)
content_llm = ChatGroq(
    model=MODEL_NAME,
    temperature=0.3,
)

# Structured JSON generation (lower temperature = more stable JSON)
json_llm = ChatGroq(
    model=MODEL_NAME,
    temperature=0.2,
)