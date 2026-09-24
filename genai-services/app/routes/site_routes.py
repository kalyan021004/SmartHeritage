from fastapi import APIRouter, HTTPException

from app.prompts.heritage_prompt import (
    GENERATE_SYSTEM,
    create_site_generation_prompt,
)

from app.services.llm_service import (
    generate_site,
    generate_section as generate_section_content,
)


router = APIRouter()

ALLOWED_SECTIONS = ["history", "architecture", "culture", "visitor"]


# ============================================================
# GENERATE COMPLETE SITE
# ============================================================

@router.post("/generate")
async def generate_site_route(data: dict):

    place_name = data.get("place_name")
    language = data.get("language", "en")

    if not place_name:
        raise HTTPException(status_code=400, detail="place_name required")

    prompt = create_site_generation_prompt(place_name, language)

    try:
        return await generate_site(
            GENERATE_SYSTEM,
            prompt,
            place_name=place_name,
            language=language,
        )

    except Exception as e:
        print("SITE GENERATION ERROR:", str(e))

        raise HTTPException(
            status_code=500,
            detail="Failed to generate heritage site",
        )


# ============================================================
# GENERATE SITE SECTION
# ============================================================

@router.post("/section")
async def generate_section(data: dict):

    site_name = data.get("site_name")
    section = data.get("section")

    if not site_name:
        raise HTTPException(status_code=400, detail="site_name required")

    if not section:
        raise HTTPException(status_code=400, detail="section required")

    if section not in ALLOWED_SECTIONS:
        raise HTTPException(status_code=400, detail="Invalid section")

    try:
        content = await generate_section_content(site_name, section)

        if not content:
            raise HTTPException(
                status_code=500,
                detail="LLM returned empty content",
            )

        return {
            "content": content,
            "keywords": f"{site_name} {section}",
        }

    except HTTPException:
        raise

    except Exception as e:
        print("SECTION GENERATION ERROR:", str(e))

        raise HTTPException(
            status_code=500,
            detail="Failed to generate section",
        )