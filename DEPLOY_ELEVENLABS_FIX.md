# Deploy ElevenLabs Voice Fix

## What Changed?

**Problem:** ElevenLabs blocks direct frontend API calls for security reasons (API key exposure).

**Solution:** Created a backend proxy endpoint that securely handles ElevenLabs API calls.

---

## Files Changed

### Backend
- ✅ [`backend/app/routers/elevenlabs.py`](backend/app/routers/elevenlabs.py:150) - Added `/api/elevenlabs/generate-voice` endpoint
- ✅ [`backend/.env.example`](backend/.env.example:1) - Added `ELEVENLABS_API_KEY` variable

### Frontend
- ✅ [`frontend/src/components/VoiceWelcome.tsx`](frontend/src/components/VoiceWelcome.tsx:17) - Updated to use backend proxy
- ✅ [`frontend/.env.example`](frontend/.env.example:1) - Removed `NEXT_PUBLIC_ELEVENLABS_API_KEY`

### Documentation
- ✅ [`ELEVENLABS_SETUP_GUIDE.md`](ELEVENLABS_SETUP_GUIDE.md:1) - Complete setup guide

---

## Deployment Steps

### Step 1: Deploy Backend to Render

1. **Commit and push backend changes:**
   ```bash
   git add backend/
   git commit -m "Add ElevenLabs voice proxy endpoint"
   git push origin main
   ```

2. **Add environment variable on Render:**
   - Go to: https://dashboard.render.com
   - Select: **api-tester-backend**
   - Click: **Environment** tab
   - Add variable:
     - Key: `ELEVENLABS_API_KEY`
     - Value: `sk_6cc2a1c7dea9da2d464b9227b08fc002b3ed2f1bb1551073`
   - Click: **Save Changes**

3. **Wait for auto-deploy** (2-3 minutes)

4. **Verify deployment:**
   ```bash
   curl https://api-tester-backend.onrender.com/api/elevenlabs/models
   ```
   Should return list of models ✅

### Step 2: Deploy Frontend to Vercel

1. **Remove old environment variable:**
   - Go to: https://vercel.com/digvijaybaghels-projects/api-tester/settings/environment-variables
   - Find: `NEXT_PUBLIC_ELEVENLABS_API_KEY`
   - Click: **Delete** (if exists)

2. **Commit and push frontend changes:**
   ```bash
   git add frontend/
   git commit -m "Update voice welcome to use backend proxy"
   git push origin main
   ```

3. **Vercel auto-deploys** (1-2 minutes)

4. **Verify deployment:**
   - Visit: https://api-tester-taupe.vercel.app
   - Check deployment status on Vercel dashboard

---

## Testing

### Test 1: Backend Endpoint

```bash
curl -X POST https://api-tester-backend.onrender.com/api/elevenlabs/generate-voice \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Hello world",
    "voice_id": "21m00Tcm4TlvDq8ikWAM",
    "model_id": "eleven_monolingual_v1"
  }' \
  --output test-voice.mp3
```

**Expected:** Downloads `test-voice.mp3` file ✅

### Test 2: Voice Welcome on Website

1. Open: https://api-tester-taupe.vercel.app
2. Use **Incognito/Private mode** (fresh session)
3. Click anywhere on page
4. Should hear: "Hey! Welcome to AI API Key Tester..."

**If it doesn't work:**
- Check browser console (F12) for errors
- Verify backend has `ELEVENLABS_API_KEY` set
- Check Render logs for backend errors

---

## Quick Deploy Script

Use the automated deployment script:

```bash
# Windows
deploy.bat

# Linux/Mac
./deploy.sh
```

This will:
1. Commit all changes
2. Push to GitHub
3. Trigger auto-deploy on Render and Vercel

---

## Rollback Plan

If something goes wrong:

### Rollback Backend
```bash
git revert HEAD
git push origin main
```

### Rollback Frontend
```bash
cd frontend
git revert HEAD
git push origin main
```

### Disable Voice Feature
Edit [`frontend/src/app/layout.tsx`](frontend/src/app/layout.tsx:1):
```typescript
// Comment out this line:
// <VoiceWelcome />
```

---

## Verification Checklist

After deployment, verify:

- [ ] Backend deployed successfully on Render
- [ ] `ELEVENLABS_API_KEY` set in Render environment
- [ ] Backend endpoint returns models: `/api/elevenlabs/models`
- [ ] Backend can generate voice: `/api/elevenlabs/generate-voice`
- [ ] Frontend deployed successfully on Vercel
- [ ] `NEXT_PUBLIC_ELEVENLABS_API_KEY` removed from Vercel
- [ ] Voice plays on website (incognito mode)
- [ ] Voice caches in localStorage
- [ ] Voice plays once per session
- [ ] Fallback to browser voice works if backend fails

---

## Monitoring

### Check Backend Logs
1. Go to: https://dashboard.render.com
2. Select: **api-tester-backend**
3. Click: **Logs** tab
4. Look for: "Generating voice for text..."

### Check Frontend Console
1. Open website: https://api-tester-taupe.vercel.app
2. Press F12 → Console tab
3. Look for voice-related logs

### Check ElevenLabs Usage
1. Go to: https://elevenlabs.io/app/subscription
2. Monitor character usage
3. Verify API calls are working

---

## Cost Impact

**Before (Direct Frontend Calls):**
- ❌ API key exposed in browser
- ❌ Blocked by ElevenLabs CORS policy
- ❌ Security risk

**After (Backend Proxy):**
- ✅ API key secure on backend
- ✅ Works with ElevenLabs
- ✅ No additional cost (same API usage)
- ✅ Caching reduces API calls

---

## Support

If you encounter issues:

1. **Check this guide:** [`ELEVENLABS_SETUP_GUIDE.md`](ELEVENLABS_SETUP_GUIDE.md:1)
2. **Check backend logs:** Render dashboard
3. **Check frontend console:** Browser DevTools
4. **Test API key:** See guide for testing commands
5. **Contact support:** Create GitHub issue

---

## Summary

✅ **Backend:** Added secure proxy endpoint for ElevenLabs
✅ **Frontend:** Updated to use backend proxy
✅ **Security:** API key no longer exposed
✅ **Documentation:** Complete setup guide created
✅ **Testing:** Verification steps provided

**Next:** Deploy and test!