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
import './Dashboard.css';

const Dashboard = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { userProfile, dietEntries, testReports } = useApp();
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

  // Check if a tab is in the "more" group
  const moreTabActive = ['goals', 'checklist', 'notifications', 'about'].includes(activeTab);

  const renderOverview = () => {
    // Calculate today's stats
    const today = new Date().toISOString().split('T')[0];
    const todayEntries = dietEntries?.filter(e => e.date === today) || [];
    const todayCalories = todayEntries.reduce((sum, e) => sum + (e.calories || 0), 0);
    const todayProtein = todayEntries.reduce((sum, e) => sum + (e.protein || 0), 0);
    
    const targetCalories = userProfile?.targetCalories || 2000;
    const caloriePercent = Math.round((todayCalories / targetCalories) * 100);

    return (
      <div>
        {/* Greeting */}
        <div className="greeting-section">
          <div className="greeting-avatar">🫀</div>
          <div className="greeting-text">
            <h2>Hi, {user?.name || 'Guest'}!</h2>
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
            <div className="stat-card-value">{Math.round(todayProtein)}g</div>
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
              <span className="stat-card-title">Tests</span>
              <span className="stat-card-icon">🩺</span>
            </div>
            <div className="stat-card-value">{testReports?.length || 0}</div>
            <div className="stat-card-label">Reports</div>
          </div>
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
        return <Reports />;
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
          <h1>
            Diet-N-Health
            <span className="version-badge">{APP_VERSION.getVersionString()}</span>
          </h1>
          <div className="user-info">
            {isAuthenticated ? (
              <>
                <span>{user.name}</span>
                <button onClick={handleLogout} className="logout-btn">Logout</button>
              </>
            ) : (
              <span>Guest</span>
            )}
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
