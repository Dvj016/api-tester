# Visitor Counter Update Guide

## Overview
The visitor counter has been updated to use a custom backend endpoint instead of the external CountAPI.xyz service (which was unreliable).

## Changes Made

### Backend Changes
1. **New Analytics Router** (`backend/app/routers/analytics.py`)
   - Tracks total visitor count
   - Tracks unique IP addresses
   - Endpoint: `POST /api/visitors/increment`

2. **Updated Main App** (`backend/app/main.py`)
   - Added analytics router
   - New endpoint available at `/api/visitors/increment`

### Frontend Changes
1. **Updated Visitor Counter** (`frontend/src/components/VisitorCounter.tsx`)
   - Now calls backend endpoint instead of CountAPI.xyz
   - Includes localStorage fallback for offline/error scenarios
   - Automatically increments on each page visit

## Deployment Steps

### Step 1: Deploy Backend to Render

1. **Commit and push changes:**
   ```bash
   git add .
   git commit -m "Add custom visitor counter endpoint"
   git push origin main
   ```

2. **Render will auto-deploy** (if auto-deploy is enabled)
   - Or manually trigger deploy from Render dashboard
   - Wait for deployment to complete (~2-3 minutes)

3. **Verify backend endpoint:**
   ```bash
   curl -X POST https://your-backend-url.onrender.com/api/visitors/increment
   ```
   
   Expected response:
   ```json
   {
     "total": 1,
     "unique": 1
   }
   ```

### Step 2: Deploy Frontend to Vercel

1. **Ensure environment variable is set:**
   - Go to Vercel dashboard → Your project → Settings → Environment Variables
   - Verify `NEXT_PUBLIC_API_URL` is set to your Render backend URL
   - Example: `https://your-backend-url.onrender.com`

2. **Deploy frontend:**
   ```bash
   cd frontend
   vercel --prod
   ```
   
   Or push to main branch if auto-deploy is enabled:
   ```bash
   git push origin main
   ```

3. **Wait for deployment** (~1-2 minutes)

### Step 3: Test the Visitor Counter

1. **Open your website** in a browser
2. **Check the footer** - you should see the visitor counter
3. **Refresh the page** - the count should increment
4. **Open in incognito/private mode** - count should increment again
5. **Check from different device/IP** - unique count should increase

## How It Works

### Backend Logic
```python
# In-memory storage (resets on server restart)
visitor_count = 0
unique_ips: Set[str] = set()

# On each POST request:
1. Increment total count
2. Add IP to unique set
3. Return both counts
```

### Frontend Logic
```typescript
// On component mount:
1. Call POST /api/visitors/increment
2. Display returned count
3. If error, use localStorage fallback
```

## Important Notes

### Data Persistence
⚠️ **Current Implementation**: Visitor count is stored in memory and will reset when:
- Backend server restarts
- Render free tier spins down (after 15 min inactivity)
- Manual deployment

### For Persistent Storage (Optional Upgrade)
If you want visitor counts to persist across restarts, you'll need to add a database:

1. **Add Redis** (recommended for counters):
   ```bash
   # Add to requirements.txt
   redis
   ```

2. **Or use PostgreSQL** (if you already have it):
   ```python
   # Store in database table
   CREATE TABLE analytics (
     id SERIAL PRIMARY KEY,
     visitor_count INTEGER,
     last_updated TIMESTAMP
   );
   ```

3. **Or use a file** (simple but not recommended for production):
   ```python
   # Store in JSON file
   with open('visitor_count.json', 'w') as f:
       json.dump({'count': visitor_count}, f)
   ```

## Troubleshooting

### Counter Not Incrementing
1. **Check browser console** for errors
2. **Verify backend is running:**
   ```bash
   curl https://your-backend-url.onrender.com/health
   ```
3. **Check CORS settings** in backend
4. **Verify environment variable** `NEXT_PUBLIC_API_URL` in Vercel

### Counter Shows 0 or Low Number
- This is normal if backend recently restarted
- Render free tier spins down after 15 minutes of inactivity
- Consider upgrading to paid tier for persistent uptime

### Counter Not Visible
1. **Check if component is rendered** in page.tsx
2. **Verify CSS classes** are not hiding it
3. **Check browser console** for React errors

## Monitoring

### Check Backend Logs (Render)
1. Go to Render dashboard
2. Select your backend service
3. Click "Logs" tab
4. Look for visitor increment logs

### Check Frontend Logs (Vercel)
1. Go to Vercel dashboard
2. Select your project
3. Click "Deployments" → Latest deployment → "Functions"
4. Check for any errors

## Future Enhancements

### Recommended Improvements
1. **Add Redis for persistence**
   - Visitor count survives restarts
   - Fast read/write operations
   - Free tier available on Redis Cloud

2. **Add analytics dashboard**
   - View visitor trends over time
   - Track unique vs returning visitors
   - Geographic distribution

3. **Add rate limiting per IP**
   - Prevent spam/abuse
   - Limit to 1 increment per IP per hour

4. **Add real-time updates**
   - WebSocket connection
   - Live counter updates
   - Show active users

## Support

If you encounter issues:
1. Check the logs (backend and frontend)
2. Verify environment variables
3. Test the backend endpoint directly with curl
4. Check CORS configuration
5. Ensure both services are deployed and running

## Summary

✅ **What's Working:**
- Custom visitor counter endpoint
- Automatic increment on page visit
- Unique IP tracking
- Fallback to localStorage

⚠️ **Limitations:**
- Count resets on server restart
- No historical data
- No persistence across deployments

🚀 **Next Steps:**
1. Deploy backend changes
2. Deploy frontend changes
3. Test visitor counter
4. (Optional) Add Redis for persistence