const { chatCompletion } = require('../lib/openrouter');

const generateTrail = async (req, res) => {
  try {
    const { start_place, duration, interest, transport } = req.body;

    const system = `You are a heritage trail planner. Return ONLY valid JSON — no markdown.`;

    const userMsg = `Create a heritage trail from ${start_place} for a ${duration} trip.
Traveler: ${interest}, transport: ${transport}.

Return:
{
  "theme": "trail theme name",
  "total_distance": "X km",
  "total_sites": 5,
  "opening_hook": "one compelling sentence",
  "stops": [{
    "stop_number": 1,
    "site_name": "",
    "distance_from_previous": "X km",
    "travel_time": "X min by car",
    "recommended_duration": "X hours",
    "why_visit": "one reason for this traveler",
    "must_see": "most important thing",
    "entry_fee": "",
    "food_nearby": "name and type"
  }],
  "sunrise_spot": "name – reason",
  "sunset_spot": "name – reason"
}`;

    const raw = await chatCompletion(system, userMsg, 2000);
    const cleaned = raw.replace(/```json|```/g, '').trim();
    res.json(JSON.parse(cleaned));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { generateTrail };