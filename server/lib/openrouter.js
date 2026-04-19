const axios = require('axios');

async function chatCompletion(systemPrompt, userMessage, maxTokens = 2000) {
  const response = await axios.post(
    'https://api.groq.com/openai/v1/chat/completions',
    {
      model: 'llama-3.1-8b-instant',
      max_tokens: maxTokens,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user',   content: userMessage },
      ],
    },
    {
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
    }
  );
  return response.data.choices[0].message.content;
}


async function streamCompletion(systemPrompt, messages, res) {
  try {
    const response = await axios({
      method: "post",
      url: "https://api.groq.com/openai/v1/chat/completions",
      responseType: "stream",

      data: {
        model: "llama-3.3-70b-versatile",
        stream: true,
        messages: [
          {
            role: "system",
            content: systemPrompt
          },
          ...messages
        ]
      },

      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json"
      }
    });

    let buffer = "";

    response.data.on("data", (chunk) => {
      buffer += chunk.toString();

      const lines = buffer.split("\n");

      buffer = lines.pop(); // keep incomplete line

      for (const line of lines) {
        if (!line.trim()) continue;

        if (line.includes("[DONE]")) {
          res.write("data: [DONE]\n\n");
          res.end();
          return;
        }

        if (line.startsWith("data: ")) {
          try {
            const json = JSON.parse(
              line.replace("data: ", "")
            );

            const token =
              json.choices?.[0]?.delta?.content;

            if (token) {
              res.write(
                `data: ${JSON.stringify({
                  token
                })}\n\n`
              );
            }

          } catch (err) {
            // Ignore partial JSON safely
            console.log("Skipping partial chunk");
          }
        }
      }
    });

    response.data.on("end", () => {
      res.end();
    });

  } catch (error) {
    console.error(error);

    res.write(
      `data: ${JSON.stringify({
        error: error.message
      })}\n\n`
    );

    res.end();
  }
}


module.exports = { chatCompletion, streamCompletion };