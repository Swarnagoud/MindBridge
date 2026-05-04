require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const normalizeOrigin = (value) => String(value || '').trim().replace(/\/+$/, '');
const rawOrigins = (process.env.FRONTEND_URLS || process.env.FRONTEND_URL || '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);
const allowAllOrigins = rawOrigins.includes('*');
const allowedOrigins = rawOrigins.filter((o) => o !== '*').map(normalizeOrigin);

// Avoid `Access-Control-Allow-Origin: *` with `credentials: true` (browsers block it).
app.use(
  cors({
    origin: (origin, cb) => {
      // Allow non-browser clients (curl/postman) and same-origin server-to-server calls.
      if (!origin) return cb(null, true);
      if (allowAllOrigins) return cb(null, true);
      if (allowedOrigins.length === 0) return cb(null, true);
      const normalized = normalizeOrigin(origin);
      if (allowedOrigins.includes(normalized)) return cb(null, true);
      return cb(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true
  })
);
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Helpful deployment diagnostics (no secrets).
console.log('Env check:', {
  hasMongo: Boolean(process.env.MONGODB_URI),
  hasJwt: Boolean(process.env.JWT_SECRET),
  hasFrontendUrl: Boolean(process.env.FRONTEND_URL || process.env.FRONTEND_URLS),
  hasOpenAIKey: Boolean(process.env.OPENAI_API_KEY),
  hasOpenRouterKey: Boolean(process.env.OPENROUTER_API_KEY),
  hasGrokKey: Boolean(process.env.GROK_API_KEY)
});

app.get('/', (_req, res) => {
  res.json({
    ok: true,
    service: 'mindbridge-backend',
    health: '/api/health'
  });
});

app.use('/api/auth', require('./routes/auth'));
app.use('/api/chat', require('./routes/chat'));
app.use('/api/health', require('./routes/health'));
app.use('/api/mood', require('./routes/mood'));
app.use('/api/recommend', require('./routes/recommend'));
app.use('/api/counselors', require('./routes/counselors'));
app.use('/api/bookings', require('./routes/bookings'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
