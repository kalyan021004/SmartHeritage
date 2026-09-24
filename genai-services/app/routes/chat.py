from fastapi import APIRouter
from fastapi.responses import StreamingResponse

from app.services.llm_service import stream_chat
from app.prompts.chat_prompt import create_chat_prompt


router = APIRouter()


@router.post("/chat")
async def chat(data: dict):

    messages = data.get("messages", [])
    site_context = data.get("site_context", {})

    site_name = site_context.get("name", "Unknown Heritage Site")
    language = site_context.get("language", "en")

    system_prompt = create_chat_prompt(site_name, language)

    async def generate():

        async for chunk in stream_chat(
            system_prompt,
            messages,
            site_name=site_name,
            language=language,
        ):
            yield chunk

    return StreamingResponse(
        generate(),
        media_type="text/plain",
    )