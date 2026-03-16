# Deployment Scripts Guide

## Quick Deployment Scripts

I've created automated deployment scripts so you don't have to type git commands every time!

## Available Scripts

### 1. `deploy.bat` (Windows)
### 2. `deploy.sh` (Linux/Mac)
### 3. `check-status.bat` (Windows)
### 4. `check-status.sh` (Linux/Mac)

## How to Use

### Windows Users

**Deploy Changes:**
```bash
deploy.bat
```

**Check Status:**
```bash
check-status.bat
```

### Linux/Mac Users

**First time setup:**
```bash
chmod +x deploy.sh
chmod +x check-status.sh
```

**Deploy Changes:**
```bash
./deploy.sh
```

**Check Status:**
```bash
./check-status.sh
```

## What Each Script Does

### Deploy Script (`deploy.bat` / `deploy.sh`)

**Automatically:**
1. ✅ Shows your current changes
2. ✅ Asks for commit message (or uses default)
3. ✅ Adds all changes (`git add .`)
4. ✅ Commits changes (`git commit`)
5. ✅ Pushes to GitHub (`git push origin main`)
6. ✅ Triggers auto-deployment on Render & Vercel
7. ✅ Shows deployment status

**Example:**
```
C:\Users\...\API_Tester> deploy.bat

========================================
  AI API Key Tester - Quick Deploy
========================================

📋 Current Changes:

M  backend/app/main.py
A  backend/app/routers/elevenlabs.py
M  frontend/src/app/page.tsx

Enter commit message (or press Enter for default): Add ElevenLabs provider

📦 Adding all changes...
💾 Committing changes...
🚀 Pushing to GitHub...

========================================
  ✅ Deployment Started Successfully!
========================================

📊 Deployment Status:

🔧 Backend (Render):
   - Auto-deploying now...
   - Time: ~2-3 minutes

🎨 Frontend (Vercel):
   - Auto-deploying now...
   - Time: ~1-2 minutes

💡 Tip: Run 'check-status.bat' in 3 minutes
```

### Check Status Script (`check-status.bat` / `check-status.sh`)

**Automatically:**
1. ✅ Checks if backend is live
2. ✅ Checks if frontend is live
3. ✅ Tests visitor counter
4. ✅ Shows response times
5. ✅ Provides dashboard links

**Example:**
```
C:\Users\...\API_Tester> check-status.bat

🔍 Checking Deployment Status
==============================

🔧 Backend Status:
   ✅ Backend is LIVE and responding
   URL: https://ai-api-key-tester-backend.onrender.com

   Testing visitor counter...
   ✅ Visitor counter working

🎨 Frontend Status:
   ✅ Frontend is LIVE and responding
   URL: https://api-tester-taupe.vercel.app

📋 Dashboard Links:
   Render:  https://dashboard.render.com
   Vercel:  https://vercel.com/dashboard
```

## Typical Workflow

### Making Changes and Deploying

```bash
# 1. Make your changes to code
# (edit files in VS Code)

# 2. Deploy with one command
deploy.bat

# 3. Wait 3 minutes

# 4. Check if deployment succeeded
check-status.bat

# 5. Test your website
# Open: https://api-tester-taupe.vercel.app
```

### Quick Deploy (No Custom Message)

```bash
# Just press Enter when asked for commit message
deploy.bat
[Press Enter]
```

Uses default message: "Update: Deploy latest changes"

### Deploy with Custom Message

```bash
deploy.bat
Enter commit message: Add ElevenLabs provider
```

## Troubleshooting

### Script Won't Run (Windows)

**Issue:** "deploy.bat is not recognized"

**Solution:**
```bash
# Make sure you're in the project directory
cd C:\Users\YourName\Desktop\API_Tester

# Then run
deploy.bat
```

### Script Won't Run (Linux/Mac)

**Issue:** "Permission denied"

**Solution:**
```bash
# Make script executable
chmod +x deploy.sh
chmod +x check-status.sh

# Then run
./deploy.sh
```

### No Changes to Commit

**Issue:** "No changes to commit"

**What it means:** You haven't made any changes since last deployment

**Solution:** Make some changes first, or force push if needed

### Push Failed

**Issue:** "Failed to push changes"

**Possible causes:**
1. No internet connection
2. Git authentication failed
3. Remote repository not configured

**Solution:**
```bash
# Check git remote
git remote -v

# Should show:
# origin  https://github.com/yourusername/API_Tester.git

# If not set up, add it:
git remote add origin https://github.com/yourusername/API_Tester.git
```

## Advanced Usage

### Deploy Specific Files Only

```bash
# Add specific files
git add backend/app/main.py
git add frontend/src/app/page.tsx

# Commit
git commit -m "Update specific files"

# Push
git push origin main
```

### View Deployment Logs

**Render (Backend):**
1. Go to https://dashboard.render.com
2. Click your service
3. Click "Logs" tab
4. Watch real-time deployment

**Vercel (Frontend):**
1. Go to https://vercel.com/dashboard
2. Click your project
3. Click "Deployments"
4. Click latest deployment
5. View build logs

### Rollback to Previous Version

```bash
# View commit history
git log --oneline

# Rollback to specific commit
git reset --hard <commit-hash>

# Force push
git push origin main --force

# Example:
git reset --hard abc1234
git push origin main --force
```

## Best Practices

### Before Deploying

1. ✅ Test changes locally first
2. ✅ Check for errors in console
3. ✅ Review what files changed
4. ✅ Write clear commit message

### After Deploying

1. ✅ Wait 3 minutes for deployment
2. ✅ Run `check-status.bat`
3. ✅ Test on live website
4. ✅ Check browser console for errors

### Commit Message Tips

**Good messages:**
- "Add ElevenLabs provider"
- "Fix visitor counter bug"
- "Update voice welcome feature"
- "Improve error handling"

**Bad messages:**
- "update"
- "fix"
- "changes"
- "asdf"

## Quick Reference

### Deploy Now
```bash
deploy.bat          # Windows
./deploy.sh         # Linux/Mac
```

### Check Status
```bash
check-status.bat    # Windows
./check-status.sh   # Linux/Mac
```

### View Changes
```bash
git status
```

### View History
```bash
git log --oneline
```

### Undo Last Commit (Keep Changes)
```bash
git reset --soft HEAD~1
```

### Undo Last Commit (Discard Changes)
```bash
git reset --hard HEAD~1
```

## Summary

**One-Command Deployment:**
- Windows: `deploy.bat`
- Linux/Mac: `./deploy.sh`

**One-Command Status Check:**
- Windows: `check-status.bat`
- Linux/Mac: `./check-status.sh`

**No more typing:**
- ❌ `git add .`
- ❌ `git commit -m "..."`
- ❌ `git push origin main`

**Just run:**
- ✅ `deploy.bat`

**That's it!** 🎉