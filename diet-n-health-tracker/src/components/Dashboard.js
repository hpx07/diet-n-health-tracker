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
import './Dashboard.css';

const Dashboard = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { userProfile } = useApp();
  const [activeTab, setActiveTab] = useState('diet');

  const tabs = [
    { id: 'diet', label: 'Diet Tracker', icon: '🍽️' },
    { id: 'tests', label: 'Test Reports', icon: '🩺' },
    { id: 'goals', label: 'Health Goals', icon: '🎯' },
    { id: 'checklist', label: 'Daily Checklist', icon: '✅' },
    { id: 'reports', label: 'Reports', icon: '📊' },
    { id: 'notifications', label: 'Notifications', icon: '�' },
    { id: 'profile', label: 'Profile', icon: '👤' }
  ];

  const renderContent = () => {
    switch (activeTab) {
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
      default:
        return <DietTracker />;
    }
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>Diet-N-Health Tracker</h1>
          <div className="user-info">
            {isAuthenticated ? (
              <>
                <span>👋 {user.name}</span>
                <button onClick={logout} className="logout-btn">Logout</button>
              </>
            ) : (
              <span>📱 Guest Mode</span>
            )}
          </div>
        </div>
      </header>

      <div className="dashboard-container">
        <nav className="sidebar">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`nav-item ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="nav-icon">{tab.icon}</span>
              <span className="nav-label">{tab.label}</span>
            </button>
          ))}
        </nav>

        <main className="main-content">
          {!userProfile && activeTab !== 'profile' && (
            <div className="setup-banner">
              <p>⚠️ Please complete your profile to get personalized diet recommendations</p>
              <button onClick={() => setActiveTab('profile')}>Setup Profile</button>
            </div>
          )}
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
