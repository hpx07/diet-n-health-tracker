import React, { useState, useEffect } from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { useApp } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import { dietCalculator } from '../services/dietCalculator';
import { storageService } from '../utils/storage';
import { getDeviceId } from '../utils/deviceId';
import './UserProfile.css';

const UserProfile = () => {
  const { userProfile, saveUserProfile } = useApp();
  const { user, isAuthenticated, logout, loginWithGoogle } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: 'male',
    height: '',
    weight: '',
    activityLevel: 'moderate',
    goal: 'maintain'
  });
  const [dietPlan, setDietPlan] = useState(null);
  const [lastSyncTime, setLastSyncTime] = useState(null);
  const [loginError, setLoginError] = useState(null);
  const [loginSuccess, setLoginSuccess] = useState(false);

  useEffect(() => {
    if (userProfile) {
      setFormData(userProfile);
      generateDietPlan(userProfile);
    }
    
    // Get last sync time
    const syncTime = storageService.getLastSyncTime();
    setLastSyncTime(syncTime);
  }, [userProfile]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const generateDietPlan = (profile) => {
    if (profile.weight && profile.height && profile.age) {
      const plan = dietCalculator.generateDietPlan(profile, profile.goal);
      setDietPlan(plan);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form data
    const errors = [];
    
    if (!formData.name.trim()) {
      errors.push('Name is required');
    }
    
    if (!formData.age || formData.age < 1 || formData.age > 120) {
      errors.push('Age must be between 1 and 120 years');
    }
    
    if (!formData.height || formData.height < 50 || formData.height > 300) {
      errors.push('Height must be between 50 and 300 cm');
    }
    
    if (!formData.weight || formData.weight < 20 || formData.weight > 300) {
      errors.push('Weight must be between 20 and 300 kg');
    }
    
    if (errors.length > 0) {
      console.error('Validation errors:', errors);
      // You could show these errors to the user
      return;
    }
    
    try {
      saveUserProfile(formData);
      generateDietPlan(formData);
      console.log('Profile saved successfully');
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  const formatDateTime = (isoString) => {
    if (!isoString) return 'Never';
    
    try {
      const date = new Date(isoString);
      const now = new Date();
      const diffMs = now - date;
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);
      
      // Relative time
      let relativeTime = '';
      if (diffMins < 1) {
        relativeTime = 'Just now';
      } else if (diffMins < 60) {
        relativeTime = `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
      } else if (diffHours < 24) {
        relativeTime = `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
      } else if (diffDays < 7) {
        relativeTime = `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
      } else {
        relativeTime = date.toLocaleDateString();
      }
      
      // Full date and time
      const fullDateTime = date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
      
      return { relativeTime, fullDateTime };
    } catch (error) {
      return { relativeTime: 'Invalid date', fullDateTime: 'Invalid date' };
    }
  };

  const getLoginStatus = () => {
    if (isAuthenticated && user?.email) {
      return {
        status: 'Logged In',
        statusClass: 'status-online',
        icon: '✓'
      };
    } else {
      return {
        status: 'Guest Mode',
        statusClass: 'status-guest',
        icon: '👤'
      };
    }
  };

  const loginStatus = getLoginStatus();
  const syncTimeFormatted = lastSyncTime ? formatDateTime(lastSyncTime) : null;

  const handleLogout = () => {
    const confirmMessage = isAuthenticated 
      ? 'Are you sure you want to logout? Your local data will remain on this device.'
      : 'Are you sure you want to continue as guest?';
    
    if (window.confirm(confirmMessage)) {
      logout();
      // Optionally navigate to dashboard or stay on profile
      // navigate('/dashboard');
    }
  };

  const handleGoogleSuccess = (credentialResponse) => {
    try {
      setLoginError(null);
      setLoginSuccess(false);
      loginWithGoogle(credentialResponse.credential);
      // Data migration happens automatically in AuthContext
      setLoginSuccess(true);
      setTimeout(() => setLoginSuccess(false), 5000); // Hide success message after 5 seconds
    } catch (err) {
      console.error('Google login error:', err);
      setLoginError('Failed to link Google account. Please try again.');
    }
  };

  const handleGoogleError = () => {
    console.error('Google login failed');
    setLoginError('Google login failed. Please try again.');
  };

  const googleClientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
  const hasGoogleAuth = googleClientId && googleClientId !== 'your-google-client-id.apps.googleusercontent.com';

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

  return (
    <div className="user-profile">
      <div className="profile-header">
        <div className="profile-header-content">
          <h2>User Profile</h2>
          <div className="profile-user-info">
            <span className="profile-display-name">{getDisplayName()}</span>
            {/* {isAuthenticated && (
              <button onClick={handleLogout} className="logout-btn-inline">
                Logout
              </button>
            )} */}
          </div>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="profile-form">
        <div className="form-grid">
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your name"
              required
            />
          </div>

          <div className="form-group">
            <label>Age</label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              placeholder="Years"
              required
              min="1"
              max="120"
            />
          </div>

          <div className="form-group">
            <label>Gender</label>
            <select name="gender" value={formData.gender} onChange={handleChange}>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>

          <div className="form-group">
            <label>Height (cm)</label>
            <input
              type="number"
              name="height"
              value={formData.height}
              onChange={handleChange}
              placeholder="cm"
              required
              min="50"
              max="300"
            />
          </div>

          <div className="form-group">
            <label>Weight (kg)</label>
            <input
              type="number"
              name="weight"
              value={formData.weight}
              onChange={handleChange}
              placeholder="kg"
              required
              min="20"
              max="300"
              step="0.1"
            />
          </div>

          <div className="form-group">
            <label>Activity Level</label>
            <select name="activityLevel" value={formData.activityLevel} onChange={handleChange}>
              <option value="sedentary">Sedentary</option>
              <option value="light">Light (1-3 days/wk)</option>
              <option value="moderate">Moderate (3-5 days/wk)</option>
              <option value="active">Active (6-7 days/wk)</option>
              <option value="veryActive">Very Active (daily)</option>
            </select>
          </div>

          <div className="form-group">
            <label>Goal</label>
            <select name="goal" value={formData.goal} onChange={handleChange}>
              <option value="lose">Lose Weight</option>
              <option value="maintain">Maintain Weight</option>
              <option value="gain">Gain Weight</option>
            </select>
          </div>
        </div>

        <button type="submit" className="save-btn">Save Profile</button>
      </form>

      {/* Login Info Section */}
      <div className="login-info-section">
        <div className="section-header-with-action">
          <h3>Login Info</h3>
          {isAuthenticated && (
            <button onClick={handleLogout} className="logout-btn-section">
              Logout
            </button>
          )}
        </div>
        
        <div className="info-grid">
          {/* <div className="info-item">
            <label>Status</label>
            <div className={`status-badge ${loginStatus.statusClass}`}>
              <span className="status-icon">{loginStatus.icon}</span>
              <span className="status-text">{loginStatus.status}</span>
            </div>
          </div> */}

          <div className="info-item">
            <label>Account</label>
            <div className="info-value">
              {isAuthenticated && user?.email ? (
                <span className="email-display">{user.email}</span>
              ) : (
                <span className="guest-text">Local Device Only</span>
              )}
            </div>
          </div>

          {/* {isAuthenticated && user?.name && (
            <div className="info-item">
              <label>Name</label>
              <div className="info-value">{user.name}</div>
            </div>
          )} */}

          {/* <div className="info-item">
            <label>Device ID</label>
            <div className="info-value device-id">
              {getDeviceId().substring(0, 8)}...
            </div>
          </div> */}

          <div className="info-item">
            <label>Last Synced</label>
            <div className="info-value">
              {syncTimeFormatted ? (
                <div className="sync-time">
                  <span className="sync-relative">{syncTimeFormatted.relativeTime}</span>
                  <span className="sync-full">{syncTimeFormatted.fullDateTime}</span>
                </div>
              ) : (
                <span className="sync-never">Never synced</span>
              )}
            </div>
          </div>

          {/* <div className="info-item">
            <label>Storage</label>
            <div className="info-value">
              <span className="storage-type">
                {isAuthenticated ? '☁️ Cloud + Local' : '💾 Local Only'}
              </span>
            </div>
          </div> */}
        </div>

        {/* Google Login for Guest Users */}
        {!isAuthenticated && hasGoogleAuth && (
          <div className="guest-login-section">
            <div className="guest-login-header">
              <h4>Link Your Google Account</h4>
              <p>Sign in to sync your data across devices and keep it safe in the cloud.</p>
            </div>
            
            {loginSuccess && (
              <div className="success-message">
                ✓ Successfully linked your account! Your data has been associated with your Google account.
              </div>
            )}
            
            {loginError && (
              <div className="error-message">
                ⚠️ {loginError}
              </div>
            )}
            
            <div className="google-login-wrapper">
              <GoogleOAuthProvider clientId={googleClientId}>
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                  text="signin_with"
                  shape="rectangular"
                  theme="filled_blue"
                  size="large"
                  width="100%"
                />
              </GoogleOAuthProvider>
            </div>
            
            <div className="guest-login-benefits">
              <p className="benefits-title">Benefits of linking your account:</p>
              <ul>
                <li>✓ Access your data from any device</li>
                <li>✓ Automatic cloud backup</li>
                <li>✓ Never lose your progress</li>
                <li>✓ All existing data will be preserved</li>
              </ul>
            </div>
          </div>
        )}
      </div>

      {dietPlan && (
        <div className="diet-plan">
          <h3>Your Personalized Diet Plan</h3>
          
          <div className="metrics-grid">
            <div className="metric-card">
              <div className="metric-label">BMI</div>
              <div className="metric-value">{dietPlan.bmi}</div>
              <div className="metric-status">{dietPlan.bmiCategory}</div>
            </div>

            <div className="metric-card">
              <div className="metric-label">BMR</div>
              <div className="metric-value">{dietPlan.bmr}</div>
              <div className="metric-unit">cal/day</div>
            </div>

            <div className="metric-card">
              <div className="metric-label">TDEE</div>
              <div className="metric-value">{dietPlan.tdee}</div>
              <div className="metric-unit">cal/day</div>
            </div>

            <div className="metric-card">
              <div className="metric-label">Target Calories</div>
              <div className="metric-value">{dietPlan.targetCalories}</div>
              <div className="metric-unit">cal/day</div>
            </div>
          </div>

          <div className="macros-section">
            <h4>Daily Macro Targets</h4>
            <div className="macros-grid">
              <div className="macro-item">
                <span className="macro-label">Protein</span>
                <span className="macro-value">{dietPlan.macros.protein}g</span>
              </div>
              <div className="macro-item">
                <span className="macro-label">Carbs</span>
                <span className="macro-value">{dietPlan.macros.carbs}g</span>
              </div>
              <div className="macro-item">
                <span className="macro-label">Fat</span>
                <span className="macro-value">{dietPlan.macros.fat}g</span>
              </div>
            </div>
          </div>

          <div className="recommendations">
            <h4>Recommendations</h4>
            <ul>
              {dietPlan.recommendations.map((rec, index) => (
                <li key={index}>{rec}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
