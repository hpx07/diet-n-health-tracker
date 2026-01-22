# Complete Setup Guide

## Quick Start (5 minutes)

### Option 1: Guest Mode (No Configuration Required)
1. `npm install`
2. `npm start`
3. Click "Continue Without Login"
4. Complete your profile
5. Start tracking!

**Note**: Guest mode stores data locally on your device only.

---

## Full Setup with Online Sync (15 minutes)

### Step 1: Supabase Setup

1. **Create Supabase Account**
   - Go to [supabase.com](https://supabase.com)
   - Sign up for free account
   - Create a new project

2. **Setup Database**
   - Go to SQL Editor in Supabase dashboard
   - Copy contents of `database/supabase-schema.sql`
   - Paste and run the SQL
   - Verify tables are created in Table Editor

3. **Get Credentials**
   - Go to Project Settings → API
   - Copy "Project URL" (REACT_APP_SUPABASE_URL)
   - Copy "anon public" key (REACT_APP_SUPABASE_ANON_KEY)

4. **Configure Row Level Security (Optional but Recommended)**
   ```sql
   -- Enable RLS on all tables
   ALTER TABLE user_profile ENABLE ROW LEVEL SECURITY;
   ALTER TABLE diet_entries ENABLE ROW LEVEL SECURITY;
   ALTER TABLE test_reports ENABLE ROW LEVEL SECURITY;
   ALTER TABLE health_goals ENABLE ROW LEVEL SECURITY;
   ALTER TABLE daily_checklists ENABLE ROW LEVEL SECURITY;

   -- Create policies (example for user_profile)
   CREATE POLICY "Users can view own profile"
     ON user_profile FOR SELECT
     USING (auth.uid()::text = userId);

   CREATE POLICY "Users can insert own profile"
     ON user_profile FOR INSERT
     WITH CHECK (auth.uid()::text = userId);

   CREATE POLICY "Users can update own profile"
     ON user_profile FOR UPDATE
     USING (auth.uid()::text = userId);
   ```

### Step 2: Google OAuth Setup

1. **Create Google Cloud Project**
   - Go to [console.cloud.google.com](https://console.cloud.google.com)
   - Create new project or select existing
   - Enable "Google+ API"

2. **Configure OAuth Consent Screen**
   - Go to "OAuth consent screen"
   - Choose "External" user type
   - Fill in app name: "Diet-n-Health Tracker"
   - Add your email as developer contact
   - Save and continue

3. **Create OAuth Credentials**
   - Go to "Credentials"
   - Click "Create Credentials" → "OAuth client ID"
   - Application type: "Web application"
   - Name: "Diet-n-Health Tracker Web"
   - Authorized JavaScript origins:
     - `http://localhost:3000` (development)
     - Your production URL (e.g., `https://yourdomain.com`)
   - Authorized redirect URIs:
     - `http://localhost:3000` (development)
     - Your production URL
   - Click "Create"
   - Copy the "Client ID" (REACT_APP_GOOGLE_CLIENT_ID)

### Step 3: Environment Configuration

1. **Create Environment File**
   ```bash
   cp .env.example .env
   ```

2. **Edit .env File**
   ```env
   REACT_APP_SUPABASE_URL=https://your-project.supabase.co
   REACT_APP_SUPABASE_ANON_KEY=your-anon-key-here
   REACT_APP_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
   ```

3. **Verify Configuration**
   - All values should be filled
   - No quotes around values
   - No trailing spaces

### Step 4: Install and Run

```bash
# Install dependencies
npm install

# Start development server
npm start
```

The app will open at `http://localhost:3000`

---

## Testing the Setup

### Test Offline Mode
1. Open app in browser
2. Open DevTools → Network tab
3. Set to "Offline"
4. Add diet entry or test report
5. Data should save locally
6. Set back to "Online"
7. Data should sync automatically

### Test Google Login
1. Click "Sign in with Google"
2. Select your Google account
3. Grant permissions
4. Should redirect to dashboard
5. Your name should appear in header

### Test Data Sync
1. Login with Google
2. Add some data (diet entry, test report)
3. Open Supabase dashboard
4. Check tables for your data
5. Open app in incognito/different browser
6. Login with same Google account
7. Data should appear

---

## Production Deployment

### Vercel Deployment

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin your-repo-url
   git push -u origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Add environment variables:
     - `REACT_APP_SUPABASE_URL`
     - `REACT_APP_SUPABASE_ANON_KEY`
     - `REACT_APP_GOOGLE_CLIENT_ID`
   - Click "Deploy"

3. **Update Google OAuth**
   - Add Vercel URL to authorized origins
   - Add Vercel URL to redirect URIs

### Netlify Deployment

1. **Build the App**
   ```bash
   npm run build
   ```

2. **Deploy to Netlify**
   - Go to [netlify.com](https://netlify.com)
   - Drag & drop `build` folder
   - Or connect GitHub repo

3. **Configure Environment**
   - Go to Site settings → Build & deploy → Environment
   - Add environment variables
   - Trigger redeploy

---

## Troubleshooting

### "Supabase client not configured"
- Check `.env` file exists
- Verify environment variables are set
- Restart development server after changing `.env`

### Google Login Not Working
- Verify Client ID is correct
- Check authorized origins include your URL
- Clear browser cache
- Check browser console for errors

### Data Not Syncing
- Check internet connection
- Verify Supabase credentials
- Check Supabase dashboard for errors
- Look at browser console for sync errors

### Build Errors
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear React cache
rm -rf .cache
```

---

## Optional: MySQL Setup

If you prefer MySQL over Supabase:

1. **Install MySQL**
   ```bash
   # macOS
   brew install mysql
   
   # Ubuntu
   sudo apt-get install mysql-server
   ```

2. **Create Database**
   ```bash
   mysql -u root -p
   CREATE DATABASE diet_health_tracker;
   exit
   ```

3. **Import Schema**
   ```bash
   mysql -u root -p diet_health_tracker < database/mysql-schema.sql
   ```

4. **Update Storage Service**
   - Modify `src/utils/storage.js`
   - Replace Supabase client with MySQL client
   - Update connection configuration

---

## Security Checklist

- [ ] Environment variables configured
- [ ] `.env` added to `.gitignore`
- [ ] Row Level Security enabled in Supabase
- [ ] Google OAuth restricted to your domains
- [ ] HTTPS enabled in production
- [ ] API rate limiting configured
- [ ] Input validation implemented
- [ ] XSS protection enabled

---

## Next Steps

1. Complete your user profile
2. Add your first diet entry
3. Record a test result
4. Set a health goal
5. Create a daily checklist
6. View your reports

Enjoy tracking your health journey! 🎯
