# Check Deployment Status from Console

## Overview
Yes! You can check deployment status directly from your console using CLI tools and API calls.

## Method 1: Using Render CLI (Recommended for Backend)

### Install Render CLI
```bash
# Install via npm
npm install -g render-cli

# Or download from: https://render.com/docs/cli
```

### Login to Render
```bash
render login
```

### Check Deployment Status
```bash
# List all your services
render services list

# Get specific service details
render service get <service-name>

# View recent deployments
render deploys list <service-name>

# View logs in real-time
render logs <service-name> --tail
```

### Example Output
```bash
$ render deploys list my-backend-service

ID          STATUS      CREATED AT           COMMIT
dep-abc123  live        2024-03-16 10:30:00  Fix visitor counter
dep-xyz789  succeeded   2024-03-16 09:15:00  Add analytics
```

## Method 2: Using Vercel CLI (Recommended for Frontend)

### Install Vercel CLI
```bash
npm install -g vercel
```

### Login to Vercel
```bash
vercel login
```

### Check Deployment Status
```bash
# List recent deployments
vercel ls

# Get deployment details
vercel inspect <deployment-url>

# View logs
vercel logs <deployment-url>

# Check current production deployment
vercel ls --prod
```

### Example Output
```bash
$ vercel ls

Age  Deployment                          Status    Duration
2m   my-app-abc123.vercel.app           Ready     45s
15m  my-app-xyz789.vercel.app           Ready     52s
```

## Method 3: Using cURL (Works for Both)

### Check Render Backend Status
```bash
# Check if backend is responding
curl -I https://your-backend-url.onrender.com/health

# Test visitor counter endpoint
curl -X POST https://your-backend-url.onrender.com/api/visitors/increment

# Check with verbose output
curl -v https://your-backend-url.onrender.com/health
```

### Check Vercel Frontend Status
```bash
# Check if frontend is responding
curl -I https://your-frontend-url.vercel.app

# Check with full response
curl https://your-frontend-url.vercel.app
```

## Method 4: Using Git Hooks (Automatic Notifications)

### Create Post-Push Hook
Create `.git/hooks/post-push`:

```bash
#!/bin/bash

echo ""
echo "🚀 Code pushed to GitHub!"
echo ""
echo "📊 Checking deployment status..."
echo ""

# Wait a few seconds for webhooks to trigger
sleep 5

# Check Render status
echo "🔧 Backend (Render):"
curl -s https://your-backend-url.onrender.com/health && echo "✅ Backend is responding" || echo "⏳ Backend is deploying..."

echo ""

# Check Vercel status
echo "🎨 Frontend (Vercel):"
curl -s -I https://your-frontend-url.vercel.app | head -n 1

echo ""
echo "📋 Check detailed status:"
echo "   Render:  https://dashboard.render.com"
echo "   Vercel:  https://vercel.com/dashboard"
echo ""
```

Make it executable:
```bash
chmod +x .git/hooks/post-push
```

## Method 5: Watch Deployment in Real-Time

### Create a Monitoring Script

**`watch-deployment.sh`:**
```bash
#!/bin/bash

BACKEND_URL="https://your-backend-url.onrender.com"
FRONTEND_URL="https://your-frontend-url.vercel.app"

echo "🔍 Watching deployment status..."
echo "Press Ctrl+C to stop"
echo ""

while true; do
    clear
    echo "=== Deployment Status Monitor ==="
    echo "Time: $(date '+%Y-%m-%d %H:%M:%S')"
    echo ""
    
    # Check Backend
    echo "🔧 Backend Status:"
    if curl -s -f "$BACKEND_URL/health" > /dev/null 2>&1; then
        echo "✅ Backend is LIVE"
        VISITOR_COUNT=$(curl -s -X POST "$BACKEND_URL/api/visitors/increment" | grep -o '"total":[0-9]*' | cut -d':' -f2)
        echo "   Visitor count: $VISITOR_COUNT"
    else
        echo "⏳ Backend is deploying or down..."
    fi
    
    echo ""
    
    # Check Frontend
    echo "🎨 Frontend Status:"
    if curl -s -f -I "$FRONTEND_URL" > /dev/null 2>&1; then
        echo "✅ Frontend is LIVE"
    else
        echo "⏳ Frontend is deploying or down..."
    fi
    
    echo ""
    echo "Refreshing in 10 seconds..."
    sleep 10
done
```

**`watch-deployment.bat` (Windows):**
```batch
@echo off
setlocal enabledelayedexpansion

set BACKEND_URL=https://your-backend-url.onrender.com
set FRONTEND_URL=https://your-frontend-url.vercel.app

echo 🔍 Watching deployment status...
echo Press Ctrl+C to stop
echo.

:loop
cls
echo === Deployment Status Monitor ===
echo Time: %date% %time%
echo.

echo 🔧 Backend Status:
curl -s -f "%BACKEND_URL%/health" >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo ✅ Backend is LIVE
) else (
    echo ⏳ Backend is deploying or down...
)

echo.

echo 🎨 Frontend Status:
curl -s -f -I "%FRONTEND_URL%" >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo ✅ Frontend is LIVE
) else (
    echo ⏳ Frontend is deploying or down...
)

echo.
echo Refreshing in 10 seconds...
timeout /t 10 /nobreak >nul
goto loop
```

## Method 6: Using GitHub Actions (Advanced)

### Create `.github/workflows/deployment-status.yml`:
```yaml
name: Check Deployment Status

on:
  push:
    branches: [ main ]

jobs:
  check-deployment:
    runs-on: ubuntu-latest
    steps:
      - name: Wait for deployment
        run: sleep 60
        
      - name: Check Backend
        run: |
          echo "Checking backend..."
          curl -f https://your-backend-url.onrender.com/health || exit 1
          
      - name: Check Frontend
        run: |
          echo "Checking frontend..."
          curl -f https://your-frontend-url.vercel.app || exit 1
          
      - name: Test Visitor Counter
        run: |
          echo "Testing visitor counter..."
          curl -X POST https://your-backend-url.onrender.com/api/visitors/increment
```

## Quick Commands Cheat Sheet

### After Pushing Code

```bash
# 1. Push code
git push origin main

# 2. Wait 30 seconds
sleep 30

# 3. Check backend
curl https://your-backend-url.onrender.com/health

# 4. Check frontend
curl -I https://your-frontend-url.vercel.app

# 5. Test visitor counter
curl -X POST https://your-backend-url.onrender.com/api/visitors/increment
```

### One-Liner Status Check

**Linux/Mac:**
```bash
echo "Backend:" && curl -s https://your-backend-url.onrender.com/health && echo "" && echo "Frontend:" && curl -s -I https://your-frontend-url.vercel.app | head -n 1
```

**Windows (PowerShell):**
```powershell
Write-Host "Backend:"; curl https://your-backend-url.onrender.com/health; Write-Host "`nFrontend:"; curl -I https://your-frontend-url.vercel.app
```

## Deployment Timeline

After `git push origin main`:

```
0:00  - Code pushed to GitHub
0:05  - Render webhook triggered
0:10  - Vercel webhook triggered
0:30  - Render starts building
1:00  - Vercel deployment complete ✅
2:00  - Render build complete
2:30  - Render deployment complete ✅
```

## Troubleshooting

### Backend Not Responding
```bash
# Check if service is running
curl -v https://your-backend-url.onrender.com/health

# Check specific endpoint
curl -v -X POST https://your-backend-url.onrender.com/api/visitors/increment

# View Render logs (requires CLI)
render logs <service-name> --tail
```

### Frontend Not Updating
```bash
# Check deployment status
vercel ls

# Force redeploy
vercel --prod

# Check specific deployment
vercel inspect <deployment-url>
```

## Best Practice: Automated Deployment Script

**`deploy-and-monitor.sh`:**
```bash
#!/bin/bash

echo "🚀 Starting deployment..."

# Push code
git add .
git commit -m "Fix visitor counter"
git push origin main

echo "✅ Code pushed!"
echo ""
echo "⏳ Waiting for deployments to start (30 seconds)..."
sleep 30

# Monitor deployments
echo ""
echo "📊 Checking deployment status..."
echo ""

for i in {1..12}; do
    echo "Check #$i of 12..."
    
    # Check backend
    if curl -s -f https://your-backend-url.onrender.com/health > /dev/null 2>&1; then
        echo "✅ Backend is live!"
        BACKEND_READY=true
    else
        echo "⏳ Backend still deploying..."
    fi
    
    # Check frontend
    if curl -s -f -I https://your-frontend-url.vercel.app > /dev/null 2>&1; then
        echo "✅ Frontend is live!"
        FRONTEND_READY=true
    fi
    
    # Exit if both are ready
    if [ "$BACKEND_READY" = true ] && [ "$FRONTEND_READY" = true ]; then
        echo ""
        echo "🎉 Both services are live!"
        echo ""
        echo "🧪 Testing visitor counter..."
        curl -X POST https://your-backend-url.onrender.com/api/visitors/increment
        echo ""
        exit 0
    fi
    
    echo ""
    sleep 15
done

echo "⚠️  Deployment taking longer than expected"
echo "Check dashboards manually:"
echo "  Render: https://dashboard.render.com"
echo "  Vercel: https://vercel.com/dashboard"
```

## Summary

**Easiest Methods:**
1. **cURL commands** - No installation needed
2. **Render CLI** - Best for backend monitoring
3. **Vercel CLI** - Best for frontend monitoring

**Most Automated:**
1. **Watch script** - Real-time monitoring
2. **Git hooks** - Automatic after push
3. **GitHub Actions** - Full CI/CD pipeline

Choose the method that fits your workflow!