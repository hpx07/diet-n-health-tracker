/**
 * Fix userId Mismatch
 * 
 * This script fixes cases where data has a different userId than the current user
 * Run this in browser console if you see data in Supabase but not in the app
 */

function fixUserIdMismatch() {
  console.log('='.repeat(80));
  console.log('FIX: userId Mismatch');
  console.log('='.repeat(80));
  
  // Get current user
  const userEmail = localStorage.getItem('userEmail');
  const deviceId = localStorage.getItem('deviceId');
  const currentUserId = userEmail || deviceId;
  
  console.log('\n1. CURRENT USER:');
  console.log(`   Email: "${userEmail}"`);
  console.log(`   Device ID: "${deviceId}"`);
  console.log(`   Current User ID: "${currentUserId}"`);
  
  if (!currentUserId) {
    console.error('❌ No user ID found! Please log in first.');
    return;
  }
  
  // Tables to check
  const tables = ['user_profile', 'diet_entries', 'test_reports', 'health_goals', 'daily_checklists'];
  let totalFixed = 0;
  
  console.log('\n2. CHECKING TABLES:');
  
  tables.forEach(table => {
    console.log(`\n   ${table}:`);
    
    const dataStr = localStorage.getItem(table);
    if (!dataStr) {
      console.log('     No data');
      return;
    }
    
    try {
      const data = JSON.parse(dataStr);
      console.log(`     Total records: ${data.length}`);
      
      if (data.length === 0) {
        console.log('     Empty');
        return;
      }
      
      // Find records with different userId
      const mismatchedRecords = data.filter(item => item.userId !== currentUserId);
      
      if (mismatchedRecords.length === 0) {
        console.log('     ✅ All records match current user');
        return;
      }
      
      console.log(`     ⚠️  Found ${mismatchedRecords.length} records with different userId`);
      
      // Show unique mismatched userIds
      const uniqueMismatched = [...new Set(mismatchedRecords.map(r => r.userId))];
      console.log(`     Mismatched userIds:`);
      uniqueMismatched.forEach(uid => {
        const count = mismatchedRecords.filter(r => r.userId === uid).length;
        console.log(`       - "${uid}" (${count} records)`);
      });
      
      // Ask user if they want to fix
      console.log(`\n     Do you want to update these records to "${currentUserId}"?`);
      console.log(`     Run: fixTable("${table}", "${uniqueMismatched[0]}", "${currentUserId}")`);
      
    } catch (error) {
      console.error(`     ❌ Error:`, error);
    }
  });
  
  console.log('\n' + '='.repeat(80));
  console.log('INSTRUCTIONS:');
  console.log('='.repeat(80));
  console.log('If you see mismatched userIds above, you can fix them by running:');
  console.log('');
  console.log('  fixTable("table_name", "old_userId", "new_userId")');
  console.log('');
  console.log('Or fix all tables at once:');
  console.log('  fixAllTables("old_userId", "new_userId")');
  console.log('='.repeat(80));
}

function fixTable(tableName, oldUserId, newUserId) {
  console.log(`\n🔧 Fixing ${tableName}...`);
  console.log(`   From: "${oldUserId}"`);
  console.log(`   To: "${newUserId}"`);
  
  const dataStr = localStorage.getItem(tableName);
  if (!dataStr) {
    console.log('   ❌ No data found');
    return;
  }
  
  try {
    const data = JSON.parse(dataStr);
    let fixedCount = 0;
    
    const updatedData = data.map(item => {
      if (item.userId === oldUserId) {
        fixedCount++;
        return { ...item, userId: newUserId };
      }
      return item;
    });
    
    localStorage.setItem(tableName, JSON.stringify(updatedData));
    console.log(`   ✅ Fixed ${fixedCount} records`);
    
    // Trigger reload
    window.dispatchEvent(new Event('localDataUpdated'));
    console.log('   🔄 Triggered data reload');
    
    return fixedCount;
  } catch (error) {
    console.error('   ❌ Error:', error);
    return 0;
  }
}

function fixAllTables(oldUserId, newUserId) {
  console.log('='.repeat(80));
  console.log('FIXING ALL TABLES');
  console.log('='.repeat(80));
  console.log(`From: "${oldUserId}"`);
  console.log(`To: "${newUserId}"`);
  console.log('');
  
  const tables = ['user_profile', 'diet_entries', 'test_reports', 'health_goals', 'daily_checklists'];
  let totalFixed = 0;
  
  tables.forEach(table => {
    const fixed = fixTable(table, oldUserId, newUserId);
    totalFixed += fixed;
  });
  
  console.log('\n' + '='.repeat(80));
  console.log(`✅ COMPLETE: Fixed ${totalFixed} total records`);
  console.log('='.repeat(80));
  console.log('Refresh the page to see your data!');
}

// Auto-run
console.log('Fix utility loaded!');
console.log('Run: fixUserIdMismatch()');
fixUserIdMismatch();
