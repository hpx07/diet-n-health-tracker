# Update Database Schema

The database schema has been updated to fix compatibility issues. Follow these steps:

## Option 1: Fresh Setup (Recommended if no data yet)

1. Go to Supabase Dashboard: https://supabase.com/dashboard
2. Go to **SQL Editor**
3. Run this command to drop existing tables:

```sql
-- Drop existing tables
DROP TABLE IF EXISTS daily_checklists CASCADE;
DROP TABLE IF EXISTS health_goals CASCADE;
DROP TABLE IF EXISTS test_reports CASCADE;
DROP TABLE IF EXISTS diet_entries CASCADE;
DROP TABLE IF EXISTS user_profile CASCADE;
```

4. Now run the complete schema from `database/supabase-setup.sql`

## Option 2: If You Have Data (Migrate)

1. Go to Supabase Dashboard → SQL Editor
2. Run this migration script:

```sql
-- Backup existing data (optional)
-- CREATE TABLE diet_entries_backup AS SELECT * FROM diet_entries;

-- Drop and recreate diet_entries with correct schema
DROP TABLE IF EXISTS diet_entries CASCADE;

CREATE TABLE diet_entries (
    id TEXT PRIMARY KEY,
    "userId" TEXT NOT NULL,
    date DATE NOT NULL,
    "mealType" TEXT NOT NULL CHECK("mealType" IN ('breakfast', 'lunch', 'dinner', 'snack')),
    "foodName" TEXT NOT NULL,
    brand TEXT,
    quantity DECIMAL(8,2) NOT NULL,
    nutrition JSONB NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    synced BOOLEAN DEFAULT FALSE
);

CREATE INDEX idx_diet_entries_user_date ON diet_entries("userId", date);
CREATE INDEX idx_diet_entries_date ON diet_entries(date);

-- Enable RLS
ALTER TABLE diet_entries ENABLE ROW LEVEL SECURITY;

-- Create policy
CREATE POLICY "Allow all operations on diet_entries" ON diet_entries
    FOR ALL USING (true) WITH CHECK (true);

-- Grant permissions
GRANT ALL ON diet_entries TO authenticated, anon;
```

3. Repeat for other tables if needed (test_reports, etc.)

## What Changed?

### Before (Old Schema)
```sql
nutrition_calories DECIMAL(8,2),
nutrition_protein DECIMAL(8,2),
nutrition_carbs DECIMAL(8,2),
-- ... separate columns
```

### After (New Schema)
```sql
nutrition JSONB NOT NULL
-- Stores: {"calories": 100, "protein": 5, ...}
```

### Benefits
- ✅ More flexible
- ✅ Easier to add new nutrition fields
- ✅ Better compatibility with app code
- ✅ Smaller database size

## Verify Tables

After running the script, verify in **Table Editor**:

1. Check `diet_entries` table exists
2. Check it has `nutrition` column (type: jsonb)
3. Try adding a diet entry in the app
4. Check if data appears in Supabase

## Test the App

```bash
npm start
```

Try:
1. Search for "milk" or "dal"
2. Add a diet entry
3. Check browser console for errors
4. Verify data in Supabase Dashboard

## Troubleshooting

### "Column does not exist" error
- Run the DROP and CREATE commands again
- Make sure you're in the correct project

### "Permission denied" error
- Check RLS policies are created
- Verify GRANT permissions are set

### Data not syncing
- Check browser console for errors
- Verify `.env` has correct credentials
- Check internet connection

## Success!

Once updated, the app will:
- ✅ Search Indian foods correctly
- ✅ Save nutrition data properly
- ✅ Sync to Supabase without errors
- ✅ Work offline and online seamlessly

---

**Need help?** Check the browser console (F12) for specific error messages.
