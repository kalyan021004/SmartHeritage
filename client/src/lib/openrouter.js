const axios = require('axios');

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';
const MODEL = process.env.OPENROUTER_MODEL || 'deepseek/deepseek-r1:free';

/**
 * Send a chat request to OpenRouter (DeepSeek R1 free).
 * Returns the full response text.
 */
async function chatCompletion(systemPrompt, userMessage, maxTokens = 2000) {
  const response = await axios.post(
    OPENROUTER_URL,
    {
      model: MODEL,
      max_tokens: maxTokens,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user',   content: userMessage },
      ],
    },
    {
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'http://localhost:5000',
        'X-Title': 'Heritage Explorer',
      },
    }
  );
  return response.data.choices[0].message.content;
}

/**
 * Stream a chat response to an Express res object (SSE).
 */
async function streamCompletion(systemPrompt, messages, res) {
  const response = await axios.post(
    OPENROUTER_URL,
    {
      model: MODEL,
      max_tokens: 600,
      stream: true,
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages,
      ],
    },
    {
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'http://localhost:5000',
        'X-Title': 'Heritage Explorer',
      },
      responseType: 'stream',
    }
  );

  response.data.on('data', (chunk) => {
    const lines = chunk.toString().split('\n').filter(l => l.trim());
    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const data = line.slice(6);
        if (data === '[DONE]') return;
        try {
          const parsed = JSON.parse(data);
          const token = parsed.choices?.[0]?.delta?.content;
          if (token) res.write(`data: ${JSON.stringify({ token })}\n\n`);
        } catch {}
      }
    }
  });

  response.data.on('end', () => {
    res.write('data: [DONE]\n\n');
    res.end();
  });
}

module.exports = { chatCompletion, streamCompletion };