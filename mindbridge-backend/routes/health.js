const express = require('express');
const axios = require('axios');

const router = express.Router();

// Basic service health (no external provider dependency).
router.get('/', (_req, res) => {
  return res.json({
    ok: true,
    status: 'ok'
  });
});

const mapProviderError = (status) => {
  if (status === 401 || status === 403) return 'auth_failed';
  if (status === 402) return 'quota_exceeded';
  if (status === 429) return 'rate_limited';
  if (status >= 500) return 'provider_error';
  return 'request_failed';
};

router.get('/chat', async (_req, res) => {
  const openAiKey = process.env.OPENAI_API_KEY;
  const openRouterKey = process.env.OPENROUTER_API_KEY || process.env.GROK_API_KEY;
  const useOpenAI = Boolean(openAiKey);

  if (!openAiKey && !openRouterKey) {
    return res.status(500).json({
      ok: false,
      status: 'missing_key',
      provider: 'none',
      detail: 'Set OPENAI_API_KEY (preferred) or OPENROUTER_API_KEY in backend .env'
    });
  }

  const endpoint = useOpenAI
    ? (process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1/chat/completions')
    : 'https://openrouter.ai/api/v1/chat/completions';
  const model = process.env.OPENAI_MODEL || 'gpt-4o-mini';
  const provider = useOpenAI ? 'openai' : 'openrouter';

  try {
    await axios.post(
      endpoint,
      {
        model,
        messages: [{ role: 'user', content: 'Health check: reply with OK.' }],
        max_tokens: 5,
        temperature: 0
      },
      {
        timeout: 12000,
        headers: {
          Authorization: `Bearer ${useOpenAI ? openAiKey : openRouterKey}`,
          'Content-Type': 'application/json',
          ...(useOpenAI
            ? {}
            : {
                'HTTP-Referer': process.env.FRONTEND_URL || 'http://localhost:5173',
                'X-Title': 'MindBridge'
              })
        }
      }
    );

    return res.json({
      ok: true,
      status: 'ok',
      provider,
      model
    });
  } catch (err) {
    const statusCode = err.response?.status;
    return res.status(500).json({
      ok: false,
      status: mapProviderError(statusCode),
      provider,
      model,
      detail: err.response?.data?.error?.message || err.message
    });
  }
});

module.exports = router;
