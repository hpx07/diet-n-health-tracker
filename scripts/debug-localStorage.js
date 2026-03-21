/**
 * Debug localStorage Data
 * 
 * This script helps debug what's actually stored in localStorage
 * Run this in browser console to see all data
 */

function debugLocalStorage() {
  console.log('='.repeat(80));
  console.log('DEBUG: localStorage Contents');
  console.log('='.repeat(80));
  
  // Check user info
  console.log('\n1. USER INFO:');
  const userEmail = localStorage.getItem('userEmail');
  const userName = localStorage.getItem('userName');
  const deviceId = localStorage.getItem('deviceId');
  
  console.log(`   Email: "${userEmail}"`);
  console.log(`   Name: "${userName}"`);
  console.log(`   Device ID: "${deviceId}"`);
  
  // Current user identifier
  const currentUserId = userEmail || deviceId;
  console.log(`   Current User ID: "${currentUserId}"`);
  console.log(`   Length: ${currentUserId?.length || 0} characters`);
  
  // Check each table
  const tables = ['user_profile', 'diet_entries', 'test_reports', 'health_goals', 'daily_checklists'];
  
  tables.forEach(table => {
    console.log(`\n2. TABLE: ${table.toUpperCase()}`);
    console.log('-'.repeat(60));
    
    const dataStr = localStorage.getItem(table);
    if (!dataStr) {
      console.log('   ⚠️  No data in localStorage');
      return;
    }
    
    try {
      const data = JSON.parse(dataStr);
      console.log(`   Total records: ${data.length}`);
      
      if (data.length === 0) {
        console.log('   ⚠️  Empty array');
        return;
      }
      
      // Show unique userIds
      const uniqueUserIds = [...new Set(data.map(item => item.userId))];
      console.log(`   Unique userIds: ${uniqueUserIds.length}`);
      
      uniqueUserIds.forEach((uid, index) => {
        const count = data.filter(item => item.userId === uid).length;
        const matches = uid === currentUserId;
        console.log(`   ${index + 1}. "${uid}"`);
        console.log(`      - Records: ${count}`);
        console.log(`      - Length: ${uid?.length || 0} chars`);
        console.log(`      - Matches current: ${matches ? '✅ YES' : '❌ NO'}`);
        
        if (!matches && currentUserId) {
          // Character-by-character comparison
          console.log(`      - Comparing with current userId:`);
          const maxLen = Math.max(uid?.length || 0, currentUserId.length);
          for (let i = 0; i < maxLen; i++) {
            const char1 = uid?.[i] || '(none)';
            const char2 = currentUserId[i] || '(none)';
            if (char1 !== char2) {
              console.log(`        Position ${i}: "${char1}" vs "${char2}" ❌`);
            }
          }
        }
      });
      
      // Show sample record
      if (data.length > 0) {
        console.log(`\n   Sample record:`);
        const sample = data[0];
        console.log(`   {`);
        Object.keys(sample).forEach(key => {
          const value = sample[key];
          const displayValue = typeof value === 'object' ? JSON.stringify(value).substring(0, 50) + '...' : value;
          console.log(`     ${key}: ${displayValue}`);
        });
        console.log(`   }`);
      }
      
    } catch (error) {
      console.error(`   ❌ Error parsing data:`, error);
    }
  });
  
  // Summary
  console.log('\n' + '='.repeat(80));
  console.log('SUMMARY');
  console.log('='.repeat(80));
  
  tables.forEach(table => {
    const dataStr = localStorage.getItem(table);
    if (!dataStr) {
      console.log(`${table}: No data`);
      return;
    }
    
    try {
      const data = JSON.parse(dataStr);
      const userRecords = data.filter(item => item.userId === currentUserId);
      console.log(`${table}: ${userRecords.length} / ${data.length} records for current user`);
    } catch (error) {
      console.log(`${table}: Error reading data`);
    }
  });
  
  console.log('='.repeat(80));
}

// Auto-run
console.log('Debug utility loaded!');
console.log('Run: debugLocalStorage()');
debugLocalStorage();
