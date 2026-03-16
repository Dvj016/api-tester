# Custom Domain Setup Guide

## Overview
Yes! You can customize your URL. Here's everything you need to know about free and paid options.

## Option 1: Free Custom Subdomain (Vercel)

### What You Get
- Change from: `api-tester-taupe.vercel.app`
- To something like: `my-api-tester.vercel.app`

### How to Do It (100% FREE)

1. **Go to Vercel Dashboard:**
   - Visit: https://vercel.com/dashboard
   - Click on your project

2. **Go to Settings:**
   - Click "Settings" tab
   - Click "Domains" in sidebar

3. **Change Project Name:**
   - Go to "General" settings
   - Find "Project Name"
   - Change to something better like:
     - `ai-api-tester`
     - `api-key-checker`
     - `test-api-keys`
   
4. **Your New URL:**
   - Will be: `your-project-name.vercel.app`
   - Example: `ai-api-tester.vercel.app`

**Cost:** FREE ✅

**Limitations:**
- Must end with `.vercel.app`
- Can't remove Vercel branding

## Option 2: Custom Domain (Your Own Domain)

### What You Get
- Professional URL like:
  - `apitester.dev`
  - `testmyapikey.com`
  - `aikeychecker.io`

### Cost Breakdown

**Domain Registration (Annual):**
- `.com` - $10-15/year
- `.dev` - $12-15/year
- `.io` - $30-40/year
- `.app` - $12-15/year
- `.xyz` - $1-3/year (cheapest!)
- `.tech` - $5-10/year

**Hosting:** FREE (Vercel includes free SSL and hosting)

**Total Cost:** $1-40/year (just the domain)

### Where to Buy Domains (Cheapest Options)

1. **Namecheap** (Recommended)
   - Website: https://www.namecheap.com
   - Cheapest prices
   - Easy to use
   - Free WHOIS privacy
   - Example: `.xyz` for $1/year

2. **Porkbun**
   - Website: https://porkbun.com
   - Very cheap
   - No hidden fees
   - Free SSL included

3. **Cloudflare**
   - Website: https://www.cloudflare.com/products/registrar/
   - At-cost pricing (no markup)
   - Best for `.com` domains

4. **Google Domains** (Now Squarespace)
   - Website: https://domains.google
   - Simple interface
   - Slightly more expensive

### Recommended Domains for Your Project

**Best Value:**
- `apitester.xyz` - ~$1/year
- `aikeytester.xyz` - ~$1/year
- `testmykeys.xyz` - ~$1/year

**Professional:**
- `apitester.dev` - ~$12/year
- `aikeytester.com` - ~$12/year
- `testmyapikey.com` - ~$12/year

**Premium:**
- `apitester.io` - ~$35/year
- `aikeys.io` - ~$35/year

## How to Connect Custom Domain to Vercel (FREE)

### Step 1: Buy Domain
1. Go to Namecheap/Porkbun
2. Search for your desired domain
3. Purchase (usually $1-15/year)
4. Complete registration

### Step 2: Add Domain to Vercel

1. **Go to Vercel Dashboard:**
   - https://vercel.com/dashboard
   - Click your project

2. **Add Domain:**
   - Click "Settings" → "Domains"
   - Click "Add Domain"
   - Enter your domain (e.g., `apitester.xyz`)
   - Click "Add"

3. **Vercel will show DNS records:**
   ```
   Type: A
   Name: @
   Value: 76.76.21.21

   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```

### Step 3: Configure DNS

1. **Go to your domain registrar:**
   - Namecheap: Dashboard → Domain List → Manage
   - Porkbun: Dashboard → Domain → DNS

2. **Add DNS Records:**
   
   **For Root Domain (apitester.xyz):**
   ```
   Type: A
   Name: @
   Value: 76.76.21.21
   TTL: Automatic
   ```

   **For WWW (www.apitester.xyz):**
   ```
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   TTL: Automatic
   ```

3. **Save Changes**

### Step 4: Wait for Propagation

- DNS changes take 5 minutes to 48 hours
- Usually works within 15-30 minutes
- Vercel will auto-issue SSL certificate

### Step 5: Verify

1. Visit your domain: `https://yourdomain.com`
2. Should redirect to your site
3. SSL certificate should be active (🔒 in browser)

## After Adding Custom Domain

### Update Backend CORS

1. **Go to Render Dashboard:**
   - https://dashboard.render.com
   - Click your backend service

2. **Update Environment Variable:**
   - Click "Environment"
   - Find `ALLOWED_ORIGINS`
   - Add your new domain:
   ```
   https://api-tester-taupe.vercel.app,https://yourdomain.com
   ```

3. **Save and Redeploy**

### Update Frontend Environment Variable

1. **Go to Vercel Dashboard:**
   - Click your project
   - Settings → Environment Variables

2. **Verify `NEXT_PUBLIC_API_URL`:**
   - Should be: `https://ai-api-key-tester-backend.onrender.com`
   - No changes needed

## Comparison: Free vs Custom Domain

### Free Vercel Subdomain
**Pros:**
- ✅ Completely free
- ✅ Instant setup
- ✅ SSL included
- ✅ No maintenance

**Cons:**
- ❌ Ends with `.vercel.app`
- ❌ Less professional
- ❌ Harder to remember
- ❌ Can't customize fully

**Best for:**
- Testing
- Personal projects
- MVP/prototype
- Learning

### Custom Domain
**Pros:**
- ✅ Professional appearance
- ✅ Easy to remember
- ✅ Better for marketing
- ✅ Better SEO
- ✅ Builds brand
- ✅ Can sell later

**Cons:**
- ❌ Costs $1-40/year
- ❌ Requires DNS setup
- ❌ Annual renewal needed

**Best for:**
- Public tools
- Marketing
- Building brand
- Long-term projects

## My Recommendation

### For Now (Free)
1. **Rename Vercel project** to something better:
   - `ai-api-tester.vercel.app`
   - `api-key-tester.vercel.app`
   
2. **Start marketing** with this URL

3. **Track visitors** and see if people use it

### If It Gets Popular (Paid)
1. **Buy a cheap domain:**
   - `apitester.xyz` for $1/year
   - Or `apitester.dev` for $12/year

2. **Connect to Vercel** (takes 30 minutes)

3. **Update marketing** with new domain

## Step-by-Step: Rename Vercel Project (FREE)

1. Go to: https://vercel.com/dashboard
2. Click your project
3. Click "Settings"
4. Scroll to "Project Name"
5. Change to: `ai-api-tester` (or your choice)
6. Click "Save"
7. Your new URL: `ai-api-tester.vercel.app`

**Time:** 2 minutes
**Cost:** FREE
**Difficulty:** Very Easy

## Domain Name Ideas (Available to Check)

**Short & Catchy:**
- `apitester.xyz` - $1/year
- `keytest.xyz` - $1/year
- `testkeys.xyz` - $1/year

**Descriptive:**
- `aikeytester.com` - $12/year
- `testmyapikey.com` - $12/year
- `apikeyvalidator.com` - $12/year

**Developer Focused:**
- `apitester.dev` - $12/year
- `devtools.xyz` - $1/year
- `apitools.xyz` - $1/year

## Quick Decision Guide

**Choose FREE if:**
- Just starting out
- Testing the idea
- No budget
- Learning project

**Choose CUSTOM DOMAIN if:**
- Serious about the project
- Want to build a brand
- Planning to monetize
- Want professional image

## Summary

**Cheapest Option:**
- Rename Vercel project → FREE
- URL: `your-name.vercel.app`

**Best Value:**
- Buy `.xyz` domain → $1/year
- Connect to Vercel → FREE
- URL: `yourdomain.xyz`

**Most Professional:**
- Buy `.com` or `.dev` → $12/year
- Connect to Vercel → FREE
- URL: `yourdomain.com`

**My Suggestion:**
1. Start with free Vercel subdomain
2. If you get 100+ daily visitors, buy custom domain
3. Use the $1/year `.xyz` option to test
4. Upgrade to `.com` if it becomes popular

---

**Next Step:** Rename your Vercel project to get a better free URL, then start marketing!