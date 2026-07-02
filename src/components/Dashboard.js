import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useApp } from '../contexts/AppContext';
import DietTracker from './DietTracker';
import TestReports from './TestReports';
import HealthGoals from './HealthGoals';
import DailyChecklist from './DailyChecklist';
import UserProfile from './UserProfile';
import Reports from './Reports';
import NotificationSettings from './NotificationSettings';
import About from './About';
import { APP_VERSION } from '../version';
import { dietCalculator } from '../services/dietCalculator';
import './Dashboard.css';

const Dashboard = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { userProfile, dietEntries } = useApp();
  const [activeTab, setActiveTab] = useState('overview');
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setShowMoreMenu(false);
  };

  const getDisplayName = () => {
    // Priority: 1. User Profile Name, 2. Gmail Name, 3. Gmail Email, 4. Guest User
    if (userProfile?.name && userProfile.name.trim()) {
      return userProfile.name;
    } else if (user?.name) {
      return user.name;
    } else if (user?.email) {
      return user.email;
    } else {
      return 'Guest User';
    }
  };

  // Check if a tab is in the "more" group
  const moreTabActive = ['goals', 'checklist', 'notifications', 'about'].includes(activeTab);

  const renderOverview = () => {
    // Calculate today's stats
    const today = new Date().toISOString().split('T')[0];
    const todayEntries = dietEntries?.filter(e => e.date === today) || [];
    
    // Sum raw values first, round once at the end (per-entry rounding drifts)
    const totals = todayEntries.reduce((acc, e) => {
      if (e.nutrition) {
        const multiplier = (Number(e.quantity) || 100) / 100;
        acc.calories += (e.nutrition.calories || 0) * multiplier;
        acc.protein += (e.nutrition.protein || 0) * multiplier;
        acc.carbs += (e.nutrition.carbs || 0) * multiplier;
        acc.fat += (e.nutrition.fat || 0) * multiplier;
      } else {
        acc.calories += e.calories || 0;
        acc.protein += e.protein || 0;
      }
      return acc;
    }, { calories: 0, protein: 0, carbs: 0, fat: 0 });

    const todayCalories = Math.round(totals.calories);
    const todayProtein = Math.round(totals.protein);
    const todayCarbs = Math.round(totals.carbs);
    const todayFat = Math.round(totals.fat);

    // Use the same target the Diet Tracker computes from the profile,
    // instead of a hardcoded 2000 kcal
    const hasFullProfile = userProfile?.weight && userProfile?.height && userProfile?.age;
    const dietPlan = hasFullProfile
      ? dietCalculator.generateDietPlan(userProfile, userProfile.goal)
      : null;
    const targetCalories = dietPlan?.targetCalories || userProfile?.targetCalories || 2000;
    const caloriePercent = targetCalories > 0 ? Math.min(Math.round((todayCalories / targetCalories) * 100), 100) : 0;

    // Group today's entries by meal type
    const mealGroups = {};
    todayEntries.forEach(e => {
      const meal = e.mealType || 'other';
      if (!mealGroups[meal]) mealGroups[meal] = [];
      mealGroups[meal].push(e);
    });

    const mealOrder = ['breakfast', 'lunch', 'dinner', 'snack', 'other'];
    const mealIcons = { breakfast: '🌅', lunch: '☀️', dinner: '🌙', snack: '🍪', other: '🍽️' };

    return (
      <div>
        {/* Greeting */}
        <div className="greeting-section">
          <div className="greeting-avatar">🫀</div>
          <div className="greeting-text">
            <h2>Hi, {getDisplayName()}!</h2>
            <p>Welcome back — stay on track!</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-card-header">
              <span className="stat-card-title">Calories</span>
              <span className="stat-card-icon">🔥</span>
            </div>
            <div className="stat-card-value">{todayCalories}</div>
            <div className="stat-card-label">of {targetCalories} kcal</div>
          </div>

          <div className="stat-card">
            <div className="stat-card-header">
              <span className="stat-card-title">Protein</span>
              <span className="stat-card-icon">💪</span>
            </div>
            <div className="stat-card-value">{todayProtein}g</div>
            <div className="stat-card-label">Today</div>
          </div>

          <div className="stat-card">
            <div className="stat-card-header">
              <span className="stat-card-title">Progress</span>
              <span className="stat-card-icon">📊</span>
            </div>
            <div className="stat-card-value">{caloriePercent}%</div>
            <div className="stat-card-label">Daily Goal</div>
          </div>

          <div className="stat-card">
            <div className="stat-card-header">
              <span className="stat-card-title">Meals</span>
              <span className="stat-card-icon">🍽️</span>
            </div>
            <div className="stat-card-value">{todayEntries.length}</div>
            <div className="stat-card-label">Today</div>
          </div>
        </div>

        {/* Calorie Progress Bar */}
        <div className="overview-progress-section">
          <div className="overview-progress-header">
            <span>Daily Calorie Progress</span>
            <span className="overview-progress-pct">{caloriePercent}%</span>
          </div>
          <div className="overview-progress-track">
            <div className="overview-progress-fill" style={{ width: `${caloriePercent}%` }}></div>
          </div>
          <div className="overview-macro-row">
            <span>🥩 P: {todayProtein}g</span>
            <span>🌾 C: {todayCarbs}g</span>
            <span>🫒 F: {todayFat}g</span>
          </div>
        </div>

        {/* Today's Meals */}
        <div className="overview-meals">
          <h3>Today's Meals</h3>
          {todayEntries.length === 0 ? (
            <div className="overview-empty">
              <p>No meals logged today</p>
              <button className="action-btn" onClick={() => handleTabChange('diet')}>
                <span className="action-btn-icon">➕</span>
                <span>Add First Meal</span>
              </button>
            </div>
          ) : (
            <div className="overview-meal-list">
              {mealOrder.map(meal => {
                const entries = mealGroups[meal];
                if (!entries || entries.length === 0) return null;
                return (
                  <div key={meal} className="overview-meal-group">
                    <div className="overview-meal-title">
                      {mealIcons[meal]} {meal.charAt(0).toUpperCase() + meal.slice(1)}
                    </div>
                    {entries.map(entry => (
                      <div key={entry.id} className="overview-meal-item">
                        <span className="overview-meal-name">{entry.foodName}</span>
                        <span className="overview-meal-cal">
                          {Math.round((entry.nutrition?.calories || 0) * (entry.quantity || 100) / 100)} cal
                        </span>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <h3>Quick Actions</h3>
          <div className="action-buttons">
            <button className="action-btn" onClick={() => handleTabChange('diet')}>
              <span className="action-btn-icon">🍽️</span>
              <span>Add Meal</span>
            </button>
            <button className="action-btn" onClick={() => handleTabChange('tests')}>
              <span className="action-btn-icon">🩺</span>
              <span>Add Test</span>
            </button>
            <button className="action-btn" onClick={() => handleTabChange('goals')}>
              <span className="action-btn-icon">🎯</span>
              <span>Set Goal</span>
            </button>
            <button className="action-btn" onClick={() => handleTabChange('checklist')}>
              <span className="action-btn-icon">✅</span>
              <span>Checklist</span>
            </button>
          </div>
        </div>

        {/* Profile Setup Banner */}
        {!userProfile && (
          <div className="setup-banner">
            <p>⚠️ Complete your profile for personalized recommendations</p>
            <button onClick={() => handleTabChange('profile')}>Setup Now</button>
          </div>
        )}
      </div>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'diet':
        return <DietTracker />;
      case 'tests':
        return <TestReports />;
      case 'goals':
        return <HealthGoals />;
      case 'checklist':
        return <DailyChecklist />;
      case 'reports':
        return <Reports onNavigate={handleTabChange} />;
      case 'notifications':
        return <NotificationSettings />;
      case 'profile':
        return <UserProfile />;
      case 'about':
        return <About />;
      default:
        return renderOverview();
    }
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          {/* Brand */}
          <div className="header-brand">
            <div className="header-logo">🫀</div>
            <div className="header-title-group">
              <h1>
                Diet-N-Health
                <span className="version-badge">{APP_VERSION.getVersionString()}</span>
              </h1>
              <span className="header-tagline">Track · Monitor · Achieve</span>
            </div>
          </div>

          {/* User */}
          <div className="user-info">
            <div className="user-chip" onClick={() => handleTabChange('profile')} style={{ cursor: 'pointer' }}>
              <div className="user-avatar">👤</div>
              <span className="user-name">{getDisplayName()}</span>
            </div>
            {/* {isAuthenticated && (
              <button onClick={handleLogout} className="logout-btn">Logout</button>
            )} */}
          </div>
        </div>
      </header>

      <div className="dashboard-container">
        {/* Desktop Sidebar */}
        <nav className="sidebar">
          <button
            className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => handleTabChange('overview')}
          >
            <span className="nav-icon">📊</span>
            <span className="nav-label">Overview</span>
          </button>
          <button
            className={`nav-item ${activeTab === 'diet' ? 'active' : ''}`}
            onClick={() => handleTabChange('diet')}
          >
            <span className="nav-icon">🍽️</span>
            <span className="nav-label">Diet Tracker</span>
          </button>
          <button
            className={`nav-item ${activeTab === 'tests' ? 'active' : ''}`}
            onClick={() => handleTabChange('tests')}
          >
            <span className="nav-icon">🩺</span>
            <span className="nav-label">Test Reports</span>
          </button>
          <button
            className={`nav-item ${activeTab === 'goals' ? 'active' : ''}`}
            onClick={() => handleTabChange('goals')}
          >
            <span className="nav-icon">🎯</span>
            <span className="nav-label">Health Goals</span>
          </button>
          <button
            className={`nav-item ${activeTab === 'checklist' ? 'active' : ''}`}
            onClick={() => handleTabChange('checklist')}
          >
            <span className="nav-icon">✅</span>
            <span className="nav-label">Daily Checklist</span>
          </button>
          <button
            className={`nav-item ${activeTab === 'reports' ? 'active' : ''}`}
            onClick={() => handleTabChange('reports')}
          >
            <span className="nav-icon">📈</span>
            <span className="nav-label">Reports</span>
          </button>
          <button
            className={`nav-item ${activeTab === 'notifications' ? 'active' : ''}`}
            onClick={() => handleTabChange('notifications')}
          >
            <span className="nav-icon">🔔</span>
            <span className="nav-label">Notifications</span>
          </button>
          <button
            className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => handleTabChange('profile')}
          >
            <span className="nav-icon">👤</span>
            <span className="nav-label">Profile</span>
          </button>
          <button
            className={`nav-item ${activeTab === 'about' ? 'active' : ''}`}
            onClick={() => handleTabChange('about')}
          >
            <span className="nav-icon">ℹ️</span>
            <span className="nav-label">About</span>
          </button>
        </nav>

        <main className="main-content">
          {renderContent()}
        </main>
      </div>

      {/* More Menu Overlay */}
      {showMoreMenu && (
        <div className="more-overlay" onClick={() => setShowMoreMenu(false)}>
          <div className="more-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="more-sheet-header">
              <span>More</span>
              <button className="more-close" onClick={() => setShowMoreMenu(false)}>✕</button>
            </div>
            <button className={`more-item ${activeTab === 'goals' ? 'active' : ''}`} onClick={() => handleTabChange('goals')}>
              <span className="more-icon">🎯</span>
              <span>Health Goals</span>
            </button>
            <button className={`more-item ${activeTab === 'checklist' ? 'active' : ''}`} onClick={() => handleTabChange('checklist')}>
              <span className="more-icon">✅</span>
              <span>Daily Checklist</span>
            </button>
            <button className={`more-item ${activeTab === 'notifications' ? 'active' : ''}`} onClick={() => handleTabChange('notifications')}>
              <span className="more-icon">🔔</span>
              <span>Notifications</span>
            </button>
            <button className={`more-item ${activeTab === 'about' ? 'active' : ''}`} onClick={() => handleTabChange('about')}>
              <span className="more-icon">ℹ️</span>
              <span>About</span>
            </button>
          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation */}
      <nav className="bottom-nav">
        <button
          className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => handleTabChange('overview')}
        >
          <span className="nav-icon">📊</span>
          <span className="nav-label">Home</span>
        </button>
        <button
          className={`nav-item ${activeTab === 'diet' ? 'active' : ''}`}
          onClick={() => handleTabChange('diet')}
        >
          <span className="nav-icon">🍽️</span>
          <span className="nav-label">Diet</span>
        </button>
        <button
          className={`nav-item ${activeTab === 'tests' ? 'active' : ''}`}
          onClick={() => handleTabChange('tests')}
        >
          <span className="nav-icon">🩺</span>
          <span className="nav-label">Tests</span>
        </button>
        <button
          className={`nav-item ${activeTab === 'reports' ? 'active' : ''}`}
          onClick={() => handleTabChange('reports')}
        >
          <span className="nav-icon">📈</span>
          <span className="nav-label">Reports</span>
        </button>
        <button
          className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => handleTabChange('profile')}
        >
          <span className="nav-icon">👤</span>
          <span className="nav-label">Profile</span>
        </button>
        <button
          className={`nav-item ${moreTabActive ? 'active' : ''}`}
          onClick={() => setShowMoreMenu(!showMoreMenu)}
        >
          <span className="nav-icon">⋯</span>
          <span className="nav-label">More</span>
        </button>
      </nav>
    </div>
  );
};

export default Dashboard;
