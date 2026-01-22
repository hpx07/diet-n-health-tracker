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
    const userEmail = localStorage.getItem('userEmail');
    const userName = localStorage.getItem('userName');
    const deviceId = getDeviceId();

    if (userEmail) {
      setUser({ email: userEmail, name: userName, deviceId });
    } else {
      setUser({ deviceId, isGuest: true });
    }
    setLoading(false);
  }, []);

  const loginWithGoogle = (credential) => {
    // Decode JWT token to get user info
    const payload = JSON.parse(atob(credential.split('.')[1]));
    const userEmail = payload.email;
    const userName = payload.name;
    const deviceId = getDeviceId();

    localStorage.setItem('userEmail', userEmail);
    localStorage.setItem('userName', userName);

    setUser({ email: userEmail, name: userName, deviceId });
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
