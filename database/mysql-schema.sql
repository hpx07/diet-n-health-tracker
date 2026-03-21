-- MySQL Schema for Diet-n-Health Tracker
-- Compatible with PostgreSQL with minor adjustments

-- User Profile Table
CREATE TABLE IF NOT EXISTS user_profile (
    id VARCHAR(36) PRIMARY KEY,
    userId VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    age INT NOT NULL,
    gender ENUM('male', 'female') NOT NULL,
    height DECIMAL(5,2) NOT NULL,
    weight DECIMAL(5,2) NOT NULL,
    activityLevel ENUM('sedentary', 'light', 'moderate', 'active', 'veryActive') NOT NULL,
    goal ENUM('lose', 'maintain', 'gain') NOT NULL,
    timestamp DATETIME NOT NULL,
    synced BOOLEAN DEFAULT FALSE,
    UNIQUE KEY unique_user (userId),
    INDEX idx_userId (userId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Diet Entries Table
CREATE TABLE IF NOT EXISTS diet_entries (
    id VARCHAR(36) PRIMARY KEY,
    userId VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    mealType ENUM('breakfast', 'lunch', 'dinner', 'snack') NOT NULL,
    foodName VARCHAR(255) NOT NULL,
    brand VARCHAR(255),
    quantity DECIMAL(8,2) NOT NULL,
    nutrition_calories DECIMAL(8,2) NOT NULL,
    nutrition_protein DECIMAL(8,2) NOT NULL,
    nutrition_carbs DECIMAL(8,2) NOT NULL,
    nutrition_fat DECIMAL(8,2) NOT NULL,
    nutrition_fiber DECIMAL(8,2) DEFAULT 0,
    nutrition_sugar DECIMAL(8,2) DEFAULT 0,
    nutrition_sodium DECIMAL(8,2) DEFAULT 0,
    timestamp DATETIME NOT NULL,
    synced BOOLEAN DEFAULT FALSE,
    INDEX idx_user_date (userId, date),
    INDEX idx_date (date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Test Reports Table
CREATE TABLE IF NOT EXISTS test_reports (
    id VARCHAR(36) PRIMARY KEY,
    userId VARCHAR(255) NOT NULL,
    testId VARCHAR(100) NOT NULL,
    testName VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    value DECIMAL(10,2) NOT NULL,
    unit VARCHAR(50) NOT NULL,
    date DATE NOT NULL,
    status ENUM('normal', 'low', 'high') NOT NULL,
    message TEXT NOT NULL,
    normalRange_min DECIMAL(10,2),
    normalRange_max DECIMAL(10,2),
    timestamp DATETIME NOT NULL,
    synced BOOLEAN DEFAULT FALSE,
    INDEX idx_user_date (userId, date),
    INDEX idx_testId (testId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Health Goals Table
CREATE TABLE IF NOT EXISTS health_goals (
    id VARCHAR(36) PRIMARY KEY,
    userId VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category ENUM('weight', 'fitness', 'nutrition', 'health', 'habit') NOT NULL,
    targetValue DECIMAL(10,2) NOT NULL,
    currentValue DECIMAL(10,2) NOT NULL,
    unit VARCHAR(50) NOT NULL,
    targetDate DATE NOT NULL,
    progress DECIMAL(5,2) DEFAULT 0,
    completed BOOLEAN DEFAULT FALSE,
    createdAt DATETIME NOT NULL,
    lastUpdated DATETIME,
    timestamp DATETIME NOT NULL,
    synced BOOLEAN DEFAULT FALSE,
    INDEX idx_userId (userId),
    INDEX idx_completed (completed)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Daily Checklists Table
CREATE TABLE IF NOT EXISTS daily_checklists (
    id VARCHAR(36) PRIMARY KEY,
    userId VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    items JSON NOT NULL,
    createdAt DATETIME NOT NULL,
    timestamp DATETIME NOT NULL,
    synced BOOLEAN DEFAULT FALSE,
    UNIQUE KEY unique_user_date (userId, date),
    INDEX idx_user_date (userId, date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Sync Queue Table
CREATE TABLE IF NOT EXISTS sync_queue (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tableName VARCHAR(100) NOT NULL,
    recordId VARCHAR(36) NOT NULL,
    operation ENUM('insert', 'update', 'delete') NOT NULL,
    data JSON NOT NULL,
    createdAt DATETIME NOT NULL,
    synced BOOLEAN DEFAULT FALSE,
    INDEX idx_synced (synced)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
