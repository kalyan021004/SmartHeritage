const { chatCompletion } = require('../lib/openrouter');

const narrateHotspot = async (req, res) => {
  try {
    const { site_name, hotspot_name, site_context } = req.body;

    const system = `You are an immersive audio guide narrator. Write vivid, engaging narrations in second person present tense. Plain text only — no markdown, no bullet points.`;

    const userMsg = `Site: ${site_name}
Context: ${JSON.stringify(site_context)}
Current hotspot: "${hotspot_name}"

Write a 100-word narration including:
1. What this spot is and its historical importance
2. One detail most visitors miss
3. A transition sentence to the next area`;

    const narration = await chatCompletion(system, userMsg, 300);
    res.json({ narration });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { narrateHotspot };