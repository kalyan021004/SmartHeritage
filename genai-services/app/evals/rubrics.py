"""
Reference-free rubrics.

There is no "correct answer" to compare against, so every output is scored
1-5 per criterion by an LLM judge that uses its own world knowledge.
Edit / add criteria here - the graphs and offline evals pick them up.
"""

SITE_CRITERIA = {
    "factual_accuracy": (
        "Names, dynasties, dates, builders and events are historically correct "
        "for THIS site. Wrong or invented specifics score low. Uncertain values "
        "must be hedged (e.g. 'approximately'), not stated as exact."
    ),
    "internal_consistency": (
        "Fields agree with each other: dynasty vs year_built vs built_by; "
        "city/state/country match lat/lng; nearby_sites are really near this "
        "site; category matches the description."
    ),
    "completeness_depth": (
        "Every field is meaningfully filled (no placeholders or generic filler). "
        "Highlights, legends and hotspots are specific to THIS site, and sentence "
        "counts roughly follow the schema instructions."
    ),
    "visitor_info_usefulness": (
        "timings, entry_fee, best_time_to_visit, how_to_reach and accessibility "
        "are specific and plausible, or honestly hedged."
    ),
    "language_and_tone": (
        "Descriptive text is in the requested language, clear, educational, "
        "and free of marketing fluff."
    ),
}

SECTION_CRITERIA = {
    "section_focus": (
        "Covers ONLY the requested section (history / architecture / culture / "
        "visitor) of the requested site, with no drifting to unrelated topics."
    ),
    "factual_accuracy": (
        "Facts are correct for this site; no fabricated precise dates, numbers "
        "or names. Uncertainty is hedged."
    ),
    "depth_and_structure": (
        "At least ~300 words, clear paragraphs, logical flow, concrete details "
        "rather than generic statements."
    ),
    "educational_tone": "Professional, neutral, educational historian voice.",
}

CHAT_CRITERIA = {
    "on_topic": (
        "Answers only about the given heritage site and refuses / redirects "
        "unrelated topics."
    ),
    "factual_accuracy": "No invented or clearly wrong facts about the site.",
    "guide_style": (
        "Sounds like a professional tour guide: concise, engaging, easy to follow."
    ),
    "curiosity_question": (
        "Ends with exactly one curiosity question that invites further "
        "exploration of the site."
    ),
    "language_purity": (
        "Written entirely in the requested language, no language mixing "
        "(proper nouns excepted)."
    ),
}
