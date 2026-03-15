# 100% FREE Deployment Guide

Complete step-by-step guide to deploy your AI API Key Tester **completely free** with no credit card required.

## 🎉 Total Cost: $0/month

Both frontend and backend can be deployed for free!

---

## Table of Contents

1. [Overview](#overview)
2. [Backend Deployment (Render - Free)](#backend-deployment-render---free)
3. [Frontend Deployment (Vercel - Free)](#frontend-deployment-vercel---free)
4. [Email Setup (Web3Forms - Free)](#email-setup-web3forms---free)
5. [Testing Your Deployment](#testing-your-deployment)
6. [Free Tier Limits](#free-tier-limits)

---

## Overview

### What We'll Use (All Free!)

| Service | Purpose | Free Tier | Credit Card? |
|---------|---------|-----------|--------------|
| **Render** | Backend hosting | 750 hours/month | ❌ No |
| **Vercel** | Frontend hosting | Unlimited | ❌ No |
| **Web3Forms** | Email service | 250 emails/month | ❌ No |
| **CountAPI** | Visitor counter | Unlimited | ❌ No |

### Prerequisites

- GitHub account (free)
- Git installed on your computer
- Your project code ready

---

## Backend Deployment (Render - Free)

Render offers 750 free hours per month (enough for 24/7 operation).

### Step 1: Push Code to GitHub

If you haven't already:

```bash
# Initialize git (if not done)
cd API_Tester
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - AI API Key Tester"

# Create repository on GitHub (go to github.com)
# Then connect and push:
git remote add origin https://github.com/YOUR_USERNAME/ai-api-key-tester.git
git branch -M main
git push -u origin main
```

### Step 2: Sign Up for Render

1. Go to [render.com](https://render.com)
2. Click **"Get Started for Free"**
3. Sign up with GitHub (easiest option)
4. **No credit card required!** ✅

### Step 3: Create Web Service

1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository
3. Select your repository: `ai-api-key-tester`

### Step 4: Configure Service

Fill in these settings:

```
Name: ai-api-key-tester-backend
Region: Oregon (US West) or closest to you
Branch: main
Root Directory: backend
Runtime: Docker
```

**Important Settings:**

```
Build Command: (leave empty - Docker handles it)
Start Command: (leave empty - Docker handles it)
```

### Step 5: Add Environment Variables

Click **"Advanced"** → **"Add Environment Variable"**

Add these:

```
ENVIRONMENT = production
CORS_ORIGINS = https://your-app.vercel.app
LOG_LEVEL = INFO
```

**Note**: You'll update `CORS_ORIGINS` after deploying frontend.

### Step 6: Select Free Plan

- Scroll down to **"Instance Type"**
- Select **"Free"** (750 hours/month)
- Click **"Create Web Service"**

### Step 7: Wait for Deployment

- Render will build your Docker image (takes 5-10 minutes first time)
- Watch the logs for any errors
- When done, you'll see: **"Your service is live 🎉"**

### Step 8: Get Your Backend URL

- Copy your backend URL (looks like: `https://ai-api-key-tester-backend.onrender.com`)
- **Save this URL** - you'll need it for frontend!

### Step 9: Test Backend

Visit: `https://your-backend-url.onrender.com/health`

You should see:
```json
{
  "status": "healthy"
}
```

✅ **Backend deployed successfully!**

---

## Frontend Deployment (Vercel - Free)

Vercel is perfect for Next.js and completely free for personal projects.

### Step 1: Sign Up for Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click **"Start Deploying"**
3. Sign up with GitHub
4. **No credit card required!** ✅

### Step 2: Import Project

1. Click **"Add New..."** → **"Project"**
2. Import your GitHub repository
3. Select `ai-api-key-tester`

### Step 3: Configure Project

Vercel will auto-detect Next.js. Configure:

```
Framework Preset: Next.js
Root Directory: frontend
Build Command: npm run build
Output Directory: .next
Install Command: npm install
```

### Step 4: Add Environment Variable

Click **"Environment Variables"**

Add:
```
Name: NEXT_PUBLIC_API_URL
Value: https://your-backend-url.onrender.com
```

**Replace with your actual Render backend URL!**

### Step 5: Deploy

1. Click **"Deploy"**
2. Wait 2-3 minutes for build
3. You'll get a URL like: `https://ai-api-key-tester.vercel.app`

### Step 6: Update Backend CORS

Now go back to Render:

1. Go to your backend service
2. Click **"Environment"**
3. Update `CORS_ORIGINS`:
   ```
   CORS_ORIGINS = https://ai-api-key-tester.vercel.app
   ```
4. Click **"Save Changes"**
5. Service will automatically redeploy

✅ **Frontend deployed successfully!**

---

## Email Setup (Web3Forms - Free)

### Step 1: Sign Up

1. Go to [web3forms.com](https://web3forms.com)
2. Click **"Get Started"**
3. Enter your email (where you want to receive feedback)
4. Verify your email
5. **No credit card required!** ✅

### Step 2: Create Form

1. Login to dashboard
2. Click **"Create New Form"**
3. Name: "AI API Key Tester Feedback"
4. Copy your **Access Key** (looks like: `a1b2c3d4-e5f6-7890-abcd-ef1234567890`)

### Step 3: Configure Email

In Web3Forms dashboard:
- **To Email**: Your email address
- **From Name**: AI API Key Tester
- **Subject**: Feedback Form Submission
- **Enable Spam Protection**: Yes

### Step 4: Update Code

1. Open `frontend/src/app/feedback/page.tsx`
2. Find line 29: `access_key: 'YOUR_WEB3FORMS_ACCESS_KEY'`
3. Replace with your actual key
4. Save and commit:

```bash
git add frontend/src/app/feedback/page.tsx
git commit -m "Add Web3Forms access key"
git push
```

### Step 5: Vercel Auto-Deploy

Vercel will automatically redeploy when you push to GitHub!

✅ **Email setup complete!**

---

## Testing Your Deployment

### Test Backend

1. Visit: `https://your-backend.onrender.com/health`
2. Should see: `{"status": "healthy"}`

### Test Frontend

1. Visit: `https://your-app.vercel.app`
2. Should see your homepage with all 10 providers

### Test API Key Testing

1. Select a provider (e.g., OpenAI)
2. Enter a test API key
3. Select a model
4. Click "Test Key"
5. Should get a response (valid or invalid)

### Test Feedback Form

1. Go to: `https://your-app.vercel.app/feedback`
2. Fill out the form
3. Submit
4. Check your email inbox (and spam folder)

### Test Visitor Counter

1. Refresh homepage a few times
2. Counter should increment
3. Shows in footer: "👥 Visitors: X"

---

## Free Tier Limits

### Render (Backend)

**Free Tier Includes:**
- ✅ 750 hours/month (enough for 24/7)
- ✅ 512 MB RAM
- ✅ 0.1 CPU
- ✅ Automatic HTTPS
- ✅ Custom domains

**Limitations:**
- ⚠️ Spins down after 15 minutes of inactivity
- ⚠️ Cold start takes 30-60 seconds
- ⚠️ Limited to 100 GB bandwidth/month

**What This Means:**
- First request after inactivity will be slow (30-60s)
- Subsequent requests are fast
- Perfect for low-traffic sites
- Upgrade to paid ($7/month) for always-on

### Vercel (Frontend)

**Free Tier Includes:**
- ✅ Unlimited deployments
- ✅ 100 GB bandwidth/month
- ✅ Automatic HTTPS
- ✅ Custom domains
- ✅ Global CDN
- ✅ Always on (no cold starts!)

**Limitations:**
- ⚠️ 100 GB bandwidth/month
- ⚠️ 6,000 build minutes/month

**What This Means:**
- More than enough for most projects
- Frontend is always fast
- No cold starts

### Web3Forms (Email)

**Free Tier Includes:**
- ✅ 250 submissions/month
- ✅ Email notifications
- ✅ Spam filtering
- ✅ No branding

**Limitations:**
- ⚠️ 250 submissions/month

**What This Means:**
- ~8 feedback submissions per day
- Upgrade to $9/month for 1,000/month

### CountAPI (Visitor Counter)

**Free Tier Includes:**
- ✅ Unlimited requests
- ✅ No registration
- ✅ Forever free

**Limitations:**
- None! Completely free forever

---

## Handling Cold Starts (Render)

Since Render free tier spins down after 15 minutes, here are solutions:

### Option 1: Accept It (Recommended for Start)

- First visitor waits 30-60 seconds
- Subsequent visitors get instant response
- Completely free
- Good for low-traffic sites

### Option 2: Keep-Alive Service (Free)

Use a free service to ping your backend every 14 minutes:

**UptimeRobot** (free):
1. Sign up at [uptimerobot.com](https://uptimerobot.com)
2. Add monitor: `https://your-backend.onrender.com/health`
3. Check interval: 5 minutes
4. Keeps your backend awake!

**Cron-Job.org** (free):
1. Sign up at [cron-job.org](https://cron-job.org)
2. Create job: `https://your-backend.onrender.com/health`
3. Schedule: Every 14 minutes
4. Keeps your backend awake!

### Option 3: Upgrade to Paid ($7/month)

- Always on, no cold starts
- More RAM and CPU
- Better for high-traffic sites

---

## Custom Domain (Optional, Free)

Both Render and Vercel support custom domains for free!

### For Frontend (Vercel)

1. Buy domain (e.g., Namecheap, ~$10/year)
2. In Vercel dashboard: Settings → Domains
3. Add your domain
4. Update DNS records (Vercel provides instructions)
5. Wait for DNS propagation (5-60 minutes)

### For Backend (Render)

1. In Render dashboard: Settings → Custom Domain
2. Add your domain (e.g., api.yourdomain.com)
3. Update DNS records
4. Free SSL certificate included!

---

## Monitoring (Free)

### UptimeRobot (Free)

Monitor uptime and get alerts:

1. Sign up at [uptimerobot.com](https://uptimerobot.com)
2. Add monitors:
   - Frontend: `https://your-app.vercel.app`
   - Backend: `https://your-backend.onrender.com/health`
3. Get email alerts if site goes down
4. Free tier: 50 monitors, 5-minute checks

---

## Troubleshooting

### Backend Not Responding

**Symptom**: 502 Bad Gateway or timeout

**Solutions:**
1. Check Render logs for errors
2. Verify Docker build succeeded
3. Check environment variables
4. Wait for cold start (30-60s)

### Frontend Can't Connect to Backend

**Symptom**: CORS errors in browser console

**Solutions:**
1. Verify `NEXT_PUBLIC_API_URL` in Vercel
2. Verify `CORS_ORIGINS` in Render
3. Make sure URLs match exactly
4. Redeploy both services

### Email Not Working

**Symptom**: Form submits but no email

**Solutions:**
1. Check Web3Forms access key
2. Verify email in Web3Forms dashboard
3. Check spam folder
4. Test Web3Forms directly

---

## Cost Breakdown

### Current Setup (Free)

| Service | Cost | Limits |
|---------|------|--------|
| Render | $0 | 750 hrs/month, cold starts |
| Vercel | $0 | 100 GB bandwidth |
| Web3Forms | $0 | 250 emails/month |
| CountAPI | $0 | Unlimited |
| **Total** | **$0/month** | ✅ |

### If You Outgrow Free Tier

| Service | Upgrade Cost | Benefits |
|---------|--------------|----------|
| Render | $7/month | Always on, no cold starts |
| Vercel | $20/month | 1 TB bandwidth |
| Web3Forms | $9/month | 1,000 emails/month |
| **Total** | **$36/month** | For high traffic |

---

## When to Upgrade

Upgrade when you see:

1. **Backend**: 
   - Cold starts annoying users
   - High traffic (>10,000 requests/month)
   - Need faster response times

2. **Frontend**:
   - Exceeding 100 GB bandwidth
   - Need team collaboration features

3. **Email**:
   - Receiving >250 feedback/month
   - Need advanced features

---

## Summary

✅ **You can run this completely free!**

**Free Forever:**
- Backend: Render (with cold starts)
- Frontend: Vercel (always fast)
- Email: Web3Forms (250/month)
- Visitor Counter: CountAPI (unlimited)

**Total Cost: $0/month**

**Perfect for:**
- Testing your idea
- Low to medium traffic
- Personal projects
- Portfolio pieces

**Upgrade later when:**
- You have consistent traffic
- Cold starts become an issue
- You need more resources

---

## Next Steps

1. ✅ Deploy backend to Render
2. ✅ Deploy frontend to Vercel
3. ✅ Setup Web3Forms email
4. ✅ Test everything works
5. ✅ Share your website!
6. 📊 Monitor visitor counter
7. 📈 Upgrade when needed

---

**Questions?** Use the feedback form on your deployed website!

**Created by**: Digvijay Singh Baghel
**Last Updated**: March 15, 2026