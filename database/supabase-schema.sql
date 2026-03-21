-- Supabase PostgreSQL Schema for Diet-n-Health Tracker
-- Run this in your Supabase SQL Editor

-- User Profile Table
CREATE TABLE IF NOT EXISTS user_profile (
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

CREATE INDEX IF NOT EXISTS idx_user_profile_userId ON user_profile("userId");

-- Diet Entries Table
CREATE TABLE IF NOT EXISTS diet_entries (
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

CREATE INDEX IF NOT EXISTS idx_diet_entries_user_date ON diet_entries("userId", date);
CREATE INDEX IF NOT EXISTS idx_diet_entries_date ON diet_entries(date);

-- Test Reports Table
CREATE TABLE IF NOT EXISTS test_reports (
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

CREATE INDEX IF NOT EXISTS idx_test_reports_user_date ON test_reports("userId", date);
CREATE INDEX IF NOT EXISTS idx_test_reports_testId ON test_reports("testId");

-- Health Goals Table
CREATE TABLE IF NOT EXISTS health_goals (
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

CREATE INDEX IF NOT EXISTS idx_health_goals_userId ON health_goals("userId");
CREATE INDEX IF NOT EXISTS idx_health_goals_completed ON health_goals(completed);

-- Daily Checklists Table
CREATE TABLE IF NOT EXISTS daily_checklists (
    id TEXT PRIMARY KEY,
    "userId" TEXT NOT NULL,
    date DATE NOT NULL,
    items JSONB NOT NULL,
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    synced BOOLEAN DEFAULT FALSE,
    UNIQUE("userId", date)
);

CREATE INDEX IF NOT EXISTS idx_daily_checklists_user_date ON daily_checklists("userId", date);

-- Enable Row Level Security (RLS)
ALTER TABLE user_profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE diet_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_checklists ENABLE ROW LEVEL SECURITY;

-- Create policies (allow all for now - customize based on your auth requirements)
CREATE POLICY "Allow all on user_profile" ON user_profile FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on diet_entries" ON diet_entries FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on test_reports" ON test_reports FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on health_goals" ON health_goals FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on daily_checklists" ON daily_checklists FOR ALL USING (true) WITH CHECK (true);

-- Grant permissions
GRANT ALL ON user_profile TO authenticated, anon;
GRANT ALL ON diet_entries TO authenticated, anon;
GRANT ALL ON test_reports TO authenticated, anon;
GRANT ALL ON health_goals TO authenticated, anon;
GRANT ALL ON daily_checklists TO authenticated, anon;
