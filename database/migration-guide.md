# Database Migration Guide

## Overview
This guide helps you migrate data from SQLite (Supabase) to MySQL/PostgreSQL.

## Schema Compatibility
The schemas are designed to be compatible with minimal changes:
- SQLite uses TEXT for dates, MySQL/PostgreSQL use DATE/DATETIME
- SQLite uses TEXT for JSON, MySQL uses JSON type
- Both use the same table and column names

## Migration Steps

### 1. Export Data from SQLite

```sql
-- Export user_profile
SELECT * FROM user_profile;

-- Export diet_entries
SELECT * FROM diet_entries;

-- Export test_reports
SELECT * FROM test_reports;

-- Export health_goals
SELECT * FROM health_goals;

-- Export daily_checklists
SELECT * FROM daily_checklists;
```

### 2. Data Transformation

For SQLite to MySQL migration:
- Convert TEXT dates to DATE/DATETIME format
- Parse JSON strings in daily_checklists.items
- Ensure ENUM values match exactly

### 3. Import to MySQL

```bash
# Create database
mysql -u username -p -e "CREATE DATABASE diet_health_tracker;"

# Import schema
mysql -u username -p diet_health_tracker < mysql-schema.sql

# Import data (after transformation)
mysql -u username -p diet_health_tracker < transformed-data.sql
```

### 4. Verification

```sql
-- Check record counts
SELECT 'user_profile' as table_name, COUNT(*) as count FROM user_profile
UNION ALL
SELECT 'diet_entries', COUNT(*) FROM diet_entries
UNION ALL
SELECT 'test_reports', COUNT(*) FROM test_reports
UNION ALL
SELECT 'health_goals', COUNT(*) FROM health_goals
UNION ALL
SELECT 'daily_checklists', COUNT(*) FROM daily_checklists;
```

## PostgreSQL Adjustments

For PostgreSQL, make these changes to the MySQL schema:

1. Replace `ENUM` with `CHECK` constraints:
```sql
gender VARCHAR(10) CHECK(gender IN ('male', 'female'))
```

2. Replace `BOOLEAN` with `BOOLEAN` (already compatible)

3. Replace `AUTO_INCREMENT` with `SERIAL`:
```sql
id SERIAL PRIMARY KEY
```

4. Replace `DATETIME` with `TIMESTAMP`:
```sql
timestamp TIMESTAMP NOT NULL
```

## Automated Migration Script

A Node.js migration script can be created:

```javascript
// migration.js
const sqlite3 = require('sqlite3');
const mysql = require('mysql2/promise');

async function migrate() {
  // Connect to SQLite
  const sqliteDb = new sqlite3.Database('local.db');
  
  // Connect to MySQL
  const mysqlDb = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'diet_health_tracker'
  });
  
  // Migrate each table
  // ... implementation
}

migrate();
```

## Rollback Plan

Always backup before migration:

```bash
# SQLite backup
cp local.db local.db.backup

# MySQL backup
mysqldump -u username -p diet_health_tracker > backup.sql
```
