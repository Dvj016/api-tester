# Email Setup Guide for Feedback Form

This guide explains how to configure the email functionality for the feedback form so you can receive messages from users.

## Overview

The feedback form uses **Web3Forms** - a free email service that doesn't require a backend server. When users submit the form, their message is sent directly to your email address.

---

## Step-by-Step Setup

### Step 1: Create Web3Forms Account

1. **Go to Web3Forms website**
   - Visit: [https://web3forms.com](https://web3forms.com)

2. **Sign up for free**
   - Click "Get Started" or "Sign Up"
   - Enter your email address (this is where you'll receive feedback)
   - Verify your email address

3. **Free tier includes:**
   - 250 form submissions per month
   - Email notifications
   - Spam filtering
   - No credit card required

### Step 2: Get Your Access Key

1. **Login to Web3Forms dashboard**
   - Go to: [https://web3forms.com/dashboard](https://web3forms.com/dashboard)

2. **Create a new form**
   - Click "Create New Form"
   - Give it a name: "AI API Key Tester Feedback"

3. **Copy your Access Key**
   - You'll see an Access Key like: `a1b2c3d4-e5f6-7890-abcd-ef1234567890`
   - Copy this key (you'll need it in the next step)

4. **Configure email settings** (in Web3Forms dashboard)
   - **To Email**: Your email address (where feedback will be sent)
   - **From Name**: AI API Key Tester
   - **Subject**: AI API Key Tester - Feedback Form
   - **Enable spam filtering**: Yes (recommended)

### Step 3: Update Your Code

1. **Open the feedback form file**
   ```
   frontend/src/app/feedback/page.tsx
   ```

2. **Find line 29** (look for `YOUR_WEB3FORMS_ACCESS_KEY`)

3. **Replace with your actual key**
   
   **Before:**
   ```typescript
   access_key: 'YOUR_WEB3FORMS_ACCESS_KEY',
   ```
   
   **After:**
   ```typescript
   access_key: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', // Your actual key
   ```

4. **Save the file**

### Step 4: Deploy Changes

If you've already deployed:

**For Vercel:**
```bash
cd frontend
vercel --prod
```

**For Netlify:**
```bash
cd frontend
netlify deploy --prod
```

### Step 5: Test the Form

1. **Visit your website**
   - Go to: `https://your-website.com/feedback`

2. **Fill out the form**
   - Enter a test email
   - Write a test message
   - Click "Send Message"

3. **Check your email**
   - You should receive the test message within 1-2 minutes
   - Check spam folder if you don't see it

---

## Email Configuration Details

### What Email Address Receives Feedback?

The email address you configure in the **Web3Forms dashboard** will receive all feedback submissions.

### Email Format

When someone submits feedback, you'll receive an email like this:

```
From: AI API Key Tester (via Web3Forms)
To: your-email@example.com
Subject: AI API Key Tester - Feedback Form

Name: John Doe (or "Anonymous" if not provided)
Email: john@example.com
Message: 
This is the user's feedback message...

---
Sent via Web3Forms
```

### Customizing Email Settings

In the Web3Forms dashboard, you can customize:

1. **Email Template**: Change how emails look
2. **Auto-Reply**: Send automatic confirmation to users
3. **Redirect URL**: Where users go after submission
4. **Spam Protection**: Enable reCAPTCHA or honeypot
5. **Webhooks**: Send data to other services

---

## Alternative Email Services

If you prefer a different service, here are alternatives:

### Option 1: EmailJS

**Pros**: More customization, free tier available
**Cons**: Requires more setup

**Setup:**
1. Sign up at [emailjs.com](https://emailjs.com)
2. Create email service (Gmail, Outlook, etc.)
3. Create email template
4. Get Service ID, Template ID, and Public Key
5. Update code to use EmailJS SDK

### Option 2: Formspree

**Pros**: Simple, reliable
**Cons**: Limited free tier (50 submissions/month)

**Setup:**
1. Sign up at [formspree.io](https://formspree.io)
2. Create new form
3. Get form endpoint URL
4. Update code to POST to Formspree endpoint

### Option 3: Custom Backend Email

**Pros**: Full control
**Cons**: Requires email server setup

**Setup:**
1. Add email library to backend (e.g., `python-email`)
2. Configure SMTP settings
3. Create email endpoint in FastAPI
4. Update frontend to call your endpoint

---

## Security Considerations

### Protecting Your Access Key

**Important**: Your Web3Forms access key is public (visible in frontend code). This is by design and safe because:

1. **Domain Restrictions**: Configure allowed domains in Web3Forms dashboard
2. **Rate Limiting**: Web3Forms has built-in rate limiting
3. **Spam Protection**: Enable spam filtering in dashboard
4. **No Sensitive Data**: The key only allows form submissions, not account access

### Best Practices

1. **Enable domain restrictions** in Web3Forms dashboard
   - Only allow your domain: `your-website.com`
   - Prevents unauthorized use of your key

2. **Enable spam protection**
   - Use honeypot field (invisible to users)
   - Or enable reCAPTCHA

3. **Monitor usage**
   - Check Web3Forms dashboard regularly
   - Watch for unusual activity

4. **Set up notifications**
   - Get alerts for new submissions
   - Monitor monthly quota usage

---

## Troubleshooting

### Form Doesn't Send

**Check:**
1. Access key is correct (no typos)
2. Internet connection is working
3. Browser console for errors (F12)
4. Web3Forms dashboard shows the submission

**Common Issues:**
- **Invalid Access Key**: Double-check you copied it correctly
- **CORS Error**: Shouldn't happen with Web3Forms, but check browser console
- **Network Error**: Check internet connection

### Not Receiving Emails

**Check:**
1. **Spam folder**: Emails might be filtered
2. **Email address**: Verify it's correct in Web3Forms dashboard
3. **Web3Forms status**: Check if service is operational
4. **Email provider**: Some providers block automated emails

**Solutions:**
- Add `noreply@web3forms.com` to contacts
- Check email provider's spam settings
- Verify email in Web3Forms dashboard

### Receiving Spam

**Solutions:**
1. **Enable spam filtering** in Web3Forms dashboard
2. **Add reCAPTCHA** to form
3. **Use honeypot field** (invisible spam trap)
4. **Restrict domains** to only your website

---

## Upgrading to Paid Plan

If you exceed 250 submissions/month:

### Web3Forms Pro Plan

**Cost**: $9/month

**Features:**
- 1,000 submissions/month
- Priority support
- Custom branding
- Advanced spam protection
- Webhooks
- File uploads

**When to upgrade:**
- High traffic website
- Need more than 250 submissions/month
- Want advanced features

---

## Testing Checklist

Before going live, test:

- [ ] Form loads correctly
- [ ] All fields work (name, email, message)
- [ ] Validation works (email format, required fields)
- [ ] Submit button shows loading state
- [ ] Success message appears after submission
- [ ] Email arrives in your inbox
- [ ] Email contains correct information
- [ ] Spam protection works (if enabled)
- [ ] Mobile responsive

---

## FAQ

### Q: Is my email address visible to users?

**A**: No, your email address is configured in Web3Forms dashboard and is not visible in the frontend code.

### Q: Can users see my Access Key?

**A**: Yes, it's in the frontend code, but this is safe. The key only allows form submissions and you can restrict it to your domain.

### Q: How many emails can I receive?

**A**: Free tier: 250/month. Pro tier: 1,000/month.

### Q: Can I use my own email server?

**A**: Yes, but you'll need to create a backend endpoint. Web3Forms is easier for most use cases.

### Q: What if I want to store submissions in a database?

**A**: Use Web3Forms webhooks to send data to your backend, then store in database.

### Q: Can I customize the email template?

**A**: Yes, in the Web3Forms dashboard under "Email Template" settings.

---

## Support

### Web3Forms Support

- **Documentation**: [https://docs.web3forms.com](https://docs.web3forms.com)
- **Email**: support@web3forms.com
- **Discord**: Join their community

### Project Support

- **Feedback Form**: Use the form on your website
- **Creator**: Digvijay Singh Baghel

---

## Summary

**Quick Setup (5 minutes):**

1. Sign up at [web3forms.com](https://web3forms.com) ✅
2. Get your Access Key ✅
3. Replace `YOUR_WEB3FORMS_ACCESS_KEY` in code ✅
4. Deploy changes ✅
5. Test the form ✅

**Your email address** (configured in Web3Forms dashboard) will receive all feedback submissions.

---

**Last Updated**: March 14, 2026
**Created by**: Digvijay Singh Baghel