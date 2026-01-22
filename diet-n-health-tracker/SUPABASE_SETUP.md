# Supabase Setup Guide

Your Supabase project is already configured! Follow these steps to complete the setup.

## Your Supabase Details

- **Project URL**: `https://oiltiywjyqhvedhearef.supabase.co`
- **Database**: PostgreSQL
- **Status**: Ready to configure

## Step 1: Get Your Anon Key

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project: `oiltiywjyqhvedhearef`
3. Go to **Settings** → **API**
4. Copy the **anon public** key (starts with `eyJ...`)

## Step 2: Update .env File

The `.env` file has been created. You need to add your anon key:

```bash
# Open .env file and replace this line:
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# With your actual anon key:
REACT_APP_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Step 3: Create Database Tables

1. Go to your Supabase Dashboard
2. Click on **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy the entire contents of `database/supabase-setup.sql`
5. Paste into the SQL Editor
6. Click **Run** (or press Ctrl/Cmd + Enter)

You should see: "Database schema created successfully!"

## Step 4: Verify Tables

1. Go to **Table Editor** in the left sidebar
2. You should see these tables:
   - ✅ user_profile
   - ✅ diet_entries
   - ✅ test_reports
   - ✅ health_goals
   - ✅ daily_checklists

## Step 5: Test the Connection

```bash
# Start the app
npm start

# The app should open at http://localhost:3000
# Try adding some data and check if it syncs to Supabase
```

## Step 6: Verify Data Sync

1. Add a diet entry or test report in the app
2. Go to Supabase Dashboard → **Table Editor**
3. Select the relevant table (e.g., `diet_entries`)
4. You should see your data!

## Troubleshooting

### "Invalid API key" error
- Make sure you copied the **anon public** key, not the service role key
- Check for extra spaces in the `.env` file
- Restart the development server after changing `.env`

### Tables not created
- Make sure you ran the entire SQL script
- Check for error messages in the SQL Editor
- Verify you're in the correct project

### Data not syncing
- Check browser console for errors
- Verify internet connection
- Check that `.env` file has correct values
- Restart the app: `npm start`

### "Row Level Security" errors
- The setup script already configures RLS policies
- If you still get errors, you can temporarily disable RLS:
  ```sql
  ALTER TABLE table_name DISABLE ROW LEVEL SECURITY;
  ```

## Security (Optional but Recommended)

For production, you should restrict access based on user authentication:

```sql
-- Example: Restrict users to their own data
DROP POLICY IF EXISTS "Allow all operations on diet_entries" ON diet_entries;

CREATE POLICY "Users can view own diet entries" ON diet_entries
    FOR SELECT USING ("userId" = current_setting('request.jwt.claims')::json->>'email');

CREATE POLICY "Users can insert own diet entries" ON diet_entries
    FOR INSERT WITH CHECK ("userId" = current_setting('request.jwt.claims')::json->>'email');

-- Repeat for other tables
```

## Connection Details

Your app is configured to connect to:
- **URL**: https://oiltiywjyqhvedhearef.supabase.co
- **Database**: PostgreSQL
- **Region**: Auto-detected
- **Connection**: Secure (HTTPS)

## What's Next?

1. ✅ Get anon key from Supabase Dashboard
2. ✅ Update `.env` file with anon key
3. ✅ Run SQL script to create tables
4. ✅ Start the app: `npm start`
5. ✅ Test by adding data
6. ✅ Verify data in Supabase Dashboard

## Need Help?

- Check Supabase Dashboard for error logs
- Review browser console for client-side errors
- Verify all environment variables are set
- Make sure you're using the correct project

## Quick Commands

```bash
# Install dependencies (if not done)
npm install

# Start development server
npm start

# Check for errors
# Open browser console (F12)
# Look for Supabase connection messages
```

## Success Checklist

- [ ] Got anon key from Supabase Dashboard
- [ ] Updated `.env` file with anon key
- [ ] Ran SQL script in Supabase SQL Editor
- [ ] Verified tables created in Table Editor
- [ ] Started the app with `npm start`
- [ ] Tested adding data (diet entry, test report, etc.)
- [ ] Verified data appears in Supabase Dashboard
- [ ] App works offline and syncs when online

Once all items are checked, you're ready to use the app! 🎉

---

**Important**: Never commit your `.env` file to version control. It's already in `.gitignore`.
