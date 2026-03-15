# Local Testing Guide - AI API Key Tester

This guide will walk you through testing the application locally on your Windows machine.

## Prerequisites Check

Before starting, ensure you have:
- ✅ Python 3.11+ installed
- ✅ Node.js 18+ installed
- ✅ Git installed (you already have the code)

### Verify Installations

Open PowerShell and run:

```powershell
# Check Python version
python --version
# Should show: Python 3.11.x or higher

# Check Node.js version
node --version
# Should show: v18.x.x or higher

# Check npm version
npm --version
# Should show: 9.x.x or higher
```

## Option 1: Quick Test with Docker (Easiest - 2 minutes)

If you have Docker Desktop installed:

```powershell
# From the project root directory (API_Tester)
docker-compose up --build
```

Wait for both services to start, then:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

**Skip to "Testing the Application" section below.**

---

## Option 2: Manual Setup (Recommended for Development)

### Step 1: Setup Backend (5 minutes)

Open PowerShell in the project directory:

```powershell
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
.\venv\Scripts\activate

# You should see (venv) in your prompt now

# Install dependencies (this may take 2-3 minutes)
pip install -r requirements.txt

# Create environment file
copy .env.example .env

# Start the backend server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**Expected Output:**
```
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
INFO:     Started reloader process
INFO:     Started server process
INFO:     Waiting for application startup.
INFO:     Application startup complete.
```

**✅ Backend is now running!**

Test it by opening: http://localhost:8000/docs

**Keep this PowerShell window open.**

---

### Step 2: Setup Frontend (5 minutes)

Open a **NEW** PowerShell window in the project directory:

```powershell
# Navigate to frontend directory
cd frontend

# Install dependencies (this may take 3-5 minutes)
npm install

# Create environment file
copy .env.example .env.local

# Start the development server
npm run dev
```

**Expected Output:**
```
  ▲ Next.js 14.1.0
  - Local:        http://localhost:3000
  - Network:      http://192.168.x.x:3000

 ✓ Ready in 2.5s
```

**✅ Frontend is now running!**

Open: http://localhost:3000

**Keep this PowerShell window open too.**

---

## Testing the Application

### 1. Visual Check

Open http://localhost:3000 in your browser. You should see:
- ✅ "AI API Key Tester" header
- ✅ Four provider cards (OpenAI, Anthropic, Gemini, NVIDIA)
- ✅ Model dropdown
- ✅ API Key input field
- ✅ "Test API Key" button
- ✅ Dark theme

### 2. Test Backend Health

Open http://localhost:8000/health

**Expected Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-..."
}
```

### 3. Test API Documentation

Open http://localhost:8000/docs

You should see:
- ✅ Interactive Swagger UI
- ✅ Endpoints for each provider
- ✅ Try it out buttons

### 4. Test with a Real API Key

**Important:** You need a valid API key from one of the providers to fully test.

#### If you have an OpenAI API key:

1. Go to http://localhost:3000
2. Click on **OpenAI** card
3. Select a model (e.g., "gpt-3.5-turbo")
4. Paste your API key (starts with `sk-`)
5. Click **"Test API Key"**

**Expected Result:**
- ✅ Loading animation appears
- ✅ After 1-3 seconds, result card shows
- ✅ Green border if valid
- ✅ Shows "API Key Valid ✓"
- ✅ Displays latency (e.g., "1250ms")
- ✅ Shows response preview

#### If you don't have an API key:

You can still test the validation:

1. Enter an invalid key like: `sk-test123`
2. Click "Test API Key"
3. Should show: "Invalid API key format" or authentication error

### 5. Test All Providers

Try each provider to ensure routing works:

**OpenAI:**
- Select OpenAI
- Choose "gpt-3.5-turbo"
- Enter key starting with `sk-`

**Anthropic:**
- Select Anthropic
- Choose "claude-3-haiku-20240307"
- Enter key starting with `sk-ant-`

**Google Gemini:**
- Select Google Gemini
- Choose "gemini-pro"
- Enter your Google API key

**NVIDIA NIM:**
- Select NVIDIA NIM
- Choose a model
- Enter your NVIDIA API key

### 6. Test Error Handling

**Test 1: Empty API Key**
- Don't enter any key
- Click "Test API Key"
- Should show alert: "Please enter an API key and select a model"

**Test 2: Invalid Format**
- Enter: `invalid-key-123`
- Click "Test API Key"
- Should show error message

**Test 3: Wrong Provider Key**
- Select OpenAI
- Enter an Anthropic key (starts with `sk-ant-`)
- Should show format validation error

### 7. Test UI Features

**Dark Mode Toggle:**
- Click the sun/moon icon in header
- Theme should switch (currently defaults to dark)

**Model Selection:**
- Switch between providers
- Models dropdown should update automatically

**Copy Response:**
- After a successful test
- Click "Copy" button in response preview
- Should show "Copied!" briefly

**Mobile Responsive:**
- Resize browser window to mobile size
- Layout should adapt (cards stack vertically)

---

## Troubleshooting

### Backend Issues

**Problem: "Port 8000 is already in use"**

```powershell
# Find what's using port 8000
netstat -ano | findstr :8000

# Kill the process (replace <PID> with actual number)
taskkill /PID <PID> /F

# Or use a different port
uvicorn app.main:app --reload --port 8001
```

**Problem: "Module not found" errors**

```powershell
# Make sure virtual environment is activated
cd backend
.\venv\Scripts\activate

# Reinstall dependencies
pip install -r requirements.txt --force-reinstall
```

**Problem: "No module named 'app'"**

```powershell
# Make sure you're in the backend directory
cd backend

# Run from backend directory
uvicorn app.main:app --reload
```

### Frontend Issues

**Problem: "Port 3000 is already in use"**

```powershell
# Find what's using port 3000
netstat -ano | findstr :3000

# Kill the process
taskkill /PID <PID> /F

# Or use a different port
# Edit package.json, change dev script to:
# "dev": "next dev -p 3001"
```

**Problem: "Cannot find module" errors**

```powershell
# Clear cache and reinstall
cd frontend
Remove-Item -Recurse -Force node_modules, .next
npm install
npm run dev
```

**Problem: "Cannot connect to backend"**

1. Check backend is running on port 8000
2. Open http://localhost:8000/health
3. Check `.env.local` has: `NEXT_PUBLIC_API_URL=http://localhost:8000`
4. Restart frontend: `Ctrl+C` then `npm run dev`

### CORS Errors

If you see CORS errors in browser console:

1. Check backend `.env` file:
   ```
   ALLOWED_ORIGINS=http://localhost:3000
   ```
2. Restart backend server
3. Clear browser cache (Ctrl+Shift+Delete)

---

## Testing Checklist

Use this checklist to verify everything works:

### Backend Tests
- [ ] Backend starts without errors
- [ ] Health endpoint responds: http://localhost:8000/health
- [ ] API docs load: http://localhost:8000/docs
- [ ] Can see all provider endpoints in docs
- [ ] No error messages in backend console

### Frontend Tests
- [ ] Frontend starts without errors
- [ ] Page loads at http://localhost:3000
- [ ] All 4 provider cards visible
- [ ] Can select different providers
- [ ] Model dropdown updates when provider changes
- [ ] Can type in API key field
- [ ] Test button is clickable
- [ ] Dark mode toggle works

### Integration Tests
- [ ] Can test with valid API key
- [ ] Loading animation appears during test
- [ ] Result card shows after test
- [ ] Latency is displayed
- [ ] Response preview shows (if valid key)
- [ ] Error messages show for invalid keys
- [ ] Copy button works in result card

### Error Handling Tests
- [ ] Empty key shows alert
- [ ] Invalid format shows error
- [ ] Network errors handled gracefully
- [ ] Timeout protection works (30s max)

---

## Next Steps

Once local testing is complete:

1. **Customize**: Modify colors, add features
2. **Deploy**: Follow DEPLOYMENT.md for production
3. **Share**: Get feedback from users
4. **Extend**: Add more AI providers

---

## Getting Help

If you encounter issues:

1. Check the error message carefully
2. Look in browser console (F12)
3. Check backend console for errors
4. Review this guide's troubleshooting section
5. Check SETUP.md for additional help

---

## Quick Reference Commands

**Start Backend:**
```powershell
cd backend
.\venv\Scripts\activate
uvicorn app.main:app --reload
```

**Start Frontend:**
```powershell
cd frontend
npm run dev
```

**Stop Services:**
- Press `Ctrl+C` in each PowerShell window

**Restart Everything:**
1. Stop both services (Ctrl+C)
2. Start backend first
3. Start frontend second

---

## Success Indicators

You'll know everything is working when:

✅ Both services start without errors
✅ Frontend loads in browser
✅ Backend API docs are accessible
✅ Can test with a valid API key
✅ Results display correctly
✅ No CORS errors in console
✅ Latency metrics show up

Happy Testing! 🚀