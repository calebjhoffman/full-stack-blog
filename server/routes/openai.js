import express from 'express';
import openai from '../lib/openai.js';
import authenticateToken from '../middleware/authenticateToken.js';

const router = express.Router();

router.post('/generate', authenticateToken, async (req, res) => {
  const { prompt } = req.body;

  if (!prompt || prompt.length < 10) {
    return res.status(400).json({ error: 'Prompt too short' });
  }

  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Transfer-Encoding', 'chunked');

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      stream: true, // ✅ streaming mode
    });

    for await (const chunk of completion) {
      const delta = chunk.choices?.[0]?.delta?.content;
      if (delta) {
        res.write(delta);
      }
    }

    res.end(); // ✅ signal end of stream
  } catch (err) {
    console.error('OpenAI stream error:', err);
    res.status(500).json({ error: 'Failed to stream content' });
  }
});

export default router;
