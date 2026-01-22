-- Supabase SQLite Schema for Diet-n-Health Tracker
-- This schema is designed for easy migration to PostgreSQL/MySQL

-- User Profile Table
CREATE TABLE IF NOT EXISTS user_profile (
    id TEXT PRIMARY KEY,
    userId TEXT NOT NULL,
    name TEXT NOT NULL,
    age INTEGER NOT NULL,
    gender TEXT NOT NULL CHECK(gender IN ('male', 'female')),
    height REAL NOT NULL,
    weight REAL NOT NULL,
    activityLevel TEXT NOT NULL CHECK(activityLevel IN ('sedentary', 'light', 'moderate', 'active', 'veryActive')),
    goal TEXT NOT NULL CHECK(goal IN ('lose', 'maintain', 'gain')),
    timestamp TEXT NOT NULL,
    synced BOOLEAN DEFAULT FALSE,
    UNIQUE(userId)
);

-- Diet Entries Table
CREATE TABLE IF NOT EXISTS diet_entries (
    id TEXT PRIMARY KEY,
    userId TEXT NOT NULL,
    date TEXT NOT NULL,
    mealType TEXT NOT NULL CHECK(mealType IN ('breakfast', 'lunch', 'dinner', 'snack')),
    foodName TEXT NOT NULL,
    brand TEXT,
    quantity REAL NOT NULL,
    nutrition_calories REAL NOT NULL,
    nutrition_protein REAL NOT NULL,
    nutrition_carbs REAL NOT NULL,
    nutrition_fat REAL NOT NULL,
    nutrition_fiber REAL DEFAULT 0,
    nutrition_sugar REAL DEFAULT 0,
    nutrition_sodium REAL DEFAULT 0,
    timestamp TEXT NOT NULL,
    synced BOOLEAN DEFAULT FALSE
);

CREATE INDEX IF NOT EXISTS idx_diet_entries_user_date ON diet_entries(userId, date);
CREATE INDEX IF NOT EXISTS idx_diet_entries_date ON diet_entries(date);

-- Test Reports Table
CREATE TABLE IF NOT EXISTS test_reports (
    id TEXT PRIMARY KEY,
    userId TEXT NOT NULL,
    testId TEXT NOT NULL,
    testName TEXT NOT NULL,
    category TEXT NOT NULL,
    value REAL NOT NULL,
    unit TEXT NOT NULL,
    date TEXT NOT NULL,
    status TEXT NOT NULL CHECK(status IN ('normal', 'low', 'high')),
    message TEXT NOT NULL,
    normalRange_min REAL,
    normalRange_max REAL,
    timestamp TEXT NOT NULL,
    synced BOOLEAN DEFAULT FALSE
);

CREATE INDEX IF NOT EXISTS idx_test_reports_user_date ON test_reports(userId, date);
CREATE INDEX IF NOT EXISTS idx_test_reports_test ON test_reports(testId);

-- Health Goals Table
CREATE TABLE IF NOT EXISTS health_goals (
    id TEXT PRIMARY KEY,
    userId TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL CHECK(category IN ('weight', 'fitness', 'nutrition', 'health', 'habit')),
    targetValue REAL NOT NULL,
    currentValue REAL NOT NULL,
    unit TEXT NOT NULL,
    targetDate TEXT NOT NULL,
    progress REAL DEFAULT 0,
    completed BOOLEAN DEFAULT FALSE,
    createdAt TEXT NOT NULL,
    lastUpdated TEXT,
    timestamp TEXT NOT NULL,
    synced BOOLEAN DEFAULT FALSE
);

CREATE INDEX IF NOT EXISTS idx_health_goals_user ON health_goals(userId);
CREATE INDEX IF NOT EXISTS idx_health_goals_completed ON health_goals(completed);

-- Daily Checklists Table
CREATE TABLE IF NOT EXISTS daily_checklists (
    id TEXT PRIMARY KEY,
    userId TEXT NOT NULL,
    date TEXT NOT NULL,
    items TEXT NOT NULL, -- JSON string of checklist items
    createdAt TEXT NOT NULL,
    timestamp TEXT NOT NULL,
    synced BOOLEAN DEFAULT FALSE,
    UNIQUE(userId, date)
);

CREATE INDEX IF NOT EXISTS idx_daily_checklists_user_date ON daily_checklists(userId, date);

-- Sync Queue Table (for offline sync management)
CREATE TABLE IF NOT EXISTS sync_queue (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tableName TEXT NOT NULL,
    recordId TEXT NOT NULL,
    operation TEXT NOT NULL CHECK(operation IN ('insert', 'update', 'delete')),
    data TEXT NOT NULL, -- JSON string
    createdAt TEXT NOT NULL,
    synced BOOLEAN DEFAULT FALSE
);

CREATE INDEX IF NOT EXISTS idx_sync_queue_synced ON sync_queue(synced);
