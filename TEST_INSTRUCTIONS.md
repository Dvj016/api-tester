# Quick Testing Instructions

## ✅ Your npm install completed successfully!

The warnings you saw are normal and won't affect the application.

## 🚀 Start Testing Now

### Step 1: Start the Backend

Open PowerShell in the project directory:

```powershell
cd backend
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
uvicorn app.main:app --reload
```

**Expected output:**
```
INFO:     Uvicorn running on http://0.0.0.0:8000
INFO:     Application startup complete.
```

✅ Backend is running! Keep this window open.

### Step 2: Start the Frontend

Open a **NEW** PowerShell window:

```powershell
cd frontend
copy .env.example .env.local
npm run dev
```

**Expected output:**
```
▲ Next.js 14.1.0
- Local:        http://localhost:3000
✓ Ready in 2.5s
```

✅ Frontend is running! Keep this window open.

### Step 3: Open the Application

Open your browser and go to: **http://localhost:3000**

You should see:
- ✅ "AI API Key Tester" header
- ✅ Four provider cards (OpenAI, Anthropic, Gemini, NVIDIA)
- ✅ Dark theme interface

## 🧪 Test the Application

### Test 1: Check Backend Health

Open: **http://localhost:8000/health**

Should show:
```json
{"status":"healthy","timestamp":"..."}
```

### Test 2: Check API Documentation

Open: **http://localhost:8000/docs**

You should see interactive API documentation.

### Test 3: Test with Invalid Key (No API key needed!)

1. Go to http://localhost:3000
2. Select **OpenAI**
3. Select model: **gpt-3.5-turbo**
4. Enter fake key: `sk-test123`
5. Click **"Test API Key"**

**Expected Result:**
- Loading animation appears
- After 1-2 seconds, shows error message
- Red border on result card
- Error: "Invalid API key format" or similar

### Test 4: Test with Real API Key (Optional)

If you have an OpenAI API key:

1. Select **OpenAI**
2. Select model: **gpt-3.5-turbo**
3. Paste your real API key (starts with `sk-`)
4. Click **"Test API Key"**

**Expected Result:**
- Loading animation
- Green result card
- Shows "API Key Valid ✓"
- Displays latency (e.g., "1250ms")
- Shows response preview

## ✅ Success Checklist

- [ ] Backend starts without errors
- [ ] Frontend starts without errors
- [ ] Can open http://localhost:3000
- [ ] Can see all 4 provider cards
- [ ] Can select different providers
- [ ] Model dropdown updates
- [ ] Can enter API key
- [ ] Test button works
- [ ] Loading animation shows
- [ ] Result card displays
- [ ] Error messages show properly

## 🐛 Fixed Issues

✅ **Error handling fixed** - The React error you encountered has been resolved. The app now properly handles FastAPI validation errors and displays them as readable text.

## 🎯 What Was Fixed

The error "Objects are not valid as a React child" occurred because FastAPI returns validation errors as objects. I've updated the error handling to:

1. Check if error is a string → display directly
2. Check if error is an array → format as readable text
3. Check if error is an object → convert to JSON string
4. Fallback to generic error message

## 📝 Common Test Scenarios

### Scenario 1: Empty API Key
- Don't enter any key
- Click "Test API Key"
- Should show alert: "Please enter an API key and select a model"

### Scenario 2: Wrong Format
- Enter: `invalid-key`
- Should show: "Invalid API key format"

### Scenario 3: Wrong Provider Key
- Select OpenAI
- Enter Anthropic key (starts with `sk-ant-`)
- Should show: "OpenAI API keys should start with 'sk-'"

### Scenario 4: Network Error
- Stop the backend (Ctrl+C)
- Try to test a key
- Should show: "Network error occurred"

## 🎨 UI Features to Test

1. **Dark Mode Toggle** - Click sun/moon icon in header
2. **Provider Selection** - Click different provider cards
3. **Model Dropdown** - Changes based on provider
4. **Copy Button** - In result card (if valid key)
5. **Responsive Design** - Resize browser window

## 🔧 Troubleshooting

### If frontend won't start:
```powershell
cd frontend
Remove-Item -Recurse -Force .next
npm run dev
```

### If backend won't start:
```powershell
cd backend
.\venv\Scripts\activate
pip install -r requirements.txt --force-reinstall
uvicorn app.main:app --reload
```

### If you see CORS errors:
1. Check backend is running
2. Check `.env` has: `ALLOWED_ORIGINS=http://localhost:3000`
3. Restart backend

## 🎉 You're All Set!

The application is now ready to test. The error you encountered has been fixed, and you can proceed with testing all features.

**Next Steps:**
1. Test with different providers
2. Try various error scenarios
3. Check the API documentation at /docs
4. Explore the code and customize as needed

Happy Testing! 🚀