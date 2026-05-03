const express = require('express');
const axios = require('axios');
const Chat = require('../models/Chat');
const auth = require('../middleware/auth');

const router = express.Router();
const FALLBACK_AI_RESPONSE = "I'm here with you. I couldn't reach the support engine for a moment, but let's continue. Try a slow breath in for 4 counts, hold for 4, and exhale for 6.";

router.post('/', auth, async (req, res) => {
  const { message, language = 'en' } = req.body;
  const userId = req.user.id;

  if (!message || !message.trim()) {
    return res.status(400).json({ message: 'Message is required.' });
  }

  const lowerMessage = message.toLowerCase();
  const crisisKeywords = ['suicide', 'kill myself', 'want to die', 'self harm', 'self-harm'];
  const isCrisis = crisisKeywords.some((keyword) => lowerMessage.includes(keyword));

  // Simple sentiment detection
  let sentiment = 'neutral';
  if (lowerMessage.includes('stress') || lowerMessage.includes('overwhelmed')) sentiment = 'stress';
  else if (lowerMessage.includes('anxious') || lowerMessage.includes('worried')) sentiment = 'anxiety';
  else if (lowerMessage.includes('sad') || lowerMessage.includes('depressed')) sentiment = 'sadness';
  else if (lowerMessage.includes('happy') || lowerMessage.includes('good')) sentiment = 'happy';

  if (isCrisis) {
    const crisisResponse = 'You matter, and immediate help is available now. Please contact Tele MANAS: 14416 or 1-800-891-4416, Vandrevala Foundation: 9999666555, or iCALL: 9152987821.';
    const chat = new Chat({ userId, message, response: crisisResponse, sentiment: 'crisis' });
    await chat.save();
    return res.json({ response: crisisResponse, sentiment: 'crisis' });
  }

  const systemPrompt = `You are MindBridge, a warm, empathetic, non-judgmental AI mental health companion for Indian users.
Respond in 2-4 short, supportive sentences.
Detect the user's current emotion: stress, anxiety, sadness, neutral, happy.
Always suggest simple coping techniques or wellness tips when appropriate.
NEVER give medical advice.
Reply in the user's selected language code: ${language}. If uncertain, use simple English.
If the user mentions suicide, self-harm, "want to die", "kill myself", or shows very negative feelings, reply ONLY with this exact helpline message:
"You matter, and immediate help is available now. Please contact Tele MANAS: 14416 or 1-800-891-4416, Vandrevala Foundation: 9999666555, or iCALL: 9152987821."
Keep replies kind, short, and hopeful.`;

  try {
    const openAiKey = process.env.OPENAI_API_KEY;
    const openRouterKey = process.env.OPENROUTER_API_KEY || process.env.GROK_API_KEY;
    const useOpenAI = Boolean(openAiKey);

    if (!openAiKey && !openRouterKey) {
      return res.status(500).json({
        message: 'Missing AI API key',
        detail: 'Set OPENAI_API_KEY (preferred) or OPENROUTER_API_KEY in backend .env'
      });
    }

    const endpoint = useOpenAI
      ? (process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1/chat/completions')
      : 'https://openrouter.ai/api/v1/chat/completions';
    const model = process.env.OPENAI_MODEL || 'gpt-4o-mini';

    const requestConfig = {
      headers: {
        Authorization: `Bearer ${useOpenAI ? openAiKey : openRouterKey}`,
        'Content-Type': 'application/json',
        ...(useOpenAI
          ? {}
          : {
              'HTTP-Referer': process.env.FRONTEND_URL || 'http://localhost:5173',
              'X-Title': 'MindBridge'
            })
      },
      timeout: 15000
    };

    const payload = {
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message }
      ],
      temperature: 0.7
    };

    let response;
    try {
      response = await axios.post(endpoint, payload, requestConfig);
    } catch (firstErr) {
      // Retry once for transient provider/network interruptions like ECONNRESET.
      response = await axios.post(endpoint, payload, requestConfig);
    }

    const aiResponse = response?.data?.choices?.[0]?.message?.content || FALLBACK_AI_RESPONSE;

    // Save to DB
    const chat = new Chat({ userId, message, response: aiResponse, sentiment });
    await chat.save();

    res.json({ response: aiResponse, sentiment });
  } catch (err) {
    console.error('GPT API error:', err.response?.data || err.message);
    const fallbackChat = new Chat({
      userId,
      message,
      response: FALLBACK_AI_RESPONSE,
      sentiment
    });
    await fallbackChat.save();

    res.json({
      response: FALLBACK_AI_RESPONSE,
      sentiment,
      degraded: true,
      detail: err.response?.data?.error?.message || err.message
    });
  }
});

module.exports = router;