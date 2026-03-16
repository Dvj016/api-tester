@echo off
REM Quick Deployment Script for Windows
REM Automatically commits and pushes changes to trigger deployment

echo.
echo ========================================
echo   AI API Key Tester - Quick Deploy
echo ========================================
echo.

REM Check if git is available
where git >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Error: git is not installed
    pause
    exit /b 1
)

REM Show current changes
echo 📋 Current Changes:
echo.
git status --short
echo.

REM Ask for commit message
set /p COMMIT_MSG="Enter commit message (or press Enter for default): "
if "%COMMIT_MSG%"=="" set COMMIT_MSG=Update: Deploy latest changes

echo.
echo 📦 Adding all changes...
git add .

echo 💾 Committing changes...
git commit -m "%COMMIT_MSG%"

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ⚠️  No changes to commit or commit failed
    echo.
    set /p FORCE_PUSH="Do you want to force push anyway? (y/n): "
    if /i not "%FORCE_PUSH%"=="y" (
        echo ❌ Deployment cancelled
        pause
        exit /b 1
    )
)

echo 🚀 Pushing to GitHub...
git push origin main

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo   ✅ Deployment Started Successfully!
    echo ========================================
    echo.
    echo 📊 Deployment Status:
    echo.
    echo 🔧 Backend (Render):
    echo    - Auto-deploying now...
    echo    - Time: ~2-3 minutes
    echo    - Check: https://dashboard.render.com
    echo.
    echo 🎨 Frontend (Vercel):
    echo    - Auto-deploying now...
    echo    - Time: ~1-2 minutes
    echo    - Check: https://vercel.com/dashboard
    echo.
    echo 💡 Tip: Run 'check-status.bat' in 3 minutes to verify deployment
    echo.
) else (
    echo.
    echo ❌ Error: Failed to push changes
    echo.
    echo Possible issues:
    echo 1. No internet connection
    echo 2. Git authentication failed
    echo 3. Remote repository not configured
    echo.
    echo Try running: git push origin main
    echo.
)

pause

@REM Made with Bob
