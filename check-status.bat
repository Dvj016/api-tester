@echo off
REM Simple Deployment Status Checker for Windows
REM Replace these URLs with your actual deployment URLs

set BACKEND_URL=https://ai-api-key-tester-backend.onrender.com
set FRONTEND_URL=https://api-tester-taupe.vercel.app

echo.
echo 🔍 Checking Deployment Status
echo ==============================
echo.

REM Check Backend
echo 🔧 Backend Status:
curl -s -f "%BACKEND_URL%/health" >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo    ✅ Backend is LIVE and responding
    echo    URL: %BACKEND_URL%
    echo.
    echo    Testing visitor counter...
    curl -s -X POST "%BACKEND_URL%/api/visitors/increment"
    if %ERRORLEVEL% EQU 0 (
        echo    ✅ Visitor counter working
    ) else (
        echo    ❌ Visitor counter not responding
    )
) else (
    echo    ⏳ Backend is deploying or not responding
    echo    This is normal if you just pushed code (wait 2-3 minutes^)
)

echo.

REM Check Frontend
echo 🎨 Frontend Status:
curl -s -f -I "%FRONTEND_URL%" >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo    ✅ Frontend is LIVE and responding
    echo    URL: %FRONTEND_URL%
) else (
    echo    ⏳ Frontend is deploying or not responding
    echo    This is normal if you just pushed code (wait 1-2 minutes^)
)

echo.
echo 📋 Dashboard Links:
echo    Render:  https://dashboard.render.com
echo    Vercel:  https://vercel.com/dashboard
echo.
pause

@REM Made with Bob

