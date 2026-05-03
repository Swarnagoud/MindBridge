# Tech Stack

## Backend (`mindbridge-backend`)
- **Runtime**: Node.js with CommonJS modules (`require`/`module.exports`)
- **Framework**: Express.js
- **Database**: MongoDB via Mongoose
- **Auth**: JWT (`jsonwebtoken`) + bcryptjs for password hashing
- **Other**: `cors`, `dotenv`, `axios`
- **Dev**: nodemon

## Frontend (`mindbridge-frontend`)
- **Framework**: React 18 (JSX, functional components, hooks)
- **Module system**: ES Modules (`import`/`export`)
- **Build tool**: Vite
- **Routing**: React Router v6
- **Styling**: Tailwind CSS + PostCSS
- **Charts**: Chart.js + react-chartjs-2
- **Icons**: lucide-react

## Environment
- Backend reads config from `.env` (see `.env.example`). Required vars: `MONGODB_URI`, `JWT_SECRET`, `PORT`
- Frontend API base URL is hardcoded in `src/utils/api.js` as `http://localhost:5000/api`

## Common Commands

### Backend
```bash
cd mindbridge-backend
npm run dev      # development with nodemon
npm start        # production
```

### Frontend
```bash
cd mindbridge-frontend
npm run dev      # Vite dev server
npm run build    # production build
npm run preview  # preview production build
npm run lint     # ESLint
```
