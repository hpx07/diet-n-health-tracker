-- Supabase PostgreSQL Schema for Diet-n-Health Tracker
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- User Profile Table
CREATE TABLE IF NOT EXISTS user_profile (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_user_profile_userId ON user_profile("userId");

-- Diet Entries Table
CREATE TABLE IF NOT EXISTS diet_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "userId" TEXT NOT NULL,
    date DATE NOT NULL,
    "mealType" TEXT NOT NULL CHECK("mealType" IN ('breakfast', 'lunch', 'dinner', 'snack')),
    "foodName" TEXT NOT NULL,
    brand TEXT,
    quantity DECIMAL(8,2) NOT NULL,
    nutrition_calories DECIMAL(8,2) NOT NULL,
    nutrition_protein DECIMAL(8,2) NOT NULL,
    nutrition_carbs DECIMAL(8,2) NOT NULL,
    nutrition_fat DECIMAL(8,2) NOT NULL,
    nutrition_fiber DECIMAL(8,2) DEFAULT 0,
    nutrition_sugar DECIMAL(8,2) DEFAULT 0,
    nutrition_sodium DECIMAL(8,2) DEFAULT 0,
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    synced BOOLEAN DEFAULT FALSE
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_diet_entries_user_date ON diet_entries("userId", date);
CREATE INDEX IF NOT EXISTS idx_diet_entries_date ON diet_entries(date);

-- Test Reports Table
CREATE TABLE IF NOT EXISTS test_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "userId" TEXT NOT NULL,
    "testId" TEXT NOT NULL,
    "testName" TEXT NOT NULL,
    category TEXT NOT NULL,
    value DECIMAL(10,2) NOT NULL,
    unit TEXT NOT NULL,
    date DATE NOT NULL,
    status TEXT NOT NULL CHECK(status IN ('normal', 'low', 'high')),
    message TEXT NOT NULL,
    "normalRange_min" DECIMAL(10,2),
    "normalRange_max" DECIMAL(10,2),
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    synced BOOLEAN DEFAULT FALSE
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_test_reports_user_date ON test_reports("userId", date);
CREATE INDEX IF NOT EXISTS idx_test_reports_testId ON test_reports("testId");

-- Health Goals Table
CREATE TABLE IF NOT EXISTS health_goals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_health_goals_userId ON health_goals("userId");
CREATE INDEX IF NOT EXISTS idx_health_goals_completed ON health_goals(completed);

-- Daily Checklists Table
CREATE TABLE IF NOT EXISTS daily_checklists (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "userId" TEXT NOT NULL,
    date DATE NOT NULL,
    items JSONB NOT NULL,
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    synced BOOLEAN DEFAULT FALSE,
    UNIQUE("userId", date)
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_daily_checklists_user_date ON daily_checklists("userId", date);

-- Enable Row Level Security (RLS) for all tables
ALTER TABLE user_profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE diet_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_checklists ENABLE ROW LEVEL SECURITY;

-- Create policies to allow all operations for now
-- You can make these more restrictive based on auth.uid() later

-- User Profile Policies
CREATE POLICY "Allow all operations on user_profile" ON user_profile
    FOR ALL USING (true) WITH CHECK (true);

-- Diet Entries Policies
CREATE POLICY "Allow all operations on diet_entries" ON diet_entries
    FOR ALL USING (true) WITH CHECK (true);

-- Test Reports Policies
CREATE POLICY "Allow all operations on test_reports" ON test_reports
    FOR ALL USING (true) WITH CHECK (true);

-- Health Goals Policies
CREATE POLICY "Allow all operations on health_goals" ON health_goals
    FOR ALL USING (true) WITH CHECK (true);

-- Daily Checklists Policies
CREATE POLICY "Allow all operations on daily_checklists" ON daily_checklists
    FOR ALL USING (true) WITH CHECK (true);

-- Grant permissions to authenticated and anon users
GRANT ALL ON user_profile TO authenticated, anon;
GRANT ALL ON diet_entries TO authenticated, anon;
GRANT ALL ON test_reports TO authenticated, anon;
GRANT ALL ON health_goals TO authenticated, anon;
GRANT ALL ON daily_checklists TO authenticated, anon;

-- Success message
DO $$
BEGIN
    RAISE NOTICE 'Database schema created successfully!';
    RAISE NOTICE 'All tables created with proper indexes and RLS policies.';
    RAISE NOTICE 'You can now use the Diet-n-Health Tracker app!';
END $$;
