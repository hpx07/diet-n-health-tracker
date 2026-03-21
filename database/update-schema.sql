-- Quick Database Schema Update
-- Run this in Supabase SQL Editor to fix the schema

-- Step 1: Drop existing tables (WARNING: This will delete all data!)
DROP TABLE IF EXISTS daily_checklists CASCADE;
DROP TABLE IF EXISTS health_goals CASCADE;
DROP TABLE IF EXISTS test_reports CASCADE;
DROP TABLE IF EXISTS diet_entries CASCADE;
DROP TABLE IF EXISTS user_profile CASCADE;

-- Step 2: Create tables with correct schema

-- User Profile Table
CREATE TABLE user_profile (
    id TEXT PRIMARY KEY,
    "userId" TEXT NOT NULL,
    name TEXT NOT NULL,
    age INTEGER NOT NULL,
    gender TEXT NOT NULL CHECK(gender IN ('male', 'female')),
    height DECIMAL(5,2) NOT NULL,
    weight DECIMAL(5,2) NOT NULL,
    "activityLevel" TEXT NOT NULL CHECK("activityLevel" IN ('sedentary', 'light', 'moderate', 'active', 'veryActive')),
    goal TEXT NOT NULL CHECK(goal IN ('lose', 'maintain', 'gain')),
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    synced BOOLEAN DEFAULT FALSE,
    UNIQUE("userId")
);

-- Diet Entries Table (FIXED: nutrition as JSONB)
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

-- Test Reports Table (FIXED: normalRange as JSONB)
CREATE TABLE test_reports (
    id TEXT PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "testId" TEXT NOT NULL,
    "testName" TEXT NOT NULL,
    category TEXT NOT NULL,
    value DECIMAL(10,2) NOT NULL,
    unit TEXT NOT NULL,
    date DATE NOT NULL,
    status TEXT NOT NULL CHECK(status IN ('normal', 'low', 'high')),
    message TEXT NOT NULL,
    "normalRange" JSONB,
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    synced BOOLEAN DEFAULT FALSE
);

-- Health Goals Table
CREATE TABLE health_goals (
    id TEXT PRIMARY KEY,
    "userId" TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL CHECK(category IN ('weight', 'fitness', 'nutrition', 'health', 'habit')),
    "targetValue" DECIMAL(10,2) NOT NULL,
    "currentValue" DECIMAL(10,2) NOT NULL,
    unit TEXT NOT NULL,
    "targetDate" DATE NOT NULL,
    progress DECIMAL(5,2) DEFAULT 0,
    completed BOOLEAN DEFAULT FALSE,
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    "lastUpdated" TIMESTAMP WITH TIME ZONE,
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    synced BOOLEAN DEFAULT FALSE
);

-- Daily Checklists Table
CREATE TABLE daily_checklists (
    id TEXT PRIMARY KEY,
    "userId" TEXT NOT NULL,
    date DATE NOT NULL,
    items JSONB NOT NULL,
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    synced BOOLEAN DEFAULT FALSE,
    UNIQUE("userId", date)
);

-- Step 3: Create indexes
CREATE INDEX idx_user_profile_userId ON user_profile("userId");
CREATE INDEX idx_diet_entries_user_date ON diet_entries("userId", date);
CREATE INDEX idx_diet_entries_date ON diet_entries(date);
CREATE INDEX idx_test_reports_user_date ON test_reports("userId", date);
CREATE INDEX idx_test_reports_testId ON test_reports("testId");
CREATE INDEX idx_health_goals_userId ON health_goals("userId");
CREATE INDEX idx_health_goals_completed ON health_goals(completed);
CREATE INDEX idx_daily_checklists_user_date ON daily_checklists("userId", date);

-- Step 4: Enable Row Level Security
ALTER TABLE user_profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE diet_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_checklists ENABLE ROW LEVEL SECURITY;

-- Step 5: Create policies (allow all for now)
CREATE POLICY "Allow all on user_profile" ON user_profile FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on diet_entries" ON diet_entries FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on test_reports" ON test_reports FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on health_goals" ON health_goals FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on daily_checklists" ON daily_checklists FOR ALL USING (true) WITH CHECK (true);

-- Step 6: Grant permissions
GRANT ALL ON user_profile TO authenticated, anon;
GRANT ALL ON diet_entries TO authenticated, anon;
GRANT ALL ON test_reports TO authenticated, anon;
GRANT ALL ON health_goals TO authenticated, anon;
GRANT ALL ON daily_checklists TO authenticated, anon;

-- Success message
DO $$
BEGIN
    RAISE NOTICE '✅ Database schema updated successfully!';
    RAISE NOTICE '✅ All tables recreated with correct structure';
    RAISE NOTICE '✅ nutrition column is now JSONB';
    RAISE NOTICE '✅ You can now use the app without errors!';
END $$;
