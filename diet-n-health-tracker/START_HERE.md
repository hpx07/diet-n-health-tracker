# 🎯 START HERE - Your Diet-n-Health Tracker Setup

Welcome! Your app is almost ready. Follow these simple steps to get started.

## ⚡ Quick Setup (5 minutes)

### Step 1: Get Your Supabase Anon Key

1. Go to: https://supabase.com/dashboard
2. Select your project (oiltiywjyqhvedhearef)
3. Click **Settings** → **API**
4. Copy the **anon public** key (the long string starting with `eyJ...`)

### Step 2: Update Your .env File

Open the `.env` file in the project root and replace this line:

```
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

With your actual key:

```
REACT_APP_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Save the file!**

### Step 3: Create Database Tables

1. Go to Supabase Dashboard: https://supabase.com/dashboard
2. Click **SQL Editor** (left sidebar)
3. Click **New Query**
4. Open the file: `database/supabase-setup.sql`
5. Copy ALL the content
6. Paste into SQL Editor
7. Click **Run** (or press Ctrl/Cmd + Enter)

You should see: ✅ "Database schema created successfully!"

### Step 4: Test Connection (Optional)

```bash
node test-supabase-connection.js
```

This will verify your Supabase connection is working.

### Step 5: Start the App!

```bash
npm start
```

The app will open at http://localhost:3000

## 🎉 That's It!

Your app is now connected to Supabase and ready to use!

### What to Do Next:

1. **Complete Your Profile**
   - Click "Profile" tab
   - Enter your details
   - Get personalized diet plan

2. **Track Your First Meal**
   - Go to "Diet Tracker"
   - Search for food
   - Add to diary

3. **Record a Test Result**
   - Go to "Test Reports"
   - Search for test
   - Enter your values

4. **Set a Goal**
   - Go to "Health Goals"
   - Create your first goal
   - Track progress

## 📱 Features You Can Use Now

✅ **Diet Tracking** - Search 1M+ foods, track nutrition
✅ **Health Tests** - 24+ tests with automatic analysis
✅ **Goals** - Set and track health goals
✅ **Checklists** - Daily task management
✅ **Reports** - Beautiful charts and analytics
✅ **Offline Mode** - Works without internet
✅ **Auto Sync** - Data syncs to cloud automatically

## 🔧 Troubleshooting

### App won't start?
```bash
npm install
npm start
```

### Connection errors?
- Check your anon key in `.env`
- Make sure you ran the SQL script
- Restart the app after changing `.env`

### Tables not found?
- Go to Supabase Dashboard → SQL Editor
- Run `database/supabase-setup.sql` again
- Check Table Editor to verify tables exist

### Data not syncing?
- Check internet connection
- Open browser console (F12) for errors
- Verify `.env` has correct credentials

## 📚 Documentation

- **SUPABASE_SETUP.md** - Detailed Supabase setup
- **QUICK_START.md** - Quick start guide
- **README.md** - Complete documentation
- **FEATURES.md** - All features explained

## 🆘 Need Help?

1. Check browser console (F12) for errors
2. Review SUPABASE_SETUP.md for detailed steps
3. Run test-supabase-connection.js to diagnose
4. Check Supabase Dashboard for logs

## ✅ Setup Checklist

- [ ] Got anon key from Supabase Dashboard
- [ ] Updated `.env` file with anon key
- [ ] Ran SQL script in Supabase SQL Editor
- [ ] Verified tables in Table Editor
- [ ] Ran `npm install`
- [ ] Ran `npm start`
- [ ] App opened in browser
- [ ] Completed profile
- [ ] Added first data entry

## 🚀 Ready to Go!

Once you complete the setup, you'll have a fully functional health tracking app with:
- Cloud sync via Supabase
- Offline support
- Real-time data
- Beautiful charts
- Personalized recommendations

**Start tracking your health journey today!** 💪🥗📊

---

**Your Supabase Project**: https://oiltiywjyqhvedhearef.supabase.co
**Dashboard**: https://supabase.com/dashboard
