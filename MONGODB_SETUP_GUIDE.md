# 🗄️ MongoDB Atlas Setup Guide for Visitor Counter

## Why MongoDB?

Your visitor counter was resetting because **Render's free tier has ephemeral storage** - files get deleted when:
- The service goes to sleep (after 15 minutes of inactivity)
- You deploy new code
- Render restarts the service

**MongoDB Atlas solves this permanently:**
- ✅ **Forever Free** (512MB storage)
- ✅ **No credit card required**
- ✅ **Data persists forever**
- ✅ **Survives deployments and restarts**
- ✅ **Fast and reliable**

---

## 📋 Setup Steps (10 minutes)

### Step 1: Create MongoDB Atlas Account

1. Go to https://www.mongodb.com/cloud/atlas/register
2. Sign up with:
   - Email address
   - OR Google account
   - OR GitHub account
3. **No credit card required!**

### Step 2: Create a Free Cluster

1. After signing in, click **"Build a Database"**
2. Choose **"M0 FREE"** tier:
   - ✅ 512 MB Storage
   - ✅ Shared RAM
   - ✅ No credit card required
3. Select cloud provider and region:
   - **Provider:** AWS (recommended)
   - **Region:** Choose closest to your users (e.g., `us-east-1` for USA, `eu-west-1` for Europe)
4. **Cluster Name:** `api-tester` (or any name you like)
5. Click **"Create"**
6. Wait 1-3 minutes for cluster creation

### Step 3: Create Database User

1. You'll see a **"Security Quickstart"** screen
2. **Authentication Method:** Username and Password
3. Create credentials:
   - **Username:** `api_tester_user` (or any username)
   - **Password:** Click **"Autogenerate Secure Password"**
   - **IMPORTANT:** Copy and save this password somewhere safe!
4. Click **"Create User"**

### Step 4: Configure Network Access

1. Still on Security Quickstart screen
2. **Where would you like to connect from?**
3. Choose **"Cloud Environment"**
4. Click **"Add Entry"**
5. In the popup:
   - **Access List Entry:** `0.0.0.0/0`
   - **Description:** `Allow from anywhere`
6. Click **"Add Entry"**
7. Click **"Finish and Close"**

**Note:** `0.0.0.0/0` allows connections from any IP. This is safe because:
- Your database still requires username/password
- Only your backend knows the connection string
- MongoDB Atlas has built-in DDoS protection

### Step 5: Get Connection String

1. Click **"Connect"** button on your cluster
2. Choose **"Drivers"**
3. **Driver:** Python
4. **Version:** 3.12 or later
5. Copy the connection string (looks like):
   ```
   mongodb+srv://api_tester_user:<password>@api-tester.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
6. **IMPORTANT:** Replace `<password>` with your actual password from Step 3

**Example:**
```
mongodb+srv://api_tester_user:MySecurePass123@api-tester.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

---

## 🚀 Deploy to Render

### Step 6: Add MongoDB URI to Render

1. Go to https://dashboard.render.com
2. Click your backend service: **ai-api-key-tester-backend**
3. Click **"Environment"** in the left sidebar
4. Click **"Add Environment Variable"**
5. Add:
   - **Key:** `MONGODB_URI`
   - **Value:** Your connection string from Step 5
6. Click **"Save Changes"**

**Render will automatically redeploy your backend (2-3 minutes)**

---

## ✅ Verify It's Working

### After Render Redeploys:

1. Open your website: https://api-tester-taupe.vercel.app
2. Open browser console (F12)
3. Look for these messages:
   ```
   [MongoDB] Connected successfully to MongoDB Atlas
   [MongoDB] Visitor Counter Ready: 1002 total visits
   [Analytics] Using MongoDB Atlas for persistent storage
   ```

4. Check the visitor counter response:
   ```json
   {
     "total": 1002,
     "unique": 1,
     "storage": "MongoDB Atlas",  // ← Should say "MongoDB Atlas"
     "timestamp": "2026-03-18T..."
   }
   ```

### Test Persistence:

1. Note the current visitor count (e.g., 1002)
2. Wait for Render to go to sleep (15 minutes of inactivity)
3. OR trigger a redeploy
4. Visit your website again
5. **The count should continue from where it left off!** ✅

---

## 🔧 Troubleshooting

### Issue: "MongoDB not available, using JSON fallback"

**Cause:** MongoDB URI not set or incorrect

**Solution:**
1. Check Render environment variables
2. Verify `MONGODB_URI` is set correctly
3. Make sure you replaced `<password>` with actual password
4. Check for extra spaces or line breaks in the URI

### Issue: "Connection failed: Authentication failed"

**Cause:** Wrong username or password

**Solution:**
1. Go to MongoDB Atlas → Database Access
2. Edit user or create new one
3. Reset password
4. Update `MONGODB_URI` on Render with new password

### Issue: "Connection timeout"

**Cause:** IP not whitelisted

**Solution:**
1. Go to MongoDB Atlas → Network Access
2. Make sure `0.0.0.0/0` is in the list
3. If not, add it as described in Step 4

### Issue: Counter still resetting

**Possible causes:**
1. MongoDB URI not set on Render
2. Connection string has typo
3. Need to wait for Render to redeploy

**Solution:**
1. Check Render logs for MongoDB connection messages
2. Verify environment variable is saved
3. Manually trigger a redeploy if needed

---

## 📊 MongoDB Atlas Dashboard

### View Your Data:

1. Go to MongoDB Atlas dashboard
2. Click **"Browse Collections"** on your cluster
3. You'll see:
   - **Database:** `api_tester`
   - **Collection:** `visitor_stats`
   - **Documents:**
     ```json
     {
       "_id": "...",
       "stat_name": "total_visits",
       "count": 1002,
       "last_updated": "2026-03-18T..."
     }
     ```

### Monitor Usage:

1. Click **"Metrics"** tab
2. See:
   - Connections
   - Operations per second
   - Network traffic
   - Storage used

**Your free tier includes:**
- 512 MB storage (plenty for millions of visits)
- Unlimited reads/writes
- No time limit (free forever!)

---

## 🎯 What Happens Now

### With MongoDB Atlas:

✅ **Visitor count persists forever**
- Survives Render sleep
- Survives deployments
- Survives restarts

✅ **Automatic backups**
- MongoDB Atlas backs up your data
- Can restore if needed

✅ **Scalable**
- Start with free tier
- Upgrade if you need more (unlikely for visitor counter)

✅ **Fast**
- Optimized for quick reads/writes
- Global CDN for low latency

---

## 💡 Pro Tips

### 1. Monitor Your Counter

Check MongoDB Atlas dashboard occasionally to see your visitor growth!

### 2. Backup Connection String

Save your `MONGODB_URI` somewhere safe (password manager, notes app)

### 3. Set Up Alerts (Optional)

MongoDB Atlas can email you if:
- Storage is getting full
- Connection issues occur
- Unusual activity detected

### 4. Upgrade Later (Optional)

If you outgrow the free tier:
- **M2:** $9/month (2GB storage)
- **M5:** $25/month (5GB storage)

But for a visitor counter, **free tier is more than enough!**

---

## 📝 Summary

**Before MongoDB:**
- Counter resets when Render sleeps ❌
- Counter resets on deployment ❌
- Data stored in ephemeral files ❌

**After MongoDB:**
- Counter persists forever ✅
- Survives all restarts ✅
- Professional database storage ✅

**Setup Time:** 10 minutes
**Cost:** $0 (forever free)
**Maintenance:** None required

---

## 🆘 Need Help?

If you encounter any issues:

1. Check Render logs for error messages
2. Verify MongoDB connection string is correct
3. Make sure environment variable is saved
4. Wait for Render to finish redeploying

**Common mistakes:**
- Forgot to replace `<password>` in connection string
- Extra spaces in environment variable
- Didn't wait for Render to redeploy

---

**Made with Bob** 🤖

Your visitor counter will now persist forever! 🎉