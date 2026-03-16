# ElevenLabs Voice Welcome Setup Guide

## Overview
The voice welcome feature uses ElevenLabs API to generate high-quality voice greetings. For security, the API key is stored on the backend, not exposed to the frontend.

---

## Architecture

```
Frontend (Vercel)
    ↓ (No API key needed)
Backend (Render)
    ↓ (Uses ELEVENLABS_API_KEY)
ElevenLabs API
```

**Key Security Feature:** The frontend calls the backend proxy endpoint, which then calls ElevenLabs. This keeps your API key secure on the server.

---

## Setup Steps

### 1. Get ElevenLabs API Key

1. Go to: https://elevenlabs.io/app/settings/api-keys
2. Log in to your account
3. Click **"Create API Key"**
4. Give it a name (e.g., "API Tester Backend")
5. **Copy the key immediately** (starts with `sk_`)

### 2. Test Your API Key

Open browser console and run:
```javascript
fetch('https://api.elevenlabs.io/v1/voices', {
  headers: {'xi-api-key': 'YOUR_KEY_HERE'}
})
.then(r => r.ok ? 'Key works!' : 'Key invalid: ' + r.status)
.then(console.log)
```

**Expected result:** `"Key works!"` ✅

### 3. Add API Key to Backend (Render)

1. Go to: https://dashboard.render.com
2. Select your backend service: **api-tester-backend**
3. Click **"Environment"** tab
4. Click **"Add Environment Variable"**
5. Add:
   - **Key:** `ELEVENLABS_API_KEY`
   - **Value:** `sk_your_actual_key_here`
6. Click **"Save Changes"**
7. Render will automatically redeploy

### 4. Verify Backend Deployment

Wait 2-3 minutes for deployment, then test:
```bash
curl https://api-tester-backend.onrender.com/api/elevenlabs/models
```

Should return:
```json
{
  "models": [
    "eleven_monolingual_v1",
    "eleven_multilingual_v1",
    "eleven_multilingual_v2",
    "eleven_turbo_v2"
  ]
}
```

### 5. Deploy Frontend (Vercel)

**Important:** You do NOT need to add `NEXT_PUBLIC_ELEVENLABS_API_KEY` to Vercel anymore!

The frontend now uses the backend proxy, so:
1. Go to Vercel → Settings → Environment Variables
2. **DELETE** `NEXT_PUBLIC_ELEVENLABS_API_KEY` if it exists
3. Redeploy frontend

---

## How It Works

### Old Method (Insecure) ❌
```
Frontend → ElevenLabs API (with exposed API key)
```
**Problem:** API key visible in browser, can be stolen

### New Method (Secure) ✅
```
Frontend → Backend Proxy → ElevenLabs API
```
**Benefit:** API key stays secure on backend server

### Code Flow

1. **User visits website**
2. **Frontend calls:** `POST /api/elevenlabs/generate-voice`
   ```json
   {
     "text": "Hey! Welcome to AI API Key Tester...",
     "voice_id": "ZT9u07TYPVl83ejeLakq",
     "model_id": "eleven_monolingual_v1"
   }
   ```
3. **Backend:**
   - Gets `ELEVENLABS_API_KEY` from environment
   - Calls ElevenLabs API with secure key
   - Returns audio file to frontend
4. **Frontend:**
   - Plays audio
   - Caches in localStorage for future visits

---

## Testing

### Test Backend Endpoint

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

Should download `test-voice.mp3` file.

### Test on Website

1. Visit: https://api-tester-taupe.vercel.app
2. Open in **Incognito/Private mode** (fresh session)
3. Click anywhere on the page
4. Should hear: "Hey! Welcome to AI API Key Tester..."

---

## Troubleshooting

### Issue: No voice plays

**Check 1:** Backend has API key
```bash
# This should NOT return 500 error
curl https://api-tester-backend.onrender.com/api/elevenlabs/models
```

**Check 2:** Browser console for errors
- Press F12 → Console tab
- Look for errors related to voice generation

**Check 3:** Clear cache
- Clear localStorage: `localStorage.clear()`
- Clear sessionStorage: `sessionStorage.clear()`
- Refresh page

### Issue: 401 Unauthorized

**Cause:** Invalid API key on backend

**Solution:**
1. Generate new key from ElevenLabs dashboard
2. Test it in browser console (see step 2 above)
3. Update `ELEVENLABS_API_KEY` on Render
4. Wait for redeploy

### Issue: 429 Quota Exceeded

**Cause:** Used all ElevenLabs credits

**Solution:**
1. Check quota: https://elevenlabs.io/app/subscription
2. Upgrade plan or wait for monthly reset
3. Voice will fallback to browser's built-in voice

### Issue: Fallback to browser voice

**Cause:** Backend API call failed

**Behavior:** This is expected! The app gracefully falls back to browser's speech synthesis if ElevenLabs fails.

**To fix:** Check backend logs on Render for errors

---

## Voice Options

You can change the voice by modifying `voice_id` in [`VoiceWelcome.tsx`](frontend/src/components/VoiceWelcome.tsx:26):

```typescript
const VOICE_ID = 'ZT9u07TYPVl83ejeLakq'; // Your custom voice
```

**Popular voices:**
- Rachel: `21m00Tcm4TlvDq8ikWAM` (warm, friendly female)
- Bella: `EXAVITQu4vr4xnSDxMaL` (warm, friendly female)
- Elli: `MF3mGyEYCl7XYWbV9V6O` (young, energetic female)
- Dorothy: `ThT5KcBeYPX3keUQqHPh` (mature, authoritative female)

Find more voices: https://elevenlabs.io/app/voice-library

---

## Cost Optimization

### Caching Strategy

The app caches generated audio in localStorage:
- **First visit:** Calls ElevenLabs API (costs credits)
- **Subsequent visits:** Uses cached audio (free)
- **Cache duration:** Until user clears browser data

### Session Control

Voice plays once per session using sessionStorage:
- **First interaction:** Plays voice
- **Same session:** Won't play again
- **New session:** Plays again (but uses cache)

### Estimated Costs

- **Free tier:** 10,000 characters/month
- **Welcome message:** ~80 characters
- **Plays per month:** ~125 unique visitors
- **With caching:** Effectively unlimited (cache reuse)

---

## Security Best Practices

✅ **DO:**
- Store API key in backend environment variables
- Use backend proxy for all ElevenLabs calls
- Rotate API keys periodically
- Monitor usage on ElevenLabs dashboard

❌ **DON'T:**
- Expose API key in frontend code
- Commit API keys to git
- Share API keys publicly
- Use `NEXT_PUBLIC_` prefix for ElevenLabs key

---

## Quick Reference

| Component | Location | Purpose |
|-----------|----------|---------|
| Backend Endpoint | [`backend/app/routers/elevenlabs.py`](backend/app/routers/elevenlabs.py:150) | Proxy for voice generation |
| Frontend Component | [`frontend/src/components/VoiceWelcome.tsx`](frontend/src/components/VoiceWelcome.tsx:1) | Plays welcome voice |
| Environment Variable | Render Dashboard | `ELEVENLABS_API_KEY` |
| API Documentation | https://elevenlabs.io/docs | Official docs |

---

## Support

If you need help:
1. Check Render logs for backend errors
2. Check browser console for frontend errors
3. Verify API key is valid on ElevenLabs dashboard
4. Test backend endpoint directly with curl
5. Contact ElevenLabs support: support@elevenlabs.io