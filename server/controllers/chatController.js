const axios = require('axios');

const chatWithSite = async (req, res) => {
    try {
        const { messages, site_context } = req.body;

        console.log("========== CHAT DEBUG ==========");
        console.log("Site:", site_context?.name);
        console.log("Language:", site_context?.language);
        console.log("Messages count:", messages?.length);

        // SSE headers for frontend
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');

        const response = await axios({
            method: 'POST',

            // Your hosted Python service
            url: `${process.env.GENAI_SERVICE_URL}/api/chat`,

            data: {
                messages,
                site_context
            },

            responseType: 'stream'
        });

        // Python → Node → Frontend
        response.data.on('data', (chunk) => {

            const text = chunk.toString();

            res.write(
                `data: ${JSON.stringify({
                    content: text
                })}\n\n`
            );
        });

        response.data.on('end', () => {

            console.log("GenAI stream completed");

            res.write('data: [DONE]\n\n');

            res.end();
        });

        response.data.on('error', (error) => {

            console.error(
                "GenAI stream error:",
                error.message
            );

            res.write(
                `data: ${JSON.stringify({
                    error: 'GenAI service stream failed'
                })}\n\n`
            );

            res.end();
        });

    } catch (error) {

        console.error(
            "CHAT ERROR:",
            error.message
        );

        if (!res.headersSent) {

            res.status(500).json({
                error: 'GenAI service unavailable'
            });

        } else {

            res.write(
                `data: ${JSON.stringify({
                    error: 'GenAI service unavailable'
                })}\n\n`
            );

            res.end();
        }
    }
};

module.exports = {
    chatWithSite
};