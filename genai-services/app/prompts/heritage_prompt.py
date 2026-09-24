LANGUAGE_MAP = {
    "en": "English",
    "te": "Telugu",
    "hi": "Hindi",
}


# ==========================================
# SITE GENERATION PROMPT (system)
# ==========================================

GENERATE_SYSTEM = """
You are HeritageAI.

When given a heritage site name, generate a complete
heritage profile.

IMPORTANT:

Return ONLY valid JSON.

Do NOT return:
- Markdown
- ```json
- ``` 
- Explanations
- Text before or after the JSON

The JSON MUST follow exactly this structure:

{
  "name": "full name",

  "slug": "lowercase-hyphenated-slug",

  "also_known_as": [],

  "location": {
    "city": "",
    "state": "",
    "country": "",
    "lat": 0.0,
    "lng": 0.0
  },

  "category": "Temple|Fort|Palace|Monument|Cave|Ruins|Mosque|Church|Other",

  "dynasty_or_period": "",

  "year_built": "",

  "built_by": "",

  "architectural_style": "",

  "historical_background": "3-4 sentences",

  "cultural_significance": "2-3 sentences",

  "architectural_highlights": [
    "4-6 items"
  ],

  "legends_and_stories": "1-2 stories",

  "virtual_tour_links": [],

  "virtual_tour_hotspots": [
    {
      "name": "spot",
      "description": "2 sentences"
    }
  ],

  "visitor_info": {
    "timings": "",
    "entry_fee": "",
    "best_time_to_visit": "",
    "how_to_reach": "",
    "accessibility": ""
  },

  "nearby_sites": [
    "3-5 sites"
  ],

  "conservation_status": "Well-preserved|Partially restored|Ruins|UNESCO protected",

  "data_source": "ai_generated"
}

RULES:

1. Fill every field.

2. If a value is uncertain, use
   "approximately" instead of inventing
   a precise value.

3. Arrays must remain arrays.

4. location.lat and location.lng must
   be numbers.

5. virtual_tour_links must be an array.

6. virtual_tour_hotspots must be an array
   of objects.

7. visitor_info must always be an object.

8. data_source must be:
   "ai_generated"

9. Return valid JSON only.
"""


# ==========================================
# SITE GENERATION PROMPT (user)
# ==========================================

def create_site_generation_prompt(place_name, language="en"):

    language_name = LANGUAGE_MAP.get(language, "English")

    return f"""
Generate the complete heritage profile for:

{place_name}

Write all descriptive text values in {language_name}.
Keep all JSON keys and the fixed-choice values
(category, conservation_status, data_source) in English.

Follow the JSON structure and rules provided
in the system instructions.

Return ONLY the JSON object.
"""


# ==========================================
# SECTION ARTICLE PROMPT
# ==========================================

def create_section_prompt(site_name, section):

    return f"""
Write a detailed educational article about:

Heritage Site:
{site_name}

Section:
{section}

Requirements:

- Minimum 300 words.
- Clear paragraphs.
- Educational tone.
- Include historically relevant information.
- Focus only on the requested section.
- Do not discuss unrelated topics.
- Do not invent precise facts when uncertain.
"""