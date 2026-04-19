export function detectTourType(url) {
  if (!url) return "unknown";

  const u = url.toLowerCase();

  // Google Maps
  if (
    u.includes("google.com/maps") ||
    u.includes("maps.app.goo.gl")
  )
    return "maps";

  // Google Arts
  if (
    u.includes("artsandculture.google.com") ||
    u.includes("g.co/arts")
  )
    return "arts";

  // YouTube
  if (
    u.includes("youtube.com") ||
    u.includes("youtu.be")
  )
    return "youtube";

  // Government / tourism virtual tours
  if (
    u.includes("tamilnadutourism") ||
    u.includes("incredibleindia") ||
    u.includes("tourism.gov") ||
    u.includes("virtualtour") ||
    u.includes("tn.gov.in")
  )
    return "external";

  // Common 360 / VR platforms
  if (
    u.includes("touritvirtually") ||
    u.includes("matterport") ||
    u.includes("kuula") ||
    u.includes("roundme") ||
    u.includes("360")
  )
    return "external";

  return "unknown";
}