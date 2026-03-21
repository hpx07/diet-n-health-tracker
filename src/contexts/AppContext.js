import React, { createContext, useContext, useState, useEffect } from 'react';
import { storageService } from '../utils/storage';
import { getUserIdentifier } from '../utils/deviceId';
import { v4 as uuidv4 } from 'uuid';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [userProfile, setUserProfile] = useState(null);
  const [dietEntries, setDietEntries] = useState([]);
  const [testReports, setTestReports] = useState([]);
  const [healthGoals, setHealthGoals] = useState([]);
  const [dailyChecklists, setDailyChecklists] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
    
    // Listen for storage changes (when user logs in/out or data syncs)
    const handleStorageChange = () => {
      console.log('📦 Storage changed, reloading data...');
      loadData();
    };
    
    window.addEventListener('storage', handleStorageChange);
    // Custom event for same-tab updates
    window.addEventListener('localDataUpdated', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('localDataUpdated', handleStorageChange);
    };
  }, []);

  const loadData = () => {
    console.log('📂 Loading data for current user...');
    const currentUserId = getUserIdentifier();
    console.log(`👤 Current user ID: ${currentUserId}`);
    console.log(`   Length: ${currentUserId.length} chars`);
    
    // Get all data from localStorage
    const allUserProfiles = storageService.getFromLocal('user_profile');
    const allDietEntries = storageService.getFromLocal('diet_entries');
    const allTestReports = storageService.getFromLocal('test_reports');
    const allHealthGoals = storageService.getFromLocal('health_goals');
    const allDailyChecklists = storageService.getFromLocal('daily_checklists');
    
    console.log('📦 Total records in localStorage:');
    console.log(`  - User Profiles: ${allUserProfiles.length}`);
    console.log(`  - Diet Entries: ${allDietEntries.length}`);
    console.log(`  - Test Reports: ${allTestReports.length}`);
    console.log(`  - Health Goals: ${allHealthGoals.length}`);
    console.log(`  - Daily Checklists: ${allDailyChecklists.length}`);
    
    // Debug: Show unique userIds in diet_entries
    if (allDietEntries.length > 0) {
      const uniqueUserIds = [...new Set(allDietEntries.map(e => e.userId))];
      console.log('🔍 Unique userIds in diet_entries:');
      uniqueUserIds.forEach(uid => {
        console.log(`   - "${uid}" (length: ${uid?.length || 0})`);
        console.log(`     Match: ${uid === currentUserId ? '✅ YES' : '❌ NO'}`);
        if (uid !== currentUserId) {
          console.log(`     Difference: "${uid}" vs "${currentUserId}"`);
        }
      });
    }
    
    // Filter by current user ID
    const userProfileData = allUserProfiles.find(p => p.userId === currentUserId) || null;
    const userDietEntries = allDietEntries.filter(e => e.userId === currentUserId);
    const userTestReports = allTestReports.filter(r => r.userId === currentUserId);
    const userHealthGoals = allHealthGoals.filter(g => g.userId === currentUserId);
    const userDailyChecklists = allDailyChecklists.filter(c => c.userId === currentUserId);
    
    console.log('📊 Loaded data counts for current user:');
    console.log(`  - User Profile: ${userProfileData ? '1' : '0'}`);
    console.log(`  - Diet Entries: ${userDietEntries.length}`);
    console.log(`  - Test Reports: ${userTestReports.length}`);
    console.log(`  - Health Goals: ${userHealthGoals.length}`);
    console.log(`  - Daily Checklists: ${userDailyChecklists.length}`);
    
    setUserProfile(userProfileData);
    setDietEntries(userDietEntries);
    setTestReports(userTestReports);
    setHealthGoals(userHealthGoals);
    setDailyChecklists(userDailyChecklists);
    setLoading(false);
  };

  const saveUserProfile = async (profile) => {
    const profileWithId = { ...profile, id: profile.id || uuidv4() };
    await storageService.saveData('user_profile', profileWithId);
    setUserProfile(profileWithId);
  };

  const addDietEntry = async (entry) => {
    const entryWithId = { ...entry, id: uuidv4() };
    await storageService.saveData('diet_entries', entryWithId);
    setDietEntries(prev => [...prev, entryWithId]);
  };

  const deleteDietEntry = async (id) => {
    await storageService.deleteData('diet_entries', id);
    setDietEntries(prev => prev.filter(e => e.id !== id));
  };

  const addTestReport = async (report) => {
    const reportWithId = { ...report, id: uuidv4() };
    await storageService.saveData('test_reports', reportWithId);
    setTestReports(prev => [...prev, reportWithId]);
  };

  const deleteTestReport = async (id) => {
    await storageService.deleteData('test_reports', id);
    setTestReports(prev => prev.filter(r => r.id !== id));
  };

  const addHealthGoal = async (goal) => {
    const goalWithId = { ...goal, id: uuidv4() };
    await storageService.saveData('health_goals', goalWithId);
    setHealthGoals(prev => [...prev, goalWithId]);
  };

  const updateHealthGoal = async (id, updates) => {
    const goal = healthGoals.find(g => g.id === id);
    const updatedGoal = { ...goal, ...updates };
    await storageService.saveData('health_goals', updatedGoal);
    setHealthGoals(prev => prev.map(g => g.id === id ? updatedGoal : g));
  };

  const deleteHealthGoal = async (id) => {
    await storageService.deleteData('health_goals', id);
    setHealthGoals(prev => prev.filter(g => g.id !== id));
  };

  const addDailyChecklist = async (checklist) => {
    const checklistWithId = { ...checklist, id: uuidv4() };
    await storageService.saveData('daily_checklists', checklistWithId);
    setDailyChecklists(prev => [...prev, checklistWithId]);
  };

  const updateChecklist = async (id, updates) => {
    const checklist = dailyChecklists.find(c => c.id === id);
    const updatedChecklist = { ...checklist, ...updates };
    await storageService.saveData('daily_checklists', updatedChecklist);
    setDailyChecklists(prev => prev.map(c => c.id === id ? updatedChecklist : c));
  };

  const deleteChecklist = async (id) => {
    await storageService.deleteData('daily_checklists', id);
    setDailyChecklists(prev => prev.filter(c => c.id !== id));
  };

  const value = {
    userProfile,
    dietEntries,
    testReports,
    healthGoals,
    dailyChecklists,
    loading,
    saveUserProfile,
    addDietEntry,
    deleteDietEntry,
    addTestReport,
    deleteTestReport,
    addHealthGoal,
    updateHealthGoal,
    deleteHealthGoal,
    addDailyChecklist,
    updateChecklist,
    deleteChecklist
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
