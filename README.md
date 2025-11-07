# Scalable Web App (Frontend + Backend)

## Stack
- Frontend: React + Vite + TypeScript + TailwindCSS
- Backend: Node.js + Express + MongoDB (Mongoose)
- Auth: JWT (Bearer)

## Setup
1) Backend
```
cd server
npm install
# create .env
PORT=5000
MONGODB_URI=<your_mongodb_uri>
JWT_SECRET=<random_string>
CORS_ORIGIN=http://localhost:5173

npm run dev
```
- Health: http://localhost:5000/api/health

2) Frontend
```
cd web
npm install
npm run dev
```
- Open the URL shown (e.g., http://localhost:5173)

## Features
- Register/Login/Logout (JWT)
- Protected dashboard
- Profile view/update
- Tasks CRUD with search + status filter
- Client/server validation via zod

## API Docs
See `docs/api.md` and import `docs/postman_collection.json` into Postman.

## Production Scaling Notes
- Frontend
  - Build with `npm run build`; serve static assets from a CDN or object storage
  - Env-configurable API base URL; use `.env`-injected Vite vars
  - Route-level code-splitting and component memoization
- Backend
  - Use process manager (PM2) or containers; horizontal scale behind a reverse proxy (NGINX)
  - Enable CORS allowlist and rate limiting (express-rate-limit)
  - Store JWT secret in vault; rotate regularly; consider short-lived tokens + refresh tokens
  - MongoDB: use Atlas with proper indexes (userId, status)
- Security & Observability
  - Hash passwords with bcrypt; validate inputs with zod
  - Centralized error handling and structured logs (morgan + JSON logs)
  - Add Sentry or similar for error tracking
- CI/CD
  - Lint/build/test on PR; deploy through GitHub Actions to hosting (Vercel/Netlify for web, Render/Fly/Heroku/Docker for API)
