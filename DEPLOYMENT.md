# Deployment Guide

This guide explains how to deploy the USTP Flood Digital Twin to production using free hosting options.

## Architecture

- **Backend**: Node.js/Express API deployed to Render
- **Frontend**: React/Vite deployed to Vercel
- **Firmware**: ESP32 firmware (flashed to hardware)

## Backend Deployment (Render)

### Prerequisites
- Render account (free tier)
- GitHub repository

### Steps

1. **Push code to GitHub** (already done)

2. **Create Render service:**
   - Go to [render.com](https://render.com)
   - Click "New" → "Web Service"
   - Connect your GitHub repository
   - Select root directory: `backend`
   - Build command: `npm install && npm run build`
   - Start command: `npm start`
   - Runtime: Node
   - Plan: Free

3. **Environment Variables:**
   ```
   NODE_ENV=production
   PORT=10000
   JWT_SECRET=<generate-a-secure-random-string>
   ```

4. **Wait for deployment** - Render will build and deploy automatically

5. **Get your backend URL** (e.g., `https://ustp-flood-backend.onrender.com`)

## Frontend Deployment (Vercel)

### Prerequisites
- Vercel account (free tier)
- GitHub repository

### Steps

1. **Push code to GitHub** (already done)

2. **Create Vercel project:**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository
   - Framework preset: Vite
   - Root directory: `./` (root of repo)

3. **Environment Variables:**
   ```
   VITE_API_URL=https://ustp-flood-backend.onrender.com/api
   ```
   (Replace with your actual backend URL from Render)

4. **Deploy** - Vercel will build and deploy automatically

5. **Get your frontend URL** (e.g., `https://ustp-flood-gui.vercel.app`)

## Configuration Updates

### Backend CORS Configuration

After deployment, update the CORS configuration in `backend/src/server.ts` to allow requests from your Vercel domain:

```typescript
app.use(cors({
  origin: ['https://ustp-flood-gui.vercel.app', 'http://localhost:3000']
}));
```

### Frontend API URL

The frontend uses the `VITE_API_URL` environment variable. Set this in Vercel to point to your Render backend URL.

## Testing

1. Visit your Vercel frontend URL
2. Login with credentials: `admin` / `admin123`
3. Verify all features work:
   - Real-time data display
   - Admin controls (thresholds, reports)
   - Authentication

## Free Tier Limitations

### Render (Backend)
- Service sleeps after 15 minutes of inactivity
- Cold start delay (~30 seconds) on first request
- Limited CPU and memory
- No custom domains on free plan

### Vercel (Frontend)
- 100GB bandwidth per month
- Unlimited deployments
- Custom domains available on free plan

## Troubleshooting

### Backend not responding
- Check Render dashboard for logs
- Ensure JWT_SECRET is set
- Verify build succeeded

### Frontend API errors
- Check browser console for CORS errors
- Verify VITE_API_URL is set correctly
- Ensure backend is running

### Authentication not working
- Verify JWT_SECRET matches between environments
- Check token expiration (24 hours)
- Clear browser localStorage

## Production Improvements (Future)

1. **Database**: Add PostgreSQL/TimescaleDB for data persistence
2. **Monitoring**: Add logging and error tracking (Sentry, LogRocket)
3. **CDN**: Use CDN for static assets
4. **Custom Domain**: Add custom domains for both services
5. **SSL**: Already provided by Render and Vercel
6. **Rate Limiting**: Add rate limiting to API endpoints
7. **Caching**: Add Redis for API response caching
