# Project Structure

The repo is split into two independent packages — no monorepo tooling.

```
mindbridge-backend/
  server.js              # Express app entry point, DB connection, route mounting
  middleware/
    auth.js              # JWT verification middleware
  models/
    User.js              # email, password, createdAt
    Chat.js              # userId, message, response, sentiment, timestamp
    Mood.js              # userId, mood, note, date
  routes/
    auth.js              # POST /api/auth/register, /api/auth/login
    chat.js              # POST /api/chat (protected)
    mood.js              # GET/POST /api/mood (protected)
    recommend.js         # GET /api/recommend (protected)

mindbridge-frontend/
  index.html
  vite.config.js
  tailwind.config.js
  src/
    main.jsx             # React entry point
    App.jsx              # Router, auth state, layout shell
    utils/
      api.js             # All fetch calls to backend (single source of truth)
    components/          # Reusable UI pieces
      Sidebar.jsx        # Desktop navigation
      BottomNav.jsx      # Mobile navigation
      Chat.jsx
      MoodTracker.jsx
      Recommendations.jsx
      Resources.jsx
      TeleCounseling.jsx
      CrisisPopup.jsx
    pages/               # Route-level components (one per route)
      Login.jsx
      Register.jsx
      Dashboard.jsx
      ChatPage.jsx
      MoodPage.jsx
      RecommendationsPage.jsx
      ResourcesPage.jsx
      TeleCounselingPage.jsx
    styles/
      index.css          # Tailwind base styles
```

## Conventions

- **Backend routes** are mounted under `/api/<resource>` and live in `routes/`. Protected routes import and apply the `auth` middleware.
- **Frontend API calls** all go through `src/utils/api.js`. Add new endpoints there rather than using fetch directly in components.
- **Auth token** is stored in `localStorage` under the key `token` and attached as `Authorization: Bearer <token>` on protected requests.
- **Pages vs Components**: Pages map 1:1 to routes. Shared/reusable UI goes in `components/`.
- **Styling**: Use Tailwind utility classes. Avoid custom CSS unless Tailwind can't cover the use case.
