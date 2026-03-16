@echo off
REM Visitor Counter Update Deployment Script for Windows
REM This script helps deploy the visitor counter updates to your live application

echo.
echo 🚀 AI API Key Tester - Visitor Counter Update Deployment
echo ==========================================================
echo.

REM Check if git is available
where git >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Error: git is not installed
    pause
    exit /b 1
)

REM Check if we're in a git repository
git rev-parse --git-dir >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Error: Not in a git repository
    pause
    exit /b 1
)

REM Show current status
echo 📊 Current Git Status:
git status --short
echo.

REM Ask for confirmation
set /p CONFIRM="Do you want to commit and push these changes? (y/n): "
if /i not "%CONFIRM%"=="y" (
    echo ❌ Deployment cancelled
    pause
    exit /b 1
)

REM Add all changes
echo.
echo 📦 Adding changes...
git add .

REM Commit changes
echo 💾 Committing changes...
git commit -m "Fix visitor counter with custom backend endpoint - Add analytics router to backend - Update frontend to use backend endpoint - Remove dependency on CountAPI.xyz - Add localStorage fallback for errors"

REM Push to main branch
echo 🚀 Pushing to main branch...
git push origin main

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ✅ Changes pushed successfully!
    echo.
    echo 📋 Next Steps:
    echo 1. Wait for Render to auto-deploy backend (~2-3 minutes^)
    echo 2. Wait for Vercel to auto-deploy frontend (~1-2 minutes^)
    echo 3. Test your website to verify visitor counter works
    echo.
    echo 🔗 Check deployment status:
    echo    - Render: https://dashboard.render.com
    echo    - Vercel: https://vercel.com/dashboard
    echo.
    echo 🧪 Test the backend endpoint:
    echo    curl -X POST https://your-backend-url.onrender.com/api/visitors/increment
    echo.
    echo 📖 For detailed instructions, see: VISITOR_COUNTER_UPDATE.md
) else (
    echo.
    echo ❌ Error: Failed to push changes
    echo Please check your git configuration and try again
    pause
    exit /b 1
)

echo.
pause

@REM Made with Bob
