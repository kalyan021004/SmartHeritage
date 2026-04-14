const { streamCompletion } = require('../lib/openrouter');

const chatWithSite = async (req, res) => {
  try {
    const { messages, site_context } = req.body;

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const system = `You are the AI heritage guide for ${site_context.name}.
SITE DATA: ${JSON.stringify(site_context)}
RULES:
- Answer only about this site and its direct context
- 2-4 sentences for simple questions, up to 8 for complex
- Detect user intent:
  * "story/tell me" → narrative mode, historical character voice
  * "simply/explain" → simple mode, short sentences
  * "architect" → technical structural analysis
  * "myth/legend" → mythology mode with cultural sensitivity
- End every answer with one follow-up question to keep the visitor curious
- Never fabricate specific dates or measurements without flagging as estimate`;

    await streamCompletion(system, messages, res);
  } catch (err) {
    res.write(`data: ${JSON.stringify({ error: err.message })}\n\n`);
    res.end();
  }
};

module.exports = { chatWithSite };