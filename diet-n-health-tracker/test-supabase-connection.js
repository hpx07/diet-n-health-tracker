// Test Supabase Connection
// Run this with: node test-supabase-connection.js

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

console.log('\n🔍 Testing Supabase Connection...\n');

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('❌ Error: Missing Supabase credentials in .env file');
    console.log('\nPlease make sure your .env file contains:');
    console.log('REACT_APP_SUPABASE_URL=https://oiltiywjyqhvedhearef.supabase.co');
    console.log('REACT_APP_SUPABASE_ANON_KEY=your_anon_key_here\n');
    process.exit(1);
}

console.log('✅ Environment variables found');
console.log(`📍 URL: ${supabaseUrl}`);
console.log(`🔑 Anon Key: ${supabaseAnonKey.substring(0, 20)}...\n`);

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
    try {
        console.log('🔌 Attempting to connect to Supabase...\n');

        // Test 1: Check if we can query the database
        const { data, error } = await supabase
            .from('user_profile')
            .select('count')
            .limit(1);

        if (error) {
            if (error.message.includes('relation') || error.message.includes('does not exist')) {
                console.log('⚠️  Tables not found!');
                console.log('\n📋 Next steps:');
                console.log('1. Go to Supabase Dashboard: https://supabase.com/dashboard');
                console.log('2. Open SQL Editor');
                console.log('3. Run the SQL script from: database/supabase-setup.sql');
                console.log('4. Run this test again\n');
            } else {
                console.error('❌ Connection error:', error.message);
            }
            return false;
        }

        console.log('✅ Successfully connected to Supabase!');
        console.log('✅ Tables are accessible\n');

        // Test 2: Check all tables
        console.log('📊 Checking tables...\n');
        const tables = ['user_profile', 'diet_entries', 'test_reports', 'health_goals', 'daily_checklists'];
        
        for (const table of tables) {
            const { error: tableError } = await supabase
                .from(table)
                .select('count')
                .limit(1);
            
            if (tableError) {
                console.log(`❌ ${table}: Not found or not accessible`);
            } else {
                console.log(`✅ ${table}: OK`);
            }
        }

        console.log('\n🎉 Connection test completed successfully!');
        console.log('\n🚀 You can now start the app with: npm start\n');
        return true;

    } catch (err) {
        console.error('❌ Unexpected error:', err.message);
        return false;
    }
}

testConnection();
