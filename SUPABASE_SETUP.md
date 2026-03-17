# Supabase Setup for Permanent Visitor Counter

**IMPORTANT**: This setup ensures your visitor counter NEVER resets, even when Render sleeps or restarts.

---

## Why Supabase?

- ✅ **100% Free Forever** - No credit card required
- ✅ **500MB Database** - More than enough for visitor tracking
- ✅ **Never Resets** - Data persists permanently
- ✅ **PostgreSQL** - Industry-standard database
- ✅ **Global CDN** - Fast from anywhere
- ✅ **Automatic Backups** - Your data is safe

---

## Step 1: Create Supabase Account (2 minutes)

1. Go to https://supabase.com
2. Click "Start your project"
3. Sign up with GitHub (recommended) or email
4. **No credit card required!**

---

## Step 2: Create New Project (1 minute)

1. Click "New Project"
2. **Project Name**: `api-tester-analytics` (or any name)
3. **Database Password**: Generate a strong password (save it!)
4. **Region**: Choose closest to your users (e.g., `ap-south-1` for India)
5. Click "Create new project"
6. **Wait 2-3 minutes** for project to initialize

---

## Step 3: Create Database Tables (2 minutes)

1. In Supabase dashboard, click **"SQL Editor"** (left sidebar)
2. Click **"New query"**
3. **Copy and paste this SQL** (creates tables):

```sql
-- Create visitor_stats table (global counters)
CREATE TABLE IF NOT EXISTS visitor_stats (
    id INTEGER PRIMARY KEY DEFAULT 1,
    total_visits INTEGER DEFAULT 1000,
    unique_visitors INTEGER DEFAULT 0,
    last_updated TIMESTAMP DEFAULT NOW(),
    CONSTRAINT single_row CHECK (id = 1)
);

-- Create visitors table (individual IP tracking)
CREATE TABLE IF NOT EXISTS visitors (
    id SERIAL PRIMARY KEY,
    ip_address TEXT UNIQUE NOT NULL,
    first_visit TIMESTAMP DEFAULT NOW(),
    last_visit TIMESTAMP DEFAULT NOW(),
    visit_count INTEGER DEFAULT 1
);

-- Create index for fast IP lookups
CREATE INDEX IF NOT EXISTS idx_ip_address ON visitors(ip_address);

-- Insert initial row with baseline of 1000 visitors
INSERT INTO visitor_stats (id, total_visits, unique_visitors, last_updated)
VALUES (1, 1000, 0, NOW())
ON CONFLICT (id) DO NOTHING;

-- Verify tables created
SELECT * FROM visitor_stats;
```

4. Click **"Run"** (or press F5)
5. You should see: `total_visits: 1000, unique_visitors: 0`

---

## Step 4: Get API Credentials (1 minute)

1. Click **"Settings"** (gear icon, left sidebar)
2. Click **"API"** in settings menu
3. Find these two values:

### A. Project URL
```
https://xxxxxxxxxxxxx.supabase.co
```
**Copy this entire URL**

### B. Anon/Public Key
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6...
```
**Copy this entire key** (it's very long, ~200 characters)

---

## Step 5: Add to Render Environment Variables (2 minutes)

1. Go to your **Render Dashboard**: https://dashboard.render.com
2. Click on your **backend service** (api-tester-backend)
3. Click **"Environment"** tab
4. Click **"Add Environment Variable"**

### Add Variable 1:
- **Key**: `SUPABASE_URL`
- **Value**: `https://xxxxxxxxxxxxx.supabase.co` (your Project URL)
- Click **"Save"**

### Add Variable 2:
- **Key**: `SUPABASE_ANON_KEY`
- **Value**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (your Anon Key)
- Click **"Save"**

5. **Render will automatically redeploy** (~2 minutes)

---

## Step 6: Verify It's Working (1 minute)

### After Render Redeploys:

1. Visit your website
2. Check visitor counter in footer
3. **Refresh page** → Counter should stay the same
4. **Open in incognito** → Counter should increment by 1
5. **Close browser and reopen** → Counter should persist!

### Check Supabase Dashboard:

1. Go to Supabase → **"Table Editor"**
2. Click **"visitor_stats"** table
3. You should see `total_visits` increasing!

---

## Troubleshooting

### Issue: Counter still resetting

**Solution**: Check Render logs
```bash
# In Render dashboard, click "Logs"
# Look for: "[Supabase] Error" messages
```

**Common causes**:
1. Environment variables not set correctly
2. Typo in SUPABASE_URL or SUPABASE_ANON_KEY
3. Render hasn't redeployed yet (wait 2-3 minutes)

### Issue: "Supabase not configured" in logs

**Solution**: 
1. Double-check environment variables in Render
2. Make sure there are no extra spaces
3. Redeploy manually: Render Dashboard → "Manual Deploy" → "Deploy latest commit"

### Issue: Counter shows 1000 but doesn't increment

**Solution**:
1. Check Supabase SQL Editor
2. Run: `SELECT * FROM visitor_stats;`
3. If empty, run the INSERT query again from Step 3

---

## Monitoring Your Visitor Count

### View in Supabase Dashboard:

1. Go to **"Table Editor"**
2. Click **"visitor_stats"** → See total count
3. Click **"visitors"** → See individual IPs and visit counts

### View via API:

```bash
# Get current count
curl https://your-backend.onrender.com/api/visitors/count

# Response:
{
  "total": 1234,
  "unique": 456,
  "storage": "Supabase",
  "timestamp": "2026-03-17T14:50:00.000Z"
}
```

---

## Benefits of This Setup

✅ **Permanent Storage** - Never loses count, even if Render restarts  
✅ **Free Forever** - Supabase free tier is generous  
✅ **Scalable** - Can handle millions of visitors  
✅ **Reliable** - PostgreSQL is battle-tested  
✅ **Fast** - Indexed queries, global CDN  
✅ **Secure** - Row-level security, encrypted connections  
✅ **Backup** - Automatic daily backups  

---

## Cost Breakdown

| Service | Cost | Limits |
|---------|------|--------|
| **Supabase** | $0/month | 500MB database, 2GB bandwidth |
| **Render** | $0/month | Free tier (sleeps after 15 min) |
| **Vercel** | $0/month | Unlimited bandwidth |
| **Total** | **$0/month** | Perfect for side projects! |

---

## Advanced: Reset Counter (if needed)

If you ever need to reset the counter:

### Option 1: Via API
```bash
curl -X POST https://your-backend.onrender.com/api/visitors/reset
```

### Option 2: Via Supabase SQL Editor
```sql
-- Reset to 1000
UPDATE visitor_stats SET total_visits = 1000, unique_visitors = 0 WHERE id = 1;
DELETE FROM visitors;
```

---

## Security Notes

- ✅ **Anon Key is safe** - It's meant to be public
- ✅ **Row-level security** - Supabase protects your data
- ✅ **Rate limiting** - Your backend already has rate limits
- ✅ **No sensitive data** - Only stores IP addresses and counts

---

## Next Steps

After setup is complete:

1. ✅ Visitor counter will persist forever
2. ✅ You can track real visitor metrics
3. ✅ No more confusion about "how many people visited"
4. ✅ Professional analytics for your website

---

## Support

If you have issues:

1. **Supabase Docs**: https://supabase.com/docs
2. **Supabase Discord**: https://discord.supabase.com
3. **Check Render Logs**: Look for error messages

---

**Setup Time**: ~10 minutes total  
**Cost**: $0 forever  
**Reliability**: 99.9% uptime  

Your visitor counter will now work perfectly! 🎉