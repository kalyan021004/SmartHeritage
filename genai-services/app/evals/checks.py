"""
Deterministic (rule-based) checks. Cheap, instant and 100% reliable,
so they run BEFORE the LLM judge. Each function returns a list of issues
(empty list = pass).
"""

import re

ALLOWED_CATEGORIES = {
    "Temple", "Fort", "Palace", "Monument", "Cave",
    "Ruins", "Mosque", "Church", "Other",
}

ALLOWED_STATUS = {
    "Well-preserved", "Partially restored", "Ruins", "UNESCO protected",
}

SLUG_RE = re.compile(r"^[a-z0-9]+(?:-[a-z0-9]+)*$")

SCRIPT_RANGES = {
    "te": (0x0C00, 0x0C7F),   # Telugu
    "hi": (0x0900, 0x097F),   # Devanagari
}


def _blank(value) -> bool:
    return value is None or not str(value).strip()


def _is_number(value) -> bool:
    return isinstance(value, (int, float)) and not isinstance(value, bool)


def script_ratio(text: str, language: str) -> float:
    """Share of letters written in the expected script."""

    letters = [c for c in text if c.isalpha()]

    if not letters:
        return 0.0

    if language in SCRIPT_RANGES:
        lo, hi = SCRIPT_RANGES[language]
        hits = sum(lo <= ord(c) <= hi for c in letters)
    else:
        hits = sum(c.isascii() for c in letters)

    return hits / len(letters)


def _language_issue(text: str, language: str, label: str):
    threshold = 0.9 if language not in SCRIPT_RANGES else 0.7
    ratio = script_ratio(text, language)

    if ratio < threshold:
        return (
            f"{label} must be written in the requested language "
            f"('{language}'), but only {ratio:.0%} of it is."
        )

    return None


# ============================================================
# SITE PROFILE (JSON)
# ============================================================

def site_checks(data: dict, language: str = "en") -> list[str]:
    issues: list[str] = []

    for key in (
        "name", "slug", "dynasty_or_period", "year_built", "built_by",
        "architectural_style", "historical_background",
        "cultural_significance", "legends_and_stories",
    ):
        if _blank(data.get(key)):
            issues.append(f"'{key}' is empty.")

    slug = str(data.get("slug", ""))
    if slug and not SLUG_RE.match(slug):
        issues.append("'slug' must be lowercase-hyphenated (a-z, 0-9, '-').")

    if data.get("category") not in ALLOWED_CATEGORIES:
        issues.append(
            f"'category' must be one of {sorted(ALLOWED_CATEGORIES)}."
        )

    if data.get("conservation_status") not in ALLOWED_STATUS:
        issues.append(
            f"'conservation_status' must be one of {sorted(ALLOWED_STATUS)}."
        )

    if data.get("data_source") != "ai_generated":
        issues.append("'data_source' must be exactly 'ai_generated'.")

    # ---- location ----
    location = data.get("location")

    if not isinstance(location, dict):
        issues.append("'location' must be an object.")
    else:
        for key in ("city", "state", "country"):
            if _blank(location.get(key)):
                issues.append(f"'location.{key}' is empty.")

        lat, lng = location.get("lat"), location.get("lng")

        if not (_is_number(lat) and -90 <= lat <= 90):
            issues.append("'location.lat' must be a number between -90 and 90.")
        if not (_is_number(lng) and -180 <= lng <= 180):
            issues.append("'location.lng' must be a number between -180 and 180.")
        if _is_number(lat) and _is_number(lng) and lat == 0 and lng == 0:
            issues.append("'location.lat/lng' are 0,0 placeholders - give real coordinates.")

    # ---- lists ----
    highlights = data.get("architectural_highlights")
    if not (isinstance(highlights, list) and 4 <= len(highlights) <= 6):
        issues.append("'architectural_highlights' must be a list of 4-6 items.")

    nearby = data.get("nearby_sites")
    if not (isinstance(nearby, list) and 3 <= len(nearby) <= 5):
        issues.append("'nearby_sites' must be a list of 3-5 items.")

    hotspots = data.get("virtual_tour_hotspots")
    if not (isinstance(hotspots, list) and hotspots):
        issues.append("'virtual_tour_hotspots' must be a non-empty list.")
    else:
        for i, spot in enumerate(hotspots):
            if not isinstance(spot, dict) or _blank(spot.get("name")) or _blank(spot.get("description")):
                issues.append(f"'virtual_tour_hotspots[{i}]' needs 'name' and 'description'.")

    if not isinstance(data.get("virtual_tour_links"), list):
        issues.append("'virtual_tour_links' must be a list.")

    # ---- visitor info ----
    visitor = data.get("visitor_info")

    if not isinstance(visitor, dict):
        issues.append("'visitor_info' must be an object.")
    else:
        for key in ("timings", "entry_fee", "best_time_to_visit",
                    "how_to_reach", "accessibility"):
            if _blank(visitor.get(key)):
                issues.append(f"'visitor_info.{key}' is empty.")

    # ---- language of the narrative fields ----
    narrative = " ".join(
        str(data.get(k, ""))
        for k in ("historical_background", "cultural_significance", "legends_and_stories")
    )
    issue = _language_issue(narrative, language, "Narrative text")
    if issue:
        issues.append(issue)

    return issues


# ============================================================
# SECTION ARTICLE
# ============================================================

def section_checks(text: str) -> list[str]:
    issues: list[str] = []

    words = len(text.split())
    if words < 300:
        issues.append(f"Article has only {words} words; it must be at least 300.")

    paragraphs = [p for p in re.split(r"\n\s*\n", text) if p.strip()]
    if len(paragraphs) < 3:
        issues.append("Article must have at least 3 clear paragraphs.")

    if "```" in text:
        issues.append("Do not include code fences.")

    return issues


# ============================================================
# CHAT REPLY
# ============================================================

def chat_checks(text: str, language: str = "en") -> list[str]:
    issues: list[str] = []

    if not text.strip():
        return ["Reply is empty."]

    issue = _language_issue(text, language, "Reply")
    if issue:
        issues.append(issue)

    if not text.rstrip().endswith(("?", "？")):
        issues.append("Reply must end with one curiosity question.")

    if len(text.split()) > 200:
        issues.append("Reply is too long; keep it concise (under ~200 words).")

    return issues
