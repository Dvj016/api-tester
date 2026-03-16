#!/bin/bash

# Simple Deployment Status Checker
# Replace these URLs with your actual deployment URLs

BACKEND_URL="https://your-backend-url.onrender.com"
FRONTEND_URL="https://your-frontend-url.vercel.app"

echo ""
echo "🔍 Checking Deployment Status"
echo "=============================="
echo ""

# Check Backend
echo "🔧 Backend Status:"
if curl -s -f "$BACKEND_URL/health" > /dev/null 2>&1; then
    echo "   ✅ Backend is LIVE and responding"
    echo "   URL: $BACKEND_URL"
    
    # Test visitor counter
    echo ""
    echo "   Testing visitor counter..."
    RESPONSE=$(curl -s -X POST "$BACKEND_URL/api/visitors/increment")
    if [ $? -eq 0 ]; then
        echo "   ✅ Visitor counter working"
        echo "   Response: $RESPONSE"
    else
        echo "   ❌ Visitor counter not responding"
    fi
else
    echo "   ⏳ Backend is deploying or not responding"
    echo "   This is normal if you just pushed code (wait 2-3 minutes)"
fi

echo ""

# Check Frontend
echo "🎨 Frontend Status:"
if curl -s -f -I "$FRONTEND_URL" > /dev/null 2>&1; then
    echo "   ✅ Frontend is LIVE and responding"
    echo "   URL: $FRONTEND_URL"
else
    echo "   ⏳ Frontend is deploying or not responding"
    echo "   This is normal if you just pushed code (wait 1-2 minutes)"
fi

echo ""
echo "📋 Dashboard Links:"
echo "   Render:  https://dashboard.render.com"
echo "   Vercel:  https://vercel.com/dashboard"
echo ""

# Made with Bob
