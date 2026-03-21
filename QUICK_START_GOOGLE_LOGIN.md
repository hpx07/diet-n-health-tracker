# Quick Start: Google Login Setup

## 5-Minute Setup

### 1. Get Google Client ID

1. Go to: https://console.cloud.google.com/
2. Create new project: **"Diet-N-Health-Tracker"**
3. Go to: **APIs & Services** → **Credentials**
4. Click: **Create Credentials** → **OAuth client ID**
5. Choose: **Web application**
6. Add authorized origins: `http://localhost:3000`
7. Click **Create**
8. Copy the **Client ID** (looks like: `123456-abc.apps.googleusercontent.com`)

### 2. Configure OAuth Consent Screen

1. Go to: **APIs & Services** → **OAuth consent screen**
2. Choose: **External**
3. Fill in:
   - App name: `Diet-N-Health Tracker`
   - User support email: Your email
   - Developer email: Your email
4. Click **Save and Continue** through all steps
5. Add yourself as a test user

### 3. Update Your App

1. Open `.env` file in project root
2. Replace this line:
```env
REACT_APP_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
```

With your actual Client ID:
```env
REACT_APP_GOOGLE_CLIENT_ID=123456-abc.apps.googleusercontent.com
```

3. Save the file

### 4. Restart Server

```bash
# Stop current server (Ctrl+C)
npm start
```

### 5. Test Login

1. Open: http://localhost:3000
2. Click the Google Sign-In button
3. Select your account
4. Done! ✅

---

## Verify Configuration

Run this command to check your setup:

```bash
node scripts/check-google-auth.js
```

---

## Common Issues

### "Google login not configured" message
- Check `.env` file has correct Client ID
- Restart the server after updating `.env`

### "redirect_uri_mismatch" error
- Add `http://localhost:3000` to authorized origins in Google Console
- No trailing slash!

### "Access blocked" error
- Add yourself as test user in OAuth consent screen
- Make sure app is in "Testing" mode

---

## Don't Want Google Login?

No problem! Click **"Continue Without Login"** - the app works perfectly with local storage only.

---

## Need More Help?

See detailed guide: **GOOGLE_LOGIN_SETUP.md**
