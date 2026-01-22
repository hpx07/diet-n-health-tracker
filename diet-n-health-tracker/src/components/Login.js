import React from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const { loginWithGoogle, skipLogin } = useAuth();
  const navigate = useNavigate();

  const handleGoogleSuccess = (credentialResponse) => {
    loginWithGoogle(credentialResponse.credential);
    navigate('/dashboard');
  };

  const handleGoogleError = () => {
    console.error('Google login failed');
  };

  const handleSkip = () => {
    skipLogin();
    navigate('/dashboard');
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Diet-n-Health Tracker</h1>
        <p className="subtitle">Track your diet, monitor your health, achieve your goals</p>
        
        <div className="login-options">
          <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID'}>
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              text="signin_with"
              shape="rectangular"
              theme="filled_blue"
              size="large"
            />
          </GoogleOAuthProvider>

          <div className="divider">
            <span>OR</span>
          </div>

          <button className="skip-button" onClick={handleSkip}>
            Continue Without Login
          </button>

          <p className="info-text">
            Login with Google to sync your data across devices. 
            Or continue without login to use the app with local storage only.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
