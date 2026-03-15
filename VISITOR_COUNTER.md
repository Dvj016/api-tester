# Visitor Counter Documentation

## Overview

The visitor counter displays the total number of visitors to your website. It's implemented using **CountAPI** - a free, no-registration-required service that provides simple visitor counting.

## Features

- ✅ **Free Forever** - No registration or API key needed
- ✅ **No Database Required** - Hosted externally by CountAPI
- ✅ **Real-time Updates** - Increments on each page visit
- ✅ **Privacy-Friendly** - No personal data collected
- ✅ **Simple Integration** - Just one API call

## How It Works

### Technical Implementation

The visitor counter is implemented in `frontend/src/components/VisitorCounter.tsx`:

1. **On Page Load**: Component makes a GET request to CountAPI
2. **Counter Increments**: Each visit increments the counter by 1
3. **Display**: Shows total visitor count in the footer
4. **Caching**: CountAPI handles all storage and persistence

### API Endpoint

```
https://api.countapi.xyz/hit/{namespace}/{key}
```

**Current Configuration:**
- Namespace: `ai-api-key-tester`
- Key: `visits`

### Response Format

```json
{
  "value": 1234
}
```

## Location

The visitor counter is displayed in the **footer** of the homepage, between the creator credit and security notice:

```
© 2026 AI API Key Tester
Created by Digvijay Singh Baghel

[👥 Visitors: 1,234]  ← Visitor Counter Here

🔒 API keys are never stored...
```

## Customization

### Change Counter Appearance

Edit `frontend/src/components/VisitorCounter.tsx`:

```tsx
// Current design
<div className="inline-flex items-center space-x-2 px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg">
  <Users className="w-4 h-4 text-primary-400" />
  <div className="flex items-center space-x-2 text-sm">
    <span className="text-gray-400">Visitors:</span>
    <span className="text-white font-semibold">{stats.total.toLocaleString()}</span>
  </div>
</div>
```

### Change Counter Position

Edit `frontend/src/app/page.tsx` to move the counter:

```tsx
{/* Current position - in footer */}
<div className="flex justify-center mt-4">
  <VisitorCounter />
</div>
```

### Use Different Namespace/Key

If you want a unique counter (recommended for production):

```tsx
// In VisitorCounter.tsx
const namespace = 'your-unique-name'; // Change this
const key = 'visits';
```

**Tip**: Use your domain name as namespace to avoid conflicts:
```tsx
const namespace = 'mywebsite-com';
```

## Features & Limitations

### What It Tracks

- ✅ Total page visits (all time)
- ✅ Increments on each page load
- ✅ Works across all devices

### What It Doesn't Track

- ❌ Unique visitors (counts all visits)
- ❌ Daily/weekly breakdowns
- ❌ Geographic location
- ❌ User behavior
- ❌ Page-specific visits

### Limitations

1. **Not Unique Visitors**: Counts every page load, not unique users
2. **No Analytics**: Just a simple counter, no detailed analytics
3. **Public API**: Anyone can see the count (by design)
4. **No Reset**: Counter persists forever (unless you change namespace/key)

## Advanced Options

### Option 1: Get Count Without Incrementing

If you want to display the count without incrementing:

```tsx
// Use 'get' instead of 'hit'
const response = await fetch(
  `https://api.countapi.xyz/get/${namespace}/${key}`
);
```

### Option 2: Multiple Counters

Track different metrics:

```tsx
// Total visits
const visits = await fetch('https://api.countapi.xyz/hit/mysite/visits');

// API tests performed
const tests = await fetch('https://api.countapi.xyz/hit/mysite/tests');
```

### Option 3: Reset Counter

To reset, simply change the key:

```tsx
// Old: const key = 'visits';
const key = 'visits-v2'; // New counter starts at 0
```

## Alternative Services

If you need more features, consider these alternatives:

### 1. Google Analytics (Free)

**Pros:**
- Detailed analytics
- Unique visitors
- Geographic data
- User behavior tracking

**Cons:**
- Requires setup
- Privacy concerns
- Cookie consent needed

**Setup:**
```bash
npm install @next/third-parties
```

### 2. Plausible Analytics (Paid)

**Pros:**
- Privacy-friendly
- No cookies
- Beautiful dashboard
- GDPR compliant

**Cons:**
- $9/month
- Requires account

### 3. Simple Analytics (Paid)

**Pros:**
- Privacy-focused
- Simple interface
- No cookies

**Cons:**
- $19/month

### 4. Umami (Self-hosted, Free)

**Pros:**
- Open source
- Self-hosted
- Privacy-friendly
- Free

**Cons:**
- Requires server setup
- More complex

## Troubleshooting

### Counter Not Showing

**Check:**
1. Browser console for errors (F12)
2. Network tab - is API call successful?
3. CountAPI status: [status.countapi.xyz](https://status.countapi.xyz)

**Common Issues:**
- **CORS Error**: Shouldn't happen with CountAPI, but check browser console
- **API Down**: CountAPI might be temporarily unavailable
- **Network Error**: Check internet connection

### Counter Shows 0

**Possible Reasons:**
1. First time loading (counter starts at 0)
2. API call failed (check console)
3. Wrong namespace/key combination

### Counter Not Incrementing

**Check:**
1. Using `hit` endpoint (not `get`)
2. Namespace and key are correct
3. Browser cache (try hard refresh: Ctrl+Shift+R)

## Privacy & GDPR

### Is It GDPR Compliant?

**Yes**, the visitor counter is GDPR compliant because:

1. **No Personal Data**: Doesn't collect IP addresses, cookies, or personal info
2. **No Tracking**: Just increments a number
3. **No Cookies**: Doesn't use cookies
4. **Public Data**: The count is public information

### Do I Need Cookie Consent?

**No**, because:
- No cookies are used
- No personal data is collected
- It's just a simple counter

## Performance

### Impact on Page Load

- **Minimal**: ~50-100ms for API call
- **Non-blocking**: Loads asynchronously
- **Graceful Failure**: If API fails, counter just doesn't show

### Optimization

The component is already optimized:
- Loads only once per page visit
- Doesn't show while loading (no flash)
- Fails silently if API is down

## Cost

**Free Forever** ✅

CountAPI is completely free with no limits for basic usage.

## Support

### CountAPI Documentation

- Website: [countapi.xyz](https://countapi.xyz)
- Docs: [api.countapi.xyz](https://api.countapi.xyz)
- Status: [status.countapi.xyz](https://status.countapi.xyz)

### Project Support

- **Creator**: Digvijay Singh Baghel
- **Feedback**: Use feedback form on website

## Summary

**Quick Facts:**
- ✅ Free, no registration
- ✅ Shows total visitor count
- ✅ Located in footer
- ✅ Privacy-friendly
- ✅ No database needed
- ✅ Works immediately

**Perfect for:**
- Simple visitor tracking
- Showing site popularity
- No-hassle implementation

**Not suitable for:**
- Detailed analytics
- Unique visitor tracking
- Business intelligence

---

**Last Updated**: March 15, 2026
**Created by**: Digvijay Singh Baghel