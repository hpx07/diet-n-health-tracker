import React, { createContext, useContext, useState, useEffect } from 'react';
import { getDeviceId } from '../utils/deviceId';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing user session
    try {
      console.log('AuthContext: Initializing...');
      const userEmail = localStorage.getItem('userEmail');
      const userName = localStorage.getItem('userName');
      const deviceId = getDeviceId();

      if (userEmail) {
        console.log('AuthContext: Found existing user');
        setUser({ email: userEmail, name: userName, deviceId });
      } else {
        console.log('AuthContext: Setting guest user');
        setUser({ deviceId, isGuest: true });
      }
    } catch (error) {
      console.error('AuthContext: Error during initialization', error);
      // Fallback to guest user
      const deviceId = getDeviceId();
      setUser({ deviceId, isGuest: true });
    } finally {
      console.log('AuthContext: Initialization complete');
      setLoading(false);
    }
  }, []);

  const loginWithGoogle = (credential) => {
    try {
      // Validate JWT token format
      if (!credential || typeof credential !== 'string') {
        throw new Error('Invalid credential format');
      }

      const parts = credential.split('.');
      if (parts.length !== 3) {
        throw new Error('Invalid JWT token structure');
      }

      // Decode JWT token to get user info with error handling
      const payload = JSON.parse(atob(parts[1]));
      
      if (!payload.email || !payload.name) {
        throw new Error('Missing required user information in token');
      }

      const userEmail = payload.email;
      const userName = payload.name;
      const deviceId = getDeviceId();

      localStorage.setItem('userEmail', userEmail);
      localStorage.setItem('userName', userName);

      setUser({ email: userEmail, name: userName, deviceId });
    } catch (error) {
      console.error('Error processing Google login:', error);
      throw new Error('Failed to process login credentials');
    }
  };

  const logout = () => {
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    const deviceId = getDeviceId();
    setUser({ deviceId, isGuest: true });
  };

  const skipLogin = () => {
    const deviceId = getDeviceId();
    setUser({ deviceId, isGuest: true });
  };

  const value = {
    user,
    loading,
    loginWithGoogle,
    logout,
    skipLogin,
    isAuthenticated: !!user && !user.isGuest
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
