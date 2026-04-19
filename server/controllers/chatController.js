const { streamCompletion } = require('../lib/openrouter');

const chatWithSite = async (req, res) => {
  try {
    const { messages, site_context } = req.body;

    // 🔍 DEBUG: Incoming request
    console.log("========== CHAT DEBUG ==========");
    console.log("Site:", site_context?.name);
    console.log("Language received:", site_context?.language);
    console.log("Messages count:", messages?.length);
    console.log("Timestamp:", new Date().toISOString());

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // Determine language name
    let languageName = "English";

    if (site_context.language === "te") {
      languageName = "Telugu";
    }

    if (site_context.language === "hi") {
      languageName = "Hindi";
    }

    if (site_context.language === "en") {
      languageName = "English";
    }

    // 🔍 DEBUG: Final language decision
    console.log("Language used:", languageName);

    const system = `
You are an AI heritage guide narrating the story of ${site_context.name}.

IMPORTANT:
Always respond ONLY in ${languageName}.
Do not mix languages.
Do not translate to English unless the selected language is English.

STYLE:
- Speak like a professional tour guide
- Keep answers concise and engaging

RULES:
- Answer only about this site
- End every narration with one curiosity question
`;

    // 🔍 DEBUG: System prompt preview
    console.log("System prompt language check:", languageName);

    // Optional performance debug
    const startTime = Date.now();

    await streamCompletion(system, messages, res);

    const endTime = Date.now();

    // 🔍 DEBUG: Response time
    console.log(
      "Streaming completed in:",
      endTime - startTime,
      "ms"
    );

    console.log("========== END CHAT ==========");

  } catch (err) {
    console.error("❌ CHAT ERROR:", err.message);

    res.write(
      `data: ${JSON.stringify({
        error: err.message
      })}\n\n`
    );

    res.end();
  }
};

module.exports = { chatWithSite };