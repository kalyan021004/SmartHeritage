from dotenv import load_dotenv

# Load .env FIRST so LangSmith variables are set before LangChain is imported
load_dotenv()

import os

from fastapi import FastAPI

from app.routes.chat import router as chat_router
from app.routes.site_routes import router as site_router


app = FastAPI(title="Heritage Explorer GenAI Service")

app.include_router(chat_router, prefix="/api")
app.include_router(site_router, prefix="/api/site")


@app.get("/")
async def root():
    return {
        "message": "Heritage GenAI Service is running",
        "langsmith_tracing": os.getenv("LANGSMITH_TRACING", "false"),
        "langsmith_project": os.getenv("LANGSMITH_PROJECT", "default"),
    }