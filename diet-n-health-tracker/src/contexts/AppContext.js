import React, { createContext, useContext, useState, useEffect } from 'react';
import { storageService } from '../utils/storage';
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
  }, []);

  const loadData = () => {
    setUserProfile(storageService.getFromLocal('user_profile')[0] || null);
    setDietEntries(storageService.getFromLocal('diet_entries'));
    setTestReports(storageService.getFromLocal('test_reports'));
    setHealthGoals(storageService.getFromLocal('health_goals'));
    setDailyChecklists(storageService.getFromLocal('daily_checklists'));
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
