"""
Service layer. Routes only talk to this file;
the actual logic lives in the LangGraph graphs (app/graphs).
"""

from app.graphs.chat_graph import stream_chat_graph
from app.graphs.site_graph import run_site_graph
from app.graphs.section_graph import run_section_graph


# ============================================================
# CHAT STREAMING
# ============================================================

async def stream_chat(
    system_prompt,
    messages,
    site_name=None,
    language=None,
):
    async for token in stream_chat_graph(
        system_prompt,
        messages,
        site_name=site_name,
        language=language,
    ):
        yield token


# ============================================================
# SITE GENERATION (validated JSON, auto-retry)
# ============================================================

async def generate_site(
    system_prompt,
    user_prompt,
    place_name=None,
    language=None,
):
    return await run_site_graph(
        system_prompt,
        user_prompt,
        place_name=place_name,
        language=language,
    )


# ============================================================
# SECTION ARTICLE
# ============================================================

async def generate_section(site_name, section):
    return await run_section_graph(site_name, section)