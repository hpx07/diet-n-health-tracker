import { supabase, isSupabaseConfigured } from '../config/supabase';
import { getUserIdentifier } from './deviceId';

const SYNC_QUEUE_KEY = 'syncQueue';
const LAST_SYNC_KEY = 'lastSync';

export const storageService = {
  // Save data both locally and online
  async saveData(table, data) {
    const userId = getUserIdentifier();
    const timestamp = new Date().toISOString();
    const dataWithMeta = { ...data, userId, timestamp, synced: false };

    // Always save locally first
    this.saveToLocal(table, dataWithMeta);

    // Try to save online if connected
    if (navigator.onLine && isSupabaseConfigured()) {
      try {
        await this.saveToSupabase(table, { ...dataWithMeta, synced: true });
        dataWithMeta.synced = true;
        this.updateLocalSyncStatus(table, data.id, true);
      } catch (error) {
        console.error('Failed to sync online:', error);
        this.addToSyncQueue(table, dataWithMeta);
      }
    } else {
      this.addToSyncQueue(table, dataWithMeta);
    }

    return dataWithMeta;
  },

  saveToLocal(table, data) {
    const existingData = this.getFromLocal(table);
    const index = existingData.findIndex(item => item.id === data.id);
    
    if (index !== -1) {
      existingData[index] = data;
    } else {
      existingData.push(data);
    }
    
    localStorage.setItem(table, JSON.stringify(existingData));
  },

  getFromLocal(table) {
    const data = localStorage.getItem(table);
    return data ? JSON.parse(data) : [];
  },

  async saveToSupabase(table, data) {
    if (!supabase) return;
    
    const { error } = await supabase
      .from(table)
      .upsert(data, { onConflict: 'id' });
    
    if (error) throw error;
  },

  async getFromSupabase(table, userId) {
    if (!supabase) return [];
    
    const { data, error } = await supabase
      .from(table)
      .select('*')
      .eq('userId', userId);
    
    if (error) throw error;
    return data || [];
  },

  async syncData() {
    if (!navigator.onLine || !isSupabaseConfigured()) return;

    const syncQueue = this.getSyncQueue();
    const userId = getUserIdentifier();

    // Sync local data to online
    for (const item of syncQueue) {
      try {
        await this.saveToSupabase(item.table, item.data);
        this.updateLocalSyncStatus(item.table, item.data.id, true);
        this.removeFromSyncQueue(item.data.id);
      } catch (error) {
        console.error('Sync failed for item:', item, error);
      }
    }

    // Pull online data and merge with local
    const tables = ['diet_entries', 'test_reports', 'health_goals', 'daily_checklists', 'user_profile'];
    
    for (const table of tables) {
      try {
        const onlineData = await this.getFromSupabase(table, userId);
        const localData = this.getFromLocal(table);
        
        // Merge: online data takes precedence for synced items
        const merged = this.mergeData(localData, onlineData);
        localStorage.setItem(table, JSON.stringify(merged));
      } catch (error) {
        console.error(`Failed to sync ${table}:`, error);
      }
    }

    localStorage.setItem(LAST_SYNC_KEY, new Date().toISOString());
  },

  mergeData(localData, onlineData) {
    const merged = [...onlineData];
    const onlineIds = new Set(onlineData.map(item => item.id));
    
    // Add local items that aren't online yet
    localData.forEach(item => {
      if (!onlineIds.has(item.id) && !item.synced) {
        merged.push(item);
      }
    });
    
    return merged;
  },

  addToSyncQueue(table, data) {
    const queue = this.getSyncQueue();
    const existingIndex = queue.findIndex(item => item.data.id === data.id);
    
    if (existingIndex !== -1) {
      queue[existingIndex] = { table, data };
    } else {
      queue.push({ table, data });
    }
    
    localStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(queue));
  },

  getSyncQueue() {
    const queue = localStorage.getItem(SYNC_QUEUE_KEY);
    return queue ? JSON.parse(queue) : [];
  },

  removeFromSyncQueue(id) {
    const queue = this.getSyncQueue();
    const filtered = queue.filter(item => item.data.id !== id);
    localStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(filtered));
  },

  updateLocalSyncStatus(table, id, synced) {
    const data = this.getFromLocal(table);
    const item = data.find(d => d.id === id);
    if (item) {
      item.synced = synced;
      localStorage.setItem(table, JSON.stringify(data));
    }
  },

  async deleteData(table, id) {
    // Delete locally
    const localData = this.getFromLocal(table);
    const filtered = localData.filter(item => item.id !== id);
    localStorage.setItem(table, JSON.stringify(filtered));

    // Delete online if connected
    if (navigator.onLine && isSupabaseConfigured() && supabase) {
      try {
        await supabase.from(table).delete().eq('id', id);
      } catch (error) {
        console.error('Failed to delete online:', error);
      }
    }
  },

  getLastSyncTime() {
    return localStorage.getItem(LAST_SYNC_KEY);
  }
};

// Auto-sync when online
window.addEventListener('online', () => {
  storageService.syncData();
});

// Periodic sync every 5 minutes if online
setInterval(() => {
  if (navigator.onLine) {
    storageService.syncData();
  }
}, 5 * 60 * 1000);
