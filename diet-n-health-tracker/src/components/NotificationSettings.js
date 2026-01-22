import React, { useState, useEffect } from 'react';
import { mobileNotificationService } from '../services/mobileNotificationService';
import './NotificationSettings.css';

const NotificationSettings = () => {
  const [settings, setSettings] = useState({
    waterReminder: true,
    mealReminders: true,
    breakfastTime: '08:00',
    lunchTime: '13:00',
    dinnerTime: '19:00',
    goalAlerts: true,
    testAlerts: true
  });

  const [isScheduled, setIsScheduled] = useState(false);

  useEffect(() => {
    // Load saved settings
    const savedSettings = localStorage.getItem('notificationSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  const handleToggle = (key) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleTimeChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const saveSettings = async () => {
    try {
      // Save to localStorage
      localStorage.setItem('notificationSettings', JSON.stringify(settings));

      // Schedule notifications
      await mobileNotificationService.scheduleAllReminders(settings);
      
      setIsScheduled(true);
      setTimeout(() => setIsScheduled(false), 3000);

      alert('Notification settings saved successfully!');
    } catch (error) {
      console.error('Error saving notification settings:', error);
      alert('Failed to save notification settings. Please try again.');
    }
  };

  const testNotification = async () => {
    await mobileNotificationService.sendNotification(
      'Test Notification 🔔',
      'Your notifications are working perfectly!'
    );
  };

  return (
    <div className="notification-settings">
      <h2>🔔 Notification Settings</h2>
      
      <div className="settings-section">
        <h3>Reminders</h3>
        
        <div className="setting-item">
          <div className="setting-info">
            <label>💧 Water Intake Reminders</label>
            <p className="setting-description">Get reminded every 2 hours to stay hydrated (8 AM - 10 PM)</p>
          </div>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={settings.waterReminder}
              onChange={() => handleToggle('waterReminder')}
            />
            <span className="toggle-slider"></span>
          </label>
        </div>

        <div className="setting-item">
          <div className="setting-info">
            <label>🍴 Meal Reminders</label>
            <p className="setting-description">Get reminded to log your meals</p>
          </div>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={settings.mealReminders}
              onChange={() => handleToggle('mealReminders')}
            />
            <span className="toggle-slider"></span>
          </label>
        </div>

        {settings.mealReminders && (
          <div className="meal-times">
            <div className="time-input">
              <label>🌅 Breakfast Time</label>
              <input
                type="time"
                value={settings.breakfastTime}
                onChange={(e) => handleTimeChange('breakfastTime', e.target.value)}
              />
            </div>
            <div className="time-input">
              <label>☀️ Lunch Time</label>
              <input
                type="time"
                value={settings.lunchTime}
                onChange={(e) => handleTimeChange('lunchTime', e.target.value)}
              />
            </div>
            <div className="time-input">
              <label>🌙 Dinner Time</label>
              <input
                type="time"
                value={settings.dinnerTime}
                onChange={(e) => handleTimeChange('dinnerTime', e.target.value)}
              />
            </div>
          </div>
        )}
      </div>

      <div className="settings-section">
        <h3>Alerts</h3>
        
        <div className="setting-item">
          <div className="setting-info">
            <label>🎯 Goal Achievement Alerts</label>
            <p className="setting-description">Get notified when you reach your daily goals</p>
          </div>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={settings.goalAlerts}
              onChange={() => handleToggle('goalAlerts')}
            />
            <span className="toggle-slider"></span>
          </label>
        </div>

        <div className="setting-item">
          <div className="setting-info">
            <label>🩺 Health Test Alerts</label>
            <p className="setting-description">Get notified about abnormal test results</p>
          </div>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={settings.testAlerts}
              onChange={() => handleToggle('testAlerts')}
            />
            <span className="toggle-slider"></span>
          </label>
        </div>
      </div>

      <div className="settings-actions">
        <button className="btn-primary" onClick={saveSettings}>
          {isScheduled ? '✅ Saved!' : '💾 Save Settings'}
        </button>
        <button className="btn-secondary" onClick={testNotification}>
          🔔 Test Notification
        </button>
      </div>

      <div className="settings-info-box">
        <p>ℹ️ <strong>Note:</strong> Notifications work best on mobile devices. Make sure to grant notification permissions when prompted.</p>
      </div>
    </div>
  );
};

export default NotificationSettings;
