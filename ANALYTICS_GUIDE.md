# Analytics & Visitor Tracking Guide

Complete guide for the analytics features in AI API Key Tester.

## Overview

The application now has **three separate analytics systems**:

1. **Total Visit Counter** - Counts every page load
2. **Unique Visitor Tracking** - Tracks unique visitors (secure, no PII)
3. **Google Analytics** - Professional analytics platform (optional)

---

## 1. Total Visit Counter

### What It Does:
- Counts **EVERY page load** (including refreshes)
- Shows total number of visits to your website
- Persists permanently in JSON file

### Location:
- **Frontend**: `frontend/src/components/VisitorCounter.tsx`
- **Backend**: `backend/app/simple_storage.py`
- **Storage**: `backend/app/data/visit_counter.json`

### How It Works:
```
User opens website → Counter: 1,001
User refreshes → Counter: 1,002
User refreshes again → Counter: 1,003
```

### Display:
```
👥 Total Visits: 1,234
```

### Security:
- ✅ No PII stored
- ✅ Just a simple counter
- ✅ Thread-safe operations
- ✅ Persistent storage

---

## 2. Unique Visitor Tracking

### What It Does:
- Tracks **unique visitors** using IP hashing
- Shows how many different people visited
- Separate from total visits

### Location:
- **Frontend**: `frontend/src/components/EnhancedVisitorCounter.tsx`
- **Backend**: `backend/app/unique_visitor_storage.py`
- **Storage**: `backend/app/data/unique_visitors.json`

### How It Works:
```
User A opens website → Total: 1,001 | Unique: 1
User A refreshes → Total: 1,002 | Unique: 1 (same person)
User B opens website → Total: 1,003 | Unique: 2 (new person)
User A refreshes → Total: 1,004 | Unique: 2 (still same 2 people)
```

### Display:
```
👁️ Total Visits: 1,234  |  👥 Unique: 567
```

### Security Features:
- ✅ **Zero PII** - IP addresses NEVER stored
- ✅ **HMAC-SHA256 Hashing** - Cryptographic security
- ✅ **Unique Salt** - Per-installation security
- ✅ **Thread-Safe** - Handles concurrent requests
- ✅ **GDPR Compliant** - No personal data stored

### Privacy Guarantee:
```python
# IP address: "192.168.1.1"
# Stored hash: "a3f5c8d9e2b1f4a7" (16 characters, irreversible)
# Original IP cannot be recovered from hash
```

---

## 3. Google Analytics (Optional)

### What It Does:
- Professional analytics platform
- Tracks page views, user behavior, demographics
- Provides detailed insights and reports

### Location:
- **Frontend**: `frontend/src/components/GoogleAnalytics.tsx`

### Setup Instructions:

#### Step 1: Create Google Analytics Account
1. Go to https://analytics.google.com
2. Sign in with Google account
3. Click "Start measuring"
4. Create a new property

#### Step 2: Get Measurement ID
1. In GA4, go to Admin → Data Streams
2. Click your web stream
3. Copy the **Measurement ID** (format: `G-XXXXXXXXXX`)

#### Step 3: Add to Your Project
1. Create/edit `frontend/.env.local`:
   ```bash
   NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
   ```

2. Add GoogleAnalytics component to your layout:
   ```tsx
   // frontend/src/app/layout.tsx
   import GoogleAnalytics from '@/components/GoogleAnalytics';
   
   export default function RootLayout({ children }) {
     return (
       <html>
         <body>
           <GoogleAnalytics />
           {children}
         </body>
       </html>
     );
   }
   ```

#### Step 4: Deploy
```bash
git add .
git commit -m "Add Google Analytics"
git push origin main
```

#### Step 5: Verify
1. Open your website
2. Go to GA4 → Reports → Realtime
3. You should see your visit in real-time!

### What You Get:
- 📊 Real-time visitor tracking
- 🌍 Geographic data (countries, cities)
- 📱 Device information (desktop, mobile, tablet)
- 🔍 Traffic sources (Google, direct, social media)
- ⏱️ Session duration and bounce rate
- 📈 Historical data and trends

---

## Choosing the Right Counter

### Use `VisitorCounter.tsx` if:
- ✅ You want a simple total visit count
- ✅ You don't need unique visitor tracking
- ✅ You want minimal complexity
- ✅ **This is currently active and working**

### Use `EnhancedVisitorCounter.tsx` if:
- ✅ You want both total visits AND unique visitors
- ✅ You want more detailed metrics
- ✅ You're okay with slightly more complexity
- ✅ **Recommended for better insights**

### Use Google Analytics if:
- ✅ You want professional-grade analytics
- ✅ You need detailed reports and insights
- ✅ You want to track user behavior
- ✅ **Recommended for serious websites**

---

## Switching to Enhanced Counter

To switch from simple to enhanced counter:

### Step 1: Update Page Component
```tsx
// frontend/src/app/page.tsx

// Replace this:
import VisitorCounter from '@/components/VisitorCounter';

// With this:
import EnhancedVisitorCounter from '@/components/EnhancedVisitorCounter';

// Then replace the component:
<EnhancedVisitorCounter />
```

### Step 2: Deploy
```bash
git add .
git commit -m "Switch to enhanced visitor counter"
git push origin main
```

### Step 3: Verify
- Open your website
- You should now see: "👁️ Total Visits: X | 👥 Unique: Y"

---

## Data Storage

### Total Visits:
```json
// backend/app/data/visit_counter.json
{
  "total_visits": 1234,
  "last_updated": "2026-03-18T10:00:00.000Z",
  "version": "3.0"
}
```

### Unique Visitors:
```json
// backend/app/data/unique_visitors.json
{
  "unique_visitor_hashes": [
    "a3f5c8d9e2b1f4a7",
    "b2e4d7f9c1a8e5b3",
    "c9f1e3b7d4a2f8c6"
  ],
  "last_updated": "2026-03-18T10:00:00.000Z",
  "version": "1.0"
}
```

### Security Salt:
```
// backend/app/data/.unique_salt
a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6
```

---

## Monitoring & Maintenance

### Check Logs (Render):
```bash
# In Render dashboard → Logs
[Storage] Total visits: 1234
[Unique Visitors] New unique visitor! Total unique: 567
[Google Analytics] Page view tracked: /
```

### Reset Counters (if needed):
```bash
# SSH into Render or use API endpoint
POST /api/visitors/reset
```

### Backup Data:
```bash
# Download from Render
backend/app/data/visit_counter.json
backend/app/data/unique_visitors.json
```

---

## Troubleshooting

### Counter Not Incrementing:
1. Check browser console (F12)
2. Look for CORS errors
3. Verify backend is deployed
4. Check Render logs

### Unique Visitors Always 0:
1. Verify `unique_visitor_storage.py` is deployed
2. Check backend logs for errors
3. Ensure IP address is being passed correctly

### Google Analytics Not Working:
1. Verify `NEXT_PUBLIC_GA_MEASUREMENT_ID` is set
2. Check browser console for GA errors
3. Wait 24-48 hours for data to appear in GA4
4. Use Realtime reports for immediate verification

---

## Best Practices

### 1. Use All Three Systems:
- **Total Visits** - Quick metric on homepage
- **Unique Visitors** - Better understanding of reach
- **Google Analytics** - Detailed insights and reports

### 2. Monitor Regularly:
- Check counters daily
- Review GA4 reports weekly
- Look for unusual patterns

### 3. Privacy First:
- Never store actual IP addresses
- Use secure hashing for unique tracking
- Comply with GDPR/CCPA

### 4. Backup Data:
- Download counter files monthly
- Export GA4 data quarterly
- Keep historical records

---

## FAQ

**Q: Will the counter reset if Render restarts?**  
A: No! Data is stored in persistent JSON files.

**Q: Can I see individual visitor IPs?**  
A: No. We only store cryptographic hashes, not actual IPs.

**Q: How accurate is unique visitor tracking?**  
A: Very accurate. Uses IP-based hashing with secure salt.

**Q: Does Google Analytics slow down my site?**  
A: Minimal impact. GA loads asynchronously.

**Q: Can I use all three systems together?**  
A: Yes! They're completely independent and complementary.

---

## Support

For issues or questions:
- Check browser console (F12)
- Review Render logs
- Check this documentation
- Contact: Digvijay Singh Baghel

---

**Made with ❤️ by Bob**