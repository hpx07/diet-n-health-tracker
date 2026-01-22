import React, { useState } from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const { loginWithGoogle, skipLogin } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const googleClientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
  const hasGoogleAuth = googleClientId && googleClientId !== 'your-google-client-id.apps.googleusercontent.com';

  const handleGoogleSuccess = (credentialResponse) => {
    try {
      loginWithGoogle(credentialResponse.credential);
      navigate('/dashboard');
    } catch (err) {
      console.error('Google login error:', err);
      setError('Login failed. Please try again or continue without login.');
    }
  };

  const handleGoogleError = () => {
    console.error('Google login failed');
    setError('Google login is not available. Please continue without login.');
  };

  const handleSkip = () => {
    try {
      skipLogin();
      navigate('/dashboard');
    } catch (err) {
      console.error('Skip login error:', err);
      setError('An error occurred. Please refresh the page.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Diet-N-Health Tracker</h1>
        <p className="subtitle">Track your diet, monitor your health, achieve your goals</p>
        
        <div className="login-options">
          {error && (
            <div className="error-message" style={{
              padding: '10px',
              marginBottom: '15px',
              background: '#fee',
              border: '1px solid #fcc',
              borderRadius: '6px',
              color: '#c33'
            }}>
              {error}
            </div>
          )}

          {hasGoogleAuth ? (
            <GoogleOAuthProvider clientId={googleClientId}>
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                text="signin_with"
                shape="rectangular"
                theme="filled_blue"
                size="large"
              />
            </GoogleOAuthProvider>
          ) : (
            <div className="google-disabled" style={{
              padding: '15px',
              background: '#f0f0f0',
              borderRadius: '8px',
              textAlign: 'center',
              color: '#666',
              marginBottom: '15px'
            }}>
              <p style={{ margin: 0 }}>Google login is not configured</p>
              <small>Continue without login to use the app</small>
            </div>
          )}

          <div className="divider">
            <span>OR</span>
          </div>

          <button className="skip-button" onClick={handleSkip}>
            Continue Without Login
          </button>

          <p className="info-text">
            {hasGoogleAuth 
              ? 'Login with Google to sync your data across devices. Or continue without login to use the app with local storage only.'
              : 'Continue without login to use the app with local storage. All your data will be saved on this device.'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
