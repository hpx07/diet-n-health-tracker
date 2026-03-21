import React, { createContext, useContext, useState, useEffect } from 'react';
import { getDeviceId } from '../utils/deviceId';
import { dataMergeService } from '../services/dataMergeService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing user session
    try {
      console.log('AuthContext: Initializing...');
      const userEmail = localStorage.getItem('userEmail');
      const userName = localStorage.getItem('userName');
      const deviceId = getDeviceId();

      if (userEmail) {
        console.log('AuthContext: Found existing user');
        setUser({ email: userEmail, name: userName, deviceId });
      } else {
        console.log('AuthContext: Setting guest user');
        setUser({ deviceId, isGuest: true });
      }
    } catch (error) {
      console.error('AuthContext: Error during initialization', error);
      // Fallback to guest user
      const deviceId = getDeviceId();
      setUser({ deviceId, isGuest: true });
    } finally {
      console.log('AuthContext: Initialization complete');
      setLoading(false);
    }
  }, []);

  const migrateLocalDataToUser = async (oldUserId, newUserId) => {
    // Use the new intelligent merge service
    try {
      console.log('\n' + '='.repeat(60));
      console.log('🚀 STARTING INTELLIGENT DATA MERGE AND SYNC');
      console.log('='.repeat(60));
      
      const result = await dataMergeService.mergeAndSyncData(oldUserId, newUserId);
      
      if (result.success) {
        console.log('\n✅ Data merge completed successfully');
        if (result.results) {
          console.log('📊 Detailed merge statistics:');
          Object.entries(result.results).forEach(([table, stats]) => {
            console.log(`  - ${table}: ${stats.localCount} local + ${stats.cloudCount} cloud = ${stats.mergedCount} merged`);
          });
        }
        return result;
      } else {
        console.warn('\n⚠️ Data merge had issues but local migration completed:', result);
        return result;
      }
    } catch (error) {
      console.error('\n❌ Error during data migration:', error);
      console.error('Stack trace:', error.stack);
      
      // Fallback to simple local migration
      console.log('⚠️ Falling back to simple local migration...');
      dataMergeService.migrateLocalDataOnly(oldUserId, newUserId);
      return { success: false, error: error.message, localMigrated: true };
    }
  };

  const loginWithGoogle = async (credential) => {
    try {
      console.log('🔐 Processing Google login...');
      
      // Validate JWT token format
      if (!credential || typeof credential !== 'string') {
        throw new Error('Invalid credential format');
      }

      const parts = credential.split('.');
      if (parts.length !== 3) {
        throw new Error('Invalid JWT token structure');
      }

      // Decode JWT token to get user info with error handling
      const payload = JSON.parse(atob(parts[1]));
      
      if (!payload.email || !payload.name) {
        throw new Error('Missing required user information in token');
      }

      const userEmail = payload.email;
      const userName = payload.name;
      const deviceId = getDeviceId();

      console.log(`👤 User: ${userName} (${userEmail})`);
      console.log(`📱 Device ID: ${deviceId}`);

      // Migrate and merge existing local data with cloud data
      const oldUserId = deviceId;
      console.log('🔄 Starting data merge and sync...');
      const mergeResult = await migrateLocalDataToUser(oldUserId, userEmail);

      if (mergeResult.success) {
        console.log('✅ Login successful with data merge');
        if (mergeResult.summary) {
          console.log(`📊 Summary: ${mergeResult.summary.totalLocal} local + ${mergeResult.summary.totalCloud} cloud = ${mergeResult.summary.totalMerged} total records`);
        }
      } else {
        console.warn('⚠️ Login successful but merge had issues:', mergeResult);
      }

      localStorage.setItem('userEmail', userEmail);
      localStorage.setItem('userName', userName);

      setUser({ email: userEmail, name: userName, deviceId, mergeResult });
      
      // Trigger AppContext to reload data for the new user
      console.log('🔄 Triggering data reload for new user...');
      window.dispatchEvent(new Event('localDataUpdated'));
      
      return mergeResult;
    } catch (error) {
      console.error('❌ Error processing Google login:', error);
      throw new Error('Failed to process login credentials');
    }
  };

  const logout = () => {
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    const deviceId = getDeviceId();
    setUser({ deviceId, isGuest: true });
    
    // Trigger AppContext to reload data for guest user
    console.log('🔄 Triggering data reload for guest user...');
    window.dispatchEvent(new Event('localDataUpdated'));
  };

  const skipLogin = () => {
    const deviceId = getDeviceId();
    setUser({ deviceId, isGuest: true });
  };

  const value = {
    user,
    loading,
    loginWithGoogle,
    logout,
    skipLogin,
    isAuthenticated: !!user && !user.isGuest
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
