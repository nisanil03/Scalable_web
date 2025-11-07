# Deployment Guide

## Frontend (Vercel)

1. **Set Environment Variable:**
   - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
   - Add: `VITE_API_URL` = `https://your-backend-url.vercel.app` (or your backend URL)
   - Redeploy after adding the variable

2. **If backend is on same Vercel project:**
   - Update `vercel.json` with your actual backend URL
   - Or remove `VITE_API_URL` to use relative paths with rewrites

## Backend (Vercel or other platform)

1. **Set Environment Variables:**
   - `MONGODB_URI` - Your MongoDB connection string
   - `JWT_SECRET` - A random secret string
   - `CORS_ORIGIN` - Your frontend URL (e.g., `https://your-frontend.vercel.app`)
   - `PORT` - Usually set automatically by platform

2. **Build Command:** `npm run build` (if needed)
3. **Start Command:** `npm start`

## Troubleshooting 404 Errors

- **Frontend 404:** Make sure `VITE_API_URL` is set correctly
- **Backend 404:** Check that routes are properly exported and server is running
- **CORS Errors:** Update `CORS_ORIGIN` in backend to match frontend URL
