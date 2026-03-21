import { supabase, isSupabaseConfigured } from '../config/supabase';
import { storageService } from '../utils/storage';

/**
 * Data Merge Service
 * Handles intelligent merging of local and cloud data when a guest user logs in
 * Ensures no data loss by merging based on timestamps and unique IDs
 */

const TABLES = ['user_profile', 'diet_entries', 'test_reports', 'health_goals', 'daily_checklists'];

export const dataMergeService = {
  /**
   * Main merge function called when guest logs in with Google
   * @param {string} oldUserId - Device ID (guest)
   * @param {string} newUserId - Email from Google login
   */
  async mergeAndSyncData(oldUserId, newUserId) {
    console.log('='.repeat(60));
    console.log(`DATA MERGE STARTED`);
    console.log(`From: ${oldUserId} (device/guest)`);
    console.log(`To: ${newUserId} (email)`);
    console.log('='.repeat(60));
    
    if (!isSupabaseConfigured()) {
      console.log('⚠️ Supabase not configured, performing local migration only');
      this.migrateLocalDataOnly(oldUserId, newUserId);
      return { success: true, localOnly: true };
    }

    try {
      const mergeResults = {};
      let totalLocal = 0;
      let totalCloud = 0;
      let totalMerged = 0;
      
      for (const table of TABLES) {
        console.log(`\n📊 Processing table: ${table}`);
        console.log('-'.repeat(40));
        const result = await this.mergeTable(table, oldUserId, newUserId);
        mergeResults[table] = result;
        
        totalLocal += result.localCount;
        totalCloud += result.cloudCount;
        totalMerged += result.mergedCount;
        
        console.log(`✓ ${table} complete: ${result.localCount} local + ${result.cloudCount} cloud = ${result.mergedCount} merged`);
      }

      // Update last sync time
      localStorage.setItem('lastSync', new Date().toISOString());
      
      console.log('\n' + '='.repeat(60));
      console.log('✅ DATA MERGE COMPLETED SUCCESSFULLY');
      console.log(`Total: ${totalLocal} local + ${totalCloud} cloud = ${totalMerged} merged records`);
      console.log('='.repeat(60));
      
      return { 
        success: true, 
        results: mergeResults,
        summary: {
          totalLocal,
          totalCloud,
          totalMerged
        }
      };
    } catch (error) {
      console.error('\n' + '='.repeat(60));
      console.error('❌ ERROR DURING DATA MERGE:', error);
      console.error('Error details:', {
        message: error.message,
        stack: error.stack
      });
      console.error('='.repeat(60));
      
      // Fallback to local migration if cloud sync fails
      console.log('⚠️ Falling back to local-only migration...');
      this.migrateLocalDataOnly(oldUserId, newUserId);
      return { success: false, error: error.message, localMigrated: true };
    }
  },

  /**
   * Merge a single table's data
   */
  async mergeTable(table, oldUserId, newUserId) {
    // Step 1: Get local data (guest's data on this device)
    const localData = this.getLocalData(table, oldUserId);
    console.log(`  📱 Local (device): ${localData.length} records`);

    // Step 2: Get cloud data (existing data for this email from other devices)
    const cloudData = await this.getCloudData(table, newUserId);
    console.log(`  ☁️  Cloud (email): ${cloudData.length} records`);

    // Step 3: Merge data intelligently
    const mergedData = this.intelligentMerge(localData, cloudData, table);
    console.log(`  🔄 Merged result: ${mergedData.length} records`);

    // Step 4: Update all records to use new userId
    const updatedData = mergedData.map(item => ({
      ...item,
      userId: newUserId,
      synced: false // Mark for sync
    }));

    // Step 5: Save merged data locally (this restores cloud data to local storage)
    console.log(`  💾 Saving ${updatedData.length} records to localStorage...`);
    localStorage.setItem(table, JSON.stringify(updatedData));

    // Step 6: Sync to cloud (update cloud with any new local data)
    console.log(`  ☁️  Syncing to cloud...`);
    await this.syncToCloud(table, updatedData);

    return {
      localCount: localData.length,
      cloudCount: cloudData.length,
      mergedCount: mergedData.length,
      synced: true
    };
  },

  /**
   * Get local data for a specific userId
   */
  getLocalData(table, userId) {
    try {
      const data = localStorage.getItem(table);
      if (!data) return [];
      
      const parsed = JSON.parse(data);
      return parsed.filter(item => item.userId === userId);
    } catch (error) {
      console.error(`Error reading local ${table}:`, error);
      return [];
    }
  },

  /**
   * Get cloud data for a specific userId
   */
  async getCloudData(table, userId) {
    try {
      if (!supabase) {
        console.warn(`${table}: Supabase not configured, skipping cloud fetch`);
        return [];
      }
      
      console.log(`${table}: Fetching cloud data for userId: ${userId}`);
      
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .eq('userId', userId);
      
      if (error) {
        console.error(`${table}: Supabase query error:`, error);
        throw error;
      }
      
      console.log(`${table}: Successfully fetched ${data?.length || 0} cloud records`);
      return data || [];
    } catch (error) {
      console.error(`Error fetching cloud ${table}:`, error);
      console.error('Error details:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint
      });
      return [];
    }
  },

  /**
   * Intelligent merge based on timestamps and IDs
   * Priority: Most recent data wins, no duplicates
   */
  intelligentMerge(localData, cloudData, table) {
    const merged = new Map();
    let cloudKept = 0;
    let localKept = 0;
    let localNewer = 0;
    let cloudNewer = 0;

    // Add all cloud data first
    cloudData.forEach(item => {
      merged.set(item.id, { ...item, source: 'cloud' });
      cloudKept++;
    });

    // Merge local data
    localData.forEach(localItem => {
      const existingItem = merged.get(localItem.id);
      
      if (!existingItem) {
        // New item from local, add it
        merged.set(localItem.id, { ...localItem, source: 'local' });
        localKept++;
      } else {
        // Item exists in both, keep the most recent
        const localTime = new Date(localItem.timestamp || localItem.date || 0);
        const cloudTime = new Date(existingItem.timestamp || existingItem.date || 0);
        
        if (localTime > cloudTime) {
          // Local is newer, use it
          merged.set(localItem.id, { 
            ...localItem, 
            source: 'local-newer',
            previousCloudData: existingItem 
          });
          localNewer++;
        } else {
          // Cloud is newer or same, keep it but merge any missing fields
          merged.set(localItem.id, {
            ...existingItem,
            ...this.mergeFields(existingItem, localItem),
            source: 'cloud-newer'
          });
          cloudNewer++;
        }
      }
    });

    console.log(`  🔍 Merge details: ${cloudKept} from cloud, ${localKept} from local, ${localNewer} local newer, ${cloudNewer} cloud newer`);

    // Handle special case for user_profile (only one record)
    if (table === 'user_profile' && merged.size > 1) {
      console.log(`  ⚠️  Multiple user profiles found, merging into one...`);
      return [this.mergeUserProfiles(Array.from(merged.values()))];
    }

    return Array.from(merged.values());
  },

  /**
   * Merge fields from two records, keeping non-null values
   */
  mergeFields(primary, secondary) {
    const merged = {};
    
    // Merge fields where primary is null/undefined but secondary has value
    Object.keys(secondary).forEach(key => {
      if ((primary[key] === null || primary[key] === undefined || primary[key] === '') 
          && secondary[key] !== null && secondary[key] !== undefined && secondary[key] !== '') {
        merged[key] = secondary[key];
      }
    });
    
    return merged;
  },

  /**
   * Special handling for user_profile - merge all fields intelligently
   */
  mergeUserProfiles(profiles) {
    if (profiles.length === 0) return null;
    if (profiles.length === 1) return profiles[0];

    // Sort by timestamp, most recent first
    const sorted = profiles.sort((a, b) => {
      const timeA = new Date(a.timestamp || 0);
      const timeB = new Date(b.timestamp || 0);
      return timeB - timeA;
    });

    // Start with most recent profile
    const merged = { ...sorted[0] };

    // Fill in any missing fields from older profiles
    sorted.slice(1).forEach(profile => {
      Object.keys(profile).forEach(key => {
        if ((merged[key] === null || merged[key] === undefined || merged[key] === '') 
            && profile[key] !== null && profile[key] !== undefined && profile[key] !== '') {
          merged[key] = profile[key];
        }
      });
    });

    return merged;
  },

  /**
   * Sync merged data to cloud
   */
  async syncToCloud(table, data) {
    if (!supabase) {
      console.log(`  ⚠️  Supabase not available, skipping cloud sync`);
      return;
    }
    
    if (data.length === 0) {
      console.log(`  ℹ️  No data to sync for ${table}`);
      return;
    }

    try {
      console.log(`  📤 Upserting ${data.length} records to cloud...`);
      
      // Batch upsert to cloud
      const { error } = await supabase
        .from(table)
        .upsert(data, { 
          onConflict: 'id',
          ignoreDuplicates: false 
        });

      if (error) {
        console.error(`  ❌ Supabase upsert error:`, error);
        throw error;
      }

      // Mark all as synced locally
      const syncedData = data.map(item => ({ ...item, synced: true }));
      localStorage.setItem(table, JSON.stringify(syncedData));
      
      console.log(`  ✅ Successfully synced ${data.length} records to cloud`);
    } catch (error) {
      console.error(`  ❌ Error syncing ${table} to cloud:`, error);
      console.error('  Error details:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint
      });
      throw error;
    }
  },

  /**
   * Fallback: Local migration only (no cloud sync)
   */
  migrateLocalDataOnly(oldUserId, newUserId) {
    console.log('Performing local-only data migration');
    
    TABLES.forEach(table => {
      try {
        const data = localStorage.getItem(table);
        if (data) {
          const parsed = JSON.parse(data);
          const updated = parsed.map(item => ({
            ...item,
            userId: item.userId === oldUserId ? newUserId : item.userId
          }));
          localStorage.setItem(table, JSON.stringify(updated));
          console.log(`${table}: Migrated ${updated.length} records locally`);
        }
      } catch (error) {
        console.error(`Error migrating ${table}:`, error);
      }
    });
  },

  /**
   * Force full sync after merge
   */
  async forceSyncAll(userId) {
    if (!isSupabaseConfigured()) return;

    console.log('Starting force sync for all tables...');
    
    for (const table of TABLES) {
      try {
        const localData = storageService.getFromLocal(table);
        const userLocalData = localData.filter(item => item.userId === userId);
        
        if (userLocalData.length > 0) {
          await this.syncToCloud(table, userLocalData);
        }
      } catch (error) {
        console.error(`Force sync failed for ${table}:`, error);
      }
    }
    
    console.log('Force sync completed');
  },

  /**
   * Get merge statistics for display
   */
  getMergeStats() {
    const stats = {};
    
    TABLES.forEach(table => {
      const data = storageService.getFromLocal(table);
      stats[table] = {
        total: data.length,
        synced: data.filter(item => item.synced).length,
        unsynced: data.filter(item => !item.synced).length
      };
    });
    
    return stats;
  }
};
