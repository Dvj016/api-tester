# Production Deployment Guide

Complete guide for deploying AI API Key Tester to production.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Backend Deployment](#backend-deployment)
3. [Frontend Deployment](#frontend-deployment)
4. [Environment Configuration](#environment-configuration)
5. [Email Setup](#email-setup)
6. [Security Checklist](#security-checklist)
7. [Monitoring & Maintenance](#monitoring--maintenance)
8. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Accounts

- **Backend Hosting**: Railway, Render, or DigitalOcean
- **Frontend Hosting**: Vercel (recommended) or Netlify
- **Email Service**: Web3Forms account (free tier available) - See [EMAIL_SETUP.md](EMAIL_SETUP.md)
- **Domain** (optional): Custom domain for professional appearance

### Required Tools

- Git
- Docker (for backend deployment)
- Node.js 18+ (for local testing)
- Python 3.11+ (for local testing)

---

## Backend Deployment

### Option 1: Deploy to Railway (Recommended)

Railway provides easy Docker deployment with automatic HTTPS.

#### Steps:

1. **Create Railway Account**
   - Go to [railway.app](https://railway.app)
   - Sign up with GitHub

2. **Create New Project**
   ```bash
   # Install Railway CLI
   npm install -g @railway/cli
   
   # Login
   railway login
   
   # Initialize project
   cd backend
   railway init
   ```

3. **Configure Environment Variables**
   
   In Railway dashboard, add these variables:
   ```
   ENVIRONMENT=production
   CORS_ORIGINS=https://your-frontend-domain.vercel.app
   LOG_LEVEL=INFO
   ```

4. **Deploy**
   ```bash
   railway up
   ```

5. **Get Backend URL**
   - Railway will provide a URL like: `https://your-app.railway.app`
   - Note this URL for frontend configuration

#### Railway Configuration File

Create `railway.toml` in backend directory:
```toml
[build]
builder = "DOCKERFILE"
dockerfilePath = "Dockerfile"

[deploy]
startCommand = "uvicorn app.main:app --host 0.0.0.0 --port $PORT"
healthcheckPath = "/health"
healthcheckTimeout = 100
restartPolicyType = "ON_FAILURE"
restartPolicyMaxRetries = 10
```

### Option 2: Deploy to Render

1. **Create Render Account**
   - Go to [render.com](https://render.com)
   - Sign up with GitHub

2. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the `backend` directory

3. **Configure Service**
   ```
   Name: ai-api-key-tester-backend
   Environment: Docker
   Region: Choose closest to your users
   Branch: main
   Root Directory: backend
   ```

4. **Add Environment Variables**
   ```
   ENVIRONMENT=production
   CORS_ORIGINS=https://your-frontend-domain.vercel.app
   LOG_LEVEL=INFO
   ```

5. **Deploy**
   - Click "Create Web Service"
   - Render will build and deploy automatically

---

## Frontend Deployment

### Deploy to Vercel (Recommended)

Vercel is optimized for Next.js applications.

#### Steps:

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Configure Environment Variables**
   
   Create `.env.production` in frontend directory:
   ```env
   NEXT_PUBLIC_API_URL=https://your-backend-url.railway.app
   ```

4. **Deploy**
   ```bash
   cd frontend
   vercel --prod
   ```

5. **Configure in Vercel Dashboard**
   - Go to [vercel.com/dashboard](https://vercel.com/dashboard)
   - Select your project
   - Go to Settings → Environment Variables
   - Add: `NEXT_PUBLIC_API_URL` = `https://your-backend-url.railway.app`

6. **Setup Custom Domain** (Optional)
   - Go to Settings → Domains
   - Add your custom domain
   - Follow DNS configuration instructions

---

## Environment Configuration

### Backend Environment Variables

Required variables for production:

```env
# Environment
ENVIRONMENT=production

# CORS - Add your frontend domain
CORS_ORIGINS=https://your-frontend-domain.vercel.app,https://www.your-domain.com

# Logging
LOG_LEVEL=INFO

# Optional: Custom port (if not using default 8000)
PORT=8000
```

### Frontend Environment Variables

Required variables for production:

```env
# Backend API URL
NEXT_PUBLIC_API_URL=https://your-backend-url.railway.app
```

---

## Email Setup

### Configure Feedback Form Email

The feedback form needs to be configured to send emails to your address.

**See detailed guide**: [EMAIL_SETUP.md](EMAIL_SETUP.md)

**Quick Summary:**

1. **Sign up at [web3forms.com](https://web3forms.com)**
   - Use the email address where you want to receive feedback
   - Free tier: 250 submissions/month

2. **Get your Access Key**
   - Login to Web3Forms dashboard
   - Create a new form: "AI API Key Tester Feedback"
   - Copy your Access Key (looks like: `a1b2c3d4-e5f6-7890-abcd-ef1234567890`)

3. **Configure destination email**
   - In Web3Forms dashboard, set "To Email" to your email address
   - This is where all feedback will be sent

4. **Update the code**
   - Open `frontend/src/app/feedback/page.tsx`
   - Find line 29: `access_key: 'YOUR_WEB3FORMS_ACCESS_KEY'`
   - Replace with your actual key: `access_key: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'`

5. **Deploy changes**
   ```bash
   cd frontend
   vercel --prod
   ```

6. **Test**
   - Visit your website's feedback page
   - Submit a test message
   - Check your email inbox (and spam folder)

**Important**: The email address you configure in Web3Forms dashboard is where ALL feedback will be sent. Users won't see this email address.

---

## Security Checklist

### Pre-Deployment Security

- [ ] **API Keys**: Never commit API keys to Git
- [ ] **Environment Variables**: All secrets in environment variables
- [ ] **CORS**: Configure proper CORS origins (no wildcards in production)
- [ ] **Rate Limiting**: Enabled (10 req/min, 100 req/hour)
- [ ] **HTTPS**: Ensure both frontend and backend use HTTPS
- [ ] **Input Validation**: All inputs validated on backend
- [ ] **Error Messages**: No sensitive information in error messages
- [ ] **Logging**: API keys masked in logs (only last 4 chars visible)

### Post-Deployment Security

- [ ] **Test Rate Limiting**: Verify rate limits work
- [ ] **Test CORS**: Verify only allowed origins can access API
- [ ] **Monitor Logs**: Check for suspicious activity
- [ ] **SSL Certificate**: Verify HTTPS is working
- [ ] **Email Form**: Test feedback form works and emails arrive

---

## Monitoring & Maintenance

### Health Checks

Both platforms support health checks:

**Backend Health Endpoint**: `https://your-backend-url.railway.app/health`

Expected response:
```json
{
  "status": "healthy"
}
```

### Monitoring Setup

1. **Uptime Monitoring**
   - Use [UptimeRobot](https://uptimerobot.com) (free)
   - Monitor both frontend and backend
   - Set up email alerts

2. **Error Tracking**
   - Consider [Sentry](https://sentry.io) for error tracking
   - Free tier available

### Regular Maintenance

- **Weekly**: Check logs for errors
- **Monthly**: Review rate limit effectiveness
- **Quarterly**: Update dependencies
- **As Needed**: Update AI provider SDKs

---

## Troubleshooting

### Common Issues

#### 1. CORS Errors

**Symptom**: Frontend can't connect to backend

**Solution**:
```python
# In backend/app/config.py, ensure CORS_ORIGINS includes your frontend URL
CORS_ORIGINS = ["https://your-frontend.vercel.app"]
```

#### 2. Email Form Not Working

**Symptom**: Feedback form doesn't send emails

**Solution**:
- Verify Web3Forms access key is correct
- Check that you configured your email in Web3Forms dashboard
- Check browser console for errors
- See [EMAIL_SETUP.md](EMAIL_SETUP.md) for detailed troubleshooting

#### 3. Rate Limiting Too Strict

**Symptom**: Users getting 429 errors frequently

**Solution**:
```python
# In backend/app/main.py, adjust limits
app.add_middleware(
    RateLimitMiddleware,
    requests_per_minute=20,  # Increase from 10
    requests_per_hour=200    # Increase from 100
)
```

---

## Cost Estimates

### Free Tier (Hobby Projects)

- **Railway**: $5/month (500 hours)
- **Vercel**: Free (100GB bandwidth)
- **Web3Forms**: Free (250 submissions/month)
- **Total**: ~$5/month

### Production Tier (High Traffic)

- **Railway**: $20/month (Pro plan)
- **Vercel**: $20/month (Pro plan)
- **Web3Forms**: $9/month (1000 submissions)
- **Total**: ~$49/month

---

## Post-Deployment Checklist

- [ ] Backend deployed and accessible
- [ ] Frontend deployed and accessible
- [ ] Environment variables configured
- [ ] CORS working correctly
- [ ] Rate limiting active
- [ ] HTTPS enabled on both
- [ ] Health checks passing
- [ ] **Email form configured with your email address**
- [ ] **Test email received successfully**
- [ ] Legal pages accessible
- [ ] All 10 providers working
- [ ] Mobile responsive
- [ ] SEO meta tags present
- [ ] Creator credit visible
- [ ] Monitoring setup

---

## Support & Contact

**Creator**: Digvijay Singh Baghel

**Feedback**: Use the feedback form on the website (after configuring email)

**Documentation**:
- [EMAIL_SETUP.md](EMAIL_SETUP.md) - Email configuration guide
- [README.md](README.md) - Project overview

---

**Last Updated**: March 14, 2026