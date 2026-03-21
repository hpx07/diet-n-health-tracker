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
      {/* Brand */}
      <div className="login-brand">
        <div className="login-brand-icon">🫀</div>
        <h1>Diet-N-Health</h1>
        <p>Track diet · Monitor health · Achieve goals</p>
      </div>

      {/* Card */}
      <div className="login-card">
        <div className="login-card-title">Sign in to continue</div>

        <div className="login-options">
          {error && (
            <div className="error-message">{error}</div>
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
            <div className="google-disabled-box">
              <p style={{ margin: 0 }}>Google login not configured</p>
              <small>Continue without login to use the app</small>
            </div>
          )}

          <div className="login-divider"><span>OR</span></div>

          <button className="skip-button" onClick={handleSkip}>
            Continue Without Login
          </button>

          <p className="info-text">
            {hasGoogleAuth
              ? 'Sign in with Google to sync data across devices, or continue with local storage only.'
              : 'All data is saved on this device. No account needed.'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
