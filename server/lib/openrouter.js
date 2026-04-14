const axios = require('axios');

async function chatCompletion(systemPrompt, userMessage, maxTokens = 2000) {
  const response = await axios.post(
    'https://api.groq.com/openai/v1/chat/completions',
    {
      model: 'llama-3.3-70b-versatile',
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
  const lastMsg = messages[messages.length - 1]?.content || '';
  const reply = await chatCompletion(systemPrompt, lastMsg, 600);
  res.write(`data: ${JSON.stringify({ token: reply })}\n\n`);
  res.write('data: [DONE]\n\n');
  res.end();
}

module.exports = { chatCompletion, streamCompletion };