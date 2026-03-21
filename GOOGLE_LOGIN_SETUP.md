# Google Login Setup Guide

## Overview
This guide will help you set up Google OAuth authentication for the Diet-n-Health Tracker app.

## Prerequisites
- A Google account
- Access to Google Cloud Console
- Your app running locally or deployed

---

## Step-by-Step Setup

### Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click on the project dropdown at the top
3. Click **"New Project"**
4. Enter project details:
   - **Project name**: `Diet-N-Health-Tracker` (or any name you prefer)
   - **Organization**: Leave as default or select your organization
5. Click **"Create"**
6. Wait for the project to be created (takes a few seconds)

### Step 2: Enable Google+ API (if needed)

1. In the Google Cloud Console, make sure your new project is selected
2. Go to **"APIs & Services"** > **"Library"**
3. Search for **"Google+ API"** or **"People API"**
4. Click on it and click **"Enable"** (if not already enabled)

### Step 3: Configure OAuth Consent Screen

1. Go to **"APIs & Services"** > **"OAuth consent screen"**
2. Select **"External"** (unless you have a Google Workspace account)
3. Click **"Create"**

4. Fill in the required information:
   - **App name**: `Diet-N-Health Tracker`
   - **User support email**: Your email address
   - **App logo**: (Optional) Upload your app logo
   - **Application home page**: Your app URL (e.g., `http://localhost:3000` for local development)
   - **Authorized domains**: 
     - For local: Leave empty or add `localhost`
     - For production: Add your domain (e.g., `yourdomain.com`)
   - **Developer contact information**: Your email address

5. Click **"Save and Continue"**

6. **Scopes** (Step 2):
   - Click **"Add or Remove Scopes"**
   - Select these scopes:
     - `userinfo.email`
     - `userinfo.profile`
     - `openid`
   - Click **"Update"**
   - Click **"Save and Continue"**

7. **Test users** (Step 3):
   - Click **"Add Users"**
   - Add your email address and any other test users
   - Click **"Add"**
   - Click **"Save and Continue"**

8. Review the summary and click **"Back to Dashboard"**

### Step 4: Create OAuth 2.0 Credentials

1. Go to **"APIs & Services"** > **"Credentials"**
2. Click **"Create Credentials"** > **"OAuth client ID"**
3. Select **"Web application"**
4. Fill in the details:
   - **Name**: `Diet-N-Health Web Client`
   - **Authorized JavaScript origins**:
     - For local development: `http://localhost:3000`
     - For production: `https://yourdomain.com`
   - **Authorized redirect URIs**:
     - For local development: `http://localhost:3000`
     - For production: `https://yourdomain.com`

5. Click **"Create"**
6. A popup will show your credentials:
   - **Client ID**: Copy this (looks like: `123456789-abc123.apps.googleusercontent.com`)
   - **Client Secret**: You don't need this for frontend OAuth

### Step 5: Configure Your App

1. Open the `.env` file in your project root
2. Replace the placeholder with your actual Client ID:

```env
REACT_APP_GOOGLE_CLIENT_ID=123456789-abc123.apps.googleusercontent.com
```

3. Save the file

### Step 6: Restart Your Development Server

```bash
# Stop the current server (Ctrl+C)
# Then restart it
npm start
```

**Important**: Environment variables are loaded at build time, so you must restart the server after changing `.env`

### Step 7: Test the Login

1. Open your app in the browser: `http://localhost:3000`
2. You should see the Google Sign-In button
3. Click the button
4. Select your Google account
5. Grant permissions
6. You should be redirected to the dashboard

---

## Troubleshooting

### Issue: "Google login not configured" message

**Solution**: 
- Check that your `.env` file has the correct `REACT_APP_GOOGLE_CLIENT_ID`
- Make sure you restarted the development server after updating `.env`
- Verify the Client ID doesn't have extra spaces or quotes

### Issue: "redirect_uri_mismatch" error

**Solution**:
- Go back to Google Cloud Console > Credentials
- Edit your OAuth client
- Make sure the **Authorized JavaScript origins** and **Authorized redirect URIs** match your app URL exactly
- For local: `http://localhost:3000` (no trailing slash)
- For production: `https://yourdomain.com` (no trailing slash)

### Issue: "Access blocked: This app's request is invalid"

**Solution**:
- Make sure you completed the OAuth consent screen configuration
- Add yourself as a test user in the OAuth consent screen
- If the app is in "Testing" mode, only test users can sign in

### Issue: Login button doesn't appear

**Solution**:
- Open browser console (F12) and check for errors
- Verify the `@react-oauth/google` package is installed: `npm list @react-oauth/google`
- If not installed, run: `npm install @react-oauth/google`

### Issue: "Invalid JWT token" error

**Solution**:
- This usually means the Google response format changed
- Check the browser console for detailed error messages
- Make sure you're using the latest version of `@react-oauth/google`

---

## Production Deployment

When deploying to production:

1. **Update OAuth Client**:
   - Go to Google Cloud Console > Credentials
   - Edit your OAuth client
   - Add your production domain to:
     - Authorized JavaScript origins: `https://yourdomain.com`
     - Authorized redirect URIs: `https://yourdomain.com`

2. **Update Environment Variables**:
   - Set `REACT_APP_GOOGLE_CLIENT_ID` in your hosting platform's environment variables
   - For Vercel: Project Settings > Environment Variables
   - For Netlify: Site Settings > Build & Deploy > Environment
   - For Firebase: Firebase Console > Project Settings > Service Accounts

3. **Publish OAuth Consent Screen** (Optional):
   - If you want anyone to sign in (not just test users)
   - Go to OAuth consent screen
   - Click "Publish App"
   - Note: Google may require verification for certain scopes

---

## Security Best Practices

1. **Never commit `.env` to Git**:
   - The `.env` file is already in `.gitignore`
   - Never share your Client ID publicly (though it's less sensitive than Client Secret)

2. **Use different OAuth clients for development and production**:
   - Create separate OAuth clients for local and production
   - This allows you to restrict origins properly

3. **Regularly review authorized users**:
   - Check Google Cloud Console > OAuth consent screen > Test users
   - Remove users who no longer need access

4. **Monitor usage**:
   - Check Google Cloud Console > APIs & Services > Dashboard
   - Monitor for unusual activity

---

## Alternative: Continue Without Login

If you don't want to set up Google login:

1. The app works perfectly fine without it
2. Click **"Continue Without Login"** on the login screen
3. All data is stored locally on your device
4. You won't have cross-device sync, but all features work

---

## Need Help?

- **Google OAuth Documentation**: https://developers.google.com/identity/protocols/oauth2
- **React OAuth Google Library**: https://www.npmjs.com/package/@react-oauth/google
- **Common OAuth Errors**: https://developers.google.com/identity/protocols/oauth2/web-server#error-codes

---

## Quick Reference

### Required URLs for OAuth Client

**Local Development:**
- JavaScript origins: `http://localhost:3000`
- Redirect URIs: `http://localhost:3000`

**Production:**
- JavaScript origins: `https://yourdomain.com`
- Redirect URIs: `https://yourdomain.com`

### Required Scopes
- `userinfo.email`
- `userinfo.profile`
- `openid`

### Environment Variable Format
```env
REACT_APP_GOOGLE_CLIENT_ID=123456789-abc123def456.apps.googleusercontent.com
```
