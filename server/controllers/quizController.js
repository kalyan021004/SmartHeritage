const { chatCompletion } = require('../lib/openrouter');

const generateQuiz = async (req, res) => {
  try {
    const { site_name, site_context, count = 6, difficulty = 'mixed' } = req.body;

    const system = `You are a heritage quiz generator. Return ONLY a valid JSON array — no markdown, no explanation.`;

    const userMsg = `Generate ${count} quiz questions about ${site_name}.
Site data: ${JSON.stringify(site_context)}
Difficulty: ${difficulty}

Return array format:
[{
  "id": 1,
  "type": "mcq",
  "difficulty": "easy",
  "question": "",
  "options": ["A","B","C","D"],
  "correct": "A",
  "explanation": "2 sentences with a bonus fact",
  "category": "history|architecture|mythology|visitor_info"
}]

Mix mcq, true_false, fill_blank. No trick questions. No current pricing questions.`;

    const raw = await chatCompletion(system, userMsg, 2000);
    const cleaned = raw.replace(/```json|```/g, '').trim();
    const questions = JSON.parse(cleaned);
    res.json({ questions });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { generateQuiz };