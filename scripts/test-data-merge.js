/**
 * Test Data Merge Functionality
 * 
 * This script helps debug and verify that data merge is working correctly
 * when a user logs in with an existing Gmail account.
 * 
 * Usage:
 * 1. Open browser console on your app
 * 2. Copy and paste this entire script
 * 3. Run: testDataMerge()
 */

async function testDataMerge() {
  console.log('='.repeat(80));
  console.log('DATA MERGE TEST UTILITY');
  console.log('='.repeat(80));
  
  // Check Supabase configuration
  console.log('\n1. Checking Supabase Configuration...');
  const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
  const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Supabase not configured!');
    console.log('   Please set REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY in .env');
    return;
  }
  
  console.log('✅ Supabase configured');
  console.log(`   URL: ${supabaseUrl}`);
  
  // Check current user
  console.log('\n2. Checking Current User...');
  const userEmail = localStorage.getItem('userEmail');
  const userName = localStorage.getItem('userName');
  
  if (!userEmail) {
    console.log('⚠️  No user logged in (guest mode)');
    console.log('   Please log in with Google to test data merge');
    return;
  }
  
  console.log('✅ User logged in');
  console.log(`   Name: ${userName}`);
  console.log(`   Email: ${userEmail}`);
  
  // Check local data
  console.log('\n3. Checking Local Data...');
  const tables = ['user_profile', 'diet_entries', 'test_reports', 'health_goals', 'daily_checklists'];
  const localStats = {};
  
  tables.forEach(table => {
    const data = localStorage.getItem(table);
    const parsed = data ? JSON.parse(data) : [];
    const userRecords = parsed.filter(item => item.userId === userEmail);
    const syncedRecords = userRecords.filter(item => item.synced);
    
    localStats[table] = {
      total: parsed.length,
      userRecords: userRecords.length,
      synced: syncedRecords.length,
      unsynced: userRecords.length - syncedRecords.length
    };
    
    console.log(`   ${table}:`);
    console.log(`     - Total records: ${parsed.length}`);
    console.log(`     - Your records: ${userRecords.length}`);
    console.log(`     - Synced: ${syncedRecords.length}`);
    console.log(`     - Unsynced: ${userRecords.length - syncedRecords.length}`);
  });
  
  // Check cloud data
  console.log('\n4. Checking Cloud Data...');
  console.log('   Attempting to fetch from Supabase...');
  
  try {
    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    const cloudStats = {};
    
    for (const table of tables) {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .eq('userId', userEmail);
      
      if (error) {
        console.error(`   ❌ Error fetching ${table}:`, error.message);
        cloudStats[table] = { error: error.message };
      } else {
        cloudStats[table] = {
          records: data.length
        };
        console.log(`   ${table}: ${data.length} records in cloud`);
      }
    }
    
    // Compare local vs cloud
    console.log('\n5. Comparing Local vs Cloud...');
    tables.forEach(table => {
      const local = localStats[table].userRecords;
      const cloud = cloudStats[table]?.records || 0;
      
      if (local === cloud) {
        console.log(`   ✅ ${table}: In sync (${local} records)`);
      } else if (local > cloud) {
        console.log(`   ⚠️  ${table}: Local has more (${local} local vs ${cloud} cloud)`);
        console.log(`       ${local - cloud} records need to be synced to cloud`);
      } else {
        console.log(`   ⚠️  ${table}: Cloud has more (${local} local vs ${cloud} cloud)`);
        console.log(`       ${cloud - local} records need to be pulled from cloud`);
      }
    });
    
    // Check last sync time
    console.log('\n6. Last Sync Time...');
    const lastSync = localStorage.getItem('lastSync');
    if (lastSync) {
      const syncDate = new Date(lastSync);
      const now = new Date();
      const minutesAgo = Math.floor((now - syncDate) / 1000 / 60);
      console.log(`   Last synced: ${syncDate.toLocaleString()} (${minutesAgo} minutes ago)`);
    } else {
      console.log('   ⚠️  Never synced');
    }
    
    // Recommendations
    console.log('\n7. Recommendations...');
    let needsSync = false;
    
    tables.forEach(table => {
      const local = localStats[table].userRecords;
      const cloud = cloudStats[table]?.records || 0;
      
      if (local !== cloud) {
        needsSync = true;
      }
    });
    
    if (needsSync) {
      console.log('   ⚠️  Data is out of sync!');
      console.log('   To fix:');
      console.log('   1. Log out and log back in to trigger a fresh merge');
      console.log('   2. Or wait for automatic sync (every 5 minutes when online)');
      console.log('   3. Or manually trigger sync by going offline and back online');
    } else {
      console.log('   ✅ All data is in sync!');
    }
    
  } catch (error) {
    console.error('   ❌ Error checking cloud data:', error);
    console.log('   Make sure @supabase/supabase-js is installed');
  }
  
  console.log('\n' + '='.repeat(80));
  console.log('TEST COMPLETE');
  console.log('='.repeat(80));
}

// Instructions
console.log('Data Merge Test Utility loaded!');
console.log('Run: testDataMerge()');
