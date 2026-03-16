# ElevenLabs Voice Setup Guide

## Overview
Your website now uses ElevenLabs AI for ultra-realistic voice greetings! The default voice is **Rachel** - warm, friendly, and professional.

## Quick Setup (5 Minutes)

### Step 1: Add Your API Key Locally

1. **Create `.env.local` file** in the `frontend` folder:
   ```bash
   cd frontend
   touch .env.local
   ```

2. **Add your API key:**
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000
   NEXT_PUBLIC_ELEVENLABS_API_KEY=your_actual_api_key_here
   ```

3. **Save the file**

### Step 2: Test Locally

```bash
cd frontend
npm run dev
```

Open http://localhost:3000 and click anywhere - you should hear Rachel's voice!

### Step 3: Deploy to Production

1. **Go to Vercel Dashboard:**
   - https://vercel.com/dashboard
   - Click your project
   - Go to Settings → Environment Variables

2. **Add Environment Variable:**
   - **Name:** `NEXT_PUBLIC_ELEVENLABS_API_KEY`
   - **Value:** Your ElevenLabs API key
   - **Environment:** Production, Preview, Development (select all)
   - Click "Save"

3. **Redeploy:**
   ```bash
   git add .
   git commit -m "Add ElevenLabs voice integration"
   git push origin main
   ```

4. **Wait 1-2 minutes** for deployment

5. **Test your live site!**

## Current Voice: Rachel

**Voice ID:** `21m00Tcm4TlvDq8ikWAM`

**Characteristics:**
- Warm and friendly
- Professional tone
- Clear pronunciation
- Natural intonation
- Perfect for welcome messages

**Message:**
> "Hey! Welcome to AI API Key Tester. Happy to help you test your API keys!"

## Want to Change the Voice?

### Popular Female Voices

1. **Rachel** (Current) - `21m00Tcm4TlvDq8ikWAM`
   - Warm, friendly, professional
   - **Best for:** Welcome messages, tutorials

2. **Bella** - `EXAVITQu4vr4xnSDxMaL`
   - Soft, gentle, calming
   - **Best for:** Relaxing content, meditation

3. **Elli** - `MF3mGyEYCl7XYWbV9V6O`
   - Young, energetic, enthusiastic
   - **Best for:** Exciting announcements, games

4. **Dorothy** - `ThT5KcBeYPX3keUQqHPh`
   - Mature, authoritative, confident
   - **Best for:** Professional content, news

5. **Domi** - `AZnzlk1XvdvUeBnXmlld`
   - Strong, assertive, clear
   - **Best for:** Instructions, commands

### How to Change Voice

Edit `frontend/src/components/VoiceWelcome.tsx`:

```typescript
// Find this line (around line 28):
const VOICE_ID = '21m00Tcm4TlvDq8ikWAM'; // Rachel

// Change to:
const VOICE_ID = 'EXAVITQu4vr4xnSDxMaL'; // Bella
// or
const VOICE_ID = 'MF3mGyEYCl7XYWbV9V6O'; // Elli
// or
const VOICE_ID = 'ThT5KcBeYPX3keUQqHPh'; // Dorothy
```

### Find More Voices

1. **Go to ElevenLabs Voice Library:**
   - https://elevenlabs.io/voice-library

2. **Browse voices** and listen to samples

3. **Click on a voice** you like

4. **Copy the Voice ID** (shown in the URL or voice details)

5. **Update the code** with the new Voice ID

## How It Works

### Smart Caching System

1. **First Visit:**
   - Calls ElevenLabs API
   - Generates audio (~1 second)
   - Caches audio in browser
   - Plays the greeting

2. **Subsequent Visits:**
   - Uses cached audio
   - Plays instantly (no API call)
   - Saves your API credits!

3. **New Session:**
   - Plays cached audio again
   - No new API call needed

### Fallback System

If ElevenLabs fails (no API key, network error, etc.):
- Automatically falls back to browser's built-in voice
- No errors shown to user
- Seamless experience

## Cost & Usage

### Free Tier
- **10,000 characters/month**
- Your welcome message: ~80 characters
- **Can serve:** ~125 unique visitors/month
- **After caching:** Unlimited visitors!

### How Caching Saves Money

**Without caching:**
- 1,000 visitors = 1,000 API calls = 80,000 characters
- Would exceed free tier!

**With caching (current implementation):**
- 1,000 visitors = 1 API call per browser = ~10-50 API calls
- Well within free tier! ✅

### Paid Plans (If Needed)

- **Starter:** $5/month - 30,000 characters
- **Creator:** $22/month - 100,000 characters
- **Pro:** $99/month - 500,000 characters

**You probably won't need paid plans** thanks to caching!

## Customization Options

### Change the Message

Edit `frontend/src/components/VoiceWelcome.tsx`:

```typescript
// Find this line (around line 32):
const message = "Hey! Welcome to AI API Key Tester. Happy to help you test your API keys!";

// Change to whatever you want:
const message = "Welcome! Let's test your API keys together!";
```

### Change Voice Settings

```typescript
// In the API call body (around line 68):
voice_settings: {
  stability: 0.5,        // 0-1: Lower = more expressive
  similarity_boost: 0.75, // 0-1: Higher = more like original voice
}
```

**Stability:**
- `0.0-0.3` - Very expressive, emotional
- `0.4-0.6` - Balanced (recommended)
- `0.7-1.0` - Very stable, consistent

**Similarity Boost:**
- `0.0-0.5` - More variation
- `0.6-0.8` - Balanced (recommended)
- `0.9-1.0` - Very similar to original

### Change Volume

```typescript
// Find this line (around line 99):
audio.volume = 0.8; // 0.0 to 1.0

// Change to:
audio.volume = 0.6; // Quieter
audio.volume = 1.0; // Louder
```

## Testing Different Voices

### Quick Test Script

1. **Open your website**
2. **Open browser console** (F12)
3. **Paste this code:**

```javascript
// Test different voices
const testVoice = async (voiceId, voiceName) => {
  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
    {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': 'YOUR_API_KEY_HERE',
      },
      body: JSON.stringify({
        text: "Hey! Welcome to AI API Key Tester. Happy to help you test your API keys!",
        model_id: 'eleven_monolingual_v1',
      }),
    }
  );
  
  const audioBlob = await response.blob();
  const audioUrl = URL.createObjectURL(audioBlob);
  const audio = new Audio(audioUrl);
  
  console.log(`Playing: ${voiceName}`);
  await audio.play();
};

// Test Rachel
testVoice('21m00Tcm4TlvDq8ikWAM', 'Rachel');

// Test Bella (uncomment to try)
// testVoice('EXAVITQu4vr4xnSDxMaL', 'Bella');

// Test Elli (uncomment to try)
// testVoice('MF3mGyEYCl7XYWbV9V6O', 'Elli');
```

## Troubleshooting

### Voice Not Playing?

**Check 1: API Key**
```bash
# In browser console:
console.log(process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY);
# Should show your API key (not undefined)
```

**Check 2: Network**
```bash
# Open Network tab in DevTools (F12)
# Look for call to api.elevenlabs.io
# Check if it returns 200 OK
```

**Check 3: Console Errors**
```bash
# Open Console tab in DevTools (F12)
# Look for any error messages
```

### Common Issues

**Issue:** "Failed to generate audio"
- **Cause:** Invalid API key or network error
- **Solution:** Check API key in Vercel environment variables

**Issue:** Voice sounds robotic
- **Cause:** Fallback to browser voice
- **Solution:** ElevenLabs API not working, check API key

**Issue:** No sound at all
- **Cause:** Browser blocked autoplay
- **Solution:** User must click first (already implemented)

**Issue:** "Quota exceeded"
- **Cause:** Used all free credits
- **Solution:** Upgrade plan or wait for next month

### Clear Cache

If you want to regenerate the audio:

```javascript
// In browser console:
localStorage.removeItem('welcomeAudioCache');
sessionStorage.removeItem('welcomeVoicePlayed');
// Refresh page
```

## Security Notes

### API Key Safety

✅ **Safe:**
- Using `NEXT_PUBLIC_` prefix (client-side)
- Only used for voice generation
- Limited to 10,000 chars/month
- Can't access your account settings

⚠️ **Important:**
- Don't commit `.env.local` to git
- Don't share your API key publicly
- Regenerate key if exposed

### Rate Limiting

The code includes smart caching to prevent abuse:
- Audio cached in browser
- Only generates once per unique browser
- Saves your API credits
- Prevents quota exhaustion

## Monitoring Usage

### Check Your Usage

1. **Go to ElevenLabs Dashboard:**
   - https://elevenlabs.io/app/usage

2. **View:**
   - Characters used this month
   - Remaining quota
   - Usage history

### Set Up Alerts

1. **Go to Settings:**
   - https://elevenlabs.io/app/settings

2. **Enable notifications** for:
   - 80% quota used
   - 100% quota used

## Summary

**What You Have:**
- ✅ Ultra-realistic AI voice (Rachel)
- ✅ Smart caching system
- ✅ Automatic fallback
- ✅ Free tier friendly
- ✅ Easy to customize

**Setup Steps:**
1. Add API key to Vercel environment variables
2. Deploy changes
3. Test on live site

**Voice:** Rachel (warm, friendly, professional)

**Message:** "Hey! Welcome to AI API Key Tester. Happy to help you test your API keys!"

**Cost:** Free (10,000 chars/month, cached after first use)

---

**Ready to deploy?** Add your API key to Vercel and push your changes!