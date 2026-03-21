# Database Schema Documentation

## Overview
This folder contains the database schemas for the Diet-n-Health Tracker application.

## Files

### supabase-schema.sql
PostgreSQL schema for Supabase deployment. This is the primary production schema.

**Features:**
- Uses JSONB for flexible nutrition and normalRange data
- Includes Row Level Security (RLS) policies
- Optimized indexes for common queries
- Timestamp with timezone support

**Usage:**
```bash
# Run in Supabase SQL Editor
psql -h your-supabase-host -U postgres -d your-database -f supabase-schema.sql
```

### mysql-schema.sql
MySQL schema for local or MySQL-based deployments.

**Features:**
- Uses JSON type for nutrition and normalRange data (requires MySQL 5.7+)
- Includes sync_queue table for offline sync
- ENUM types for constrained values
- InnoDB engine with utf8mb4 charset

**Usage:**
```bash
# Create database and import schema
mysql -u root -p -e "CREATE DATABASE diet_health_tracker;"
mysql -u root -p diet_health_tracker < mysql-schema.sql
```

## Schema Structure

### Tables

1. **user_profile** - User information and preferences
   - Stores user demographics and fitness goals
   - One record per user

2. **diet_entries** - Food intake records
   - Nutrition data stored as JSON: `{calories, protein, carbs, fat, fiber, sugar, sodium}`
   - Indexed by userId and date for fast queries

3. **test_reports** - Health test results
   - normalRange stored as JSON: `{min, max}`
   - Tracks various health metrics over time

4. **health_goals** - User-defined health objectives
   - Supports multiple goal categories
   - Tracks progress and completion status

5. **daily_checklists** - Daily habit tracking
   - Items stored as JSON array
   - One record per user per day

6. **sync_queue** (MySQL only) - Offline sync management
   - Tracks pending sync operations
   - Used for local-to-cloud synchronization

## Data Types

### Nutrition Object (JSON/JSONB)
```json
{
  "calories": 250.5,
  "protein": 12.3,
  "carbs": 30.2,
  "fat": 8.5,
  "fiber": 3.2,
  "sugar": 5.1,
  "sodium": 200.0
}
```

### Normal Range Object (JSON/JSONB)
```json
{
  "min": 70.0,
  "max": 100.0
}
```

### Checklist Items (JSON/JSONB)
```json
[
  {
    "id": "1",
    "text": "Drink 8 glasses of water",
    "completed": true
  },
  {
    "id": "2",
    "text": "Exercise for 30 minutes",
    "completed": false
  }
]
```

## Migration Notes

### From Flat Schema to JSON Schema
If you have an old schema with flat columns like `nutrition_calories`, `nutrition_protein`, etc., you'll need to migrate:

```sql
-- Example migration for diet_entries
UPDATE diet_entries SET nutrition = JSON_OBJECT(
  'calories', nutrition_calories,
  'protein', nutrition_protein,
  'carbs', nutrition_carbs,
  'fat', nutrition_fat,
  'fiber', nutrition_fiber,
  'sugar', nutrition_sugar,
  'sodium', nutrition_sodium
);
```

### PostgreSQL to MySQL
Key differences to handle:
- JSONB → JSON
- TIMESTAMP WITH TIME ZONE → DATETIME
- TEXT → VARCHAR
- CHECK constraints → ENUM types

## Security

### Supabase RLS Policies
The schema includes basic RLS policies that allow all operations. For production:

```sql
-- Example: Restrict to authenticated users only
DROP POLICY "Allow all on diet_entries" ON diet_entries;
CREATE POLICY "Users can manage own entries" ON diet_entries
  FOR ALL USING (auth.uid()::text = "userId");
```

## Performance Tips

1. **Indexes are already optimized** for common queries
2. **Use date ranges** in queries to leverage indexes
3. **JSON queries** in PostgreSQL are fast with JSONB
4. **Batch inserts** for better performance with multiple records

## Backup Recommendations

```bash
# Supabase/PostgreSQL
pg_dump -h your-host -U postgres -d your-db > backup.sql

# MySQL
mysqldump -u root -p diet_health_tracker > backup.sql
```
