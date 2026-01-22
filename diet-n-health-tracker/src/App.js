import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AppProvider } from './contexts/AppContext';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import ErrorBoundary from './components/ErrorBoundary';
import { mobileNotificationService } from './services/mobileNotificationService';
import { App as CapacitorApp } from '@capacitor/app';
import { StatusBar, Style } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';
import { Capacitor } from '@capacitor/core';
import './App.css';

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        fontSize: '20px',
        fontFamily: 'Arial, sans-serif'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ marginBottom: '20px', fontSize: '48px' }}>🍽️</div>
          <div>Loading Diet-N-Health Tracker...</div>
        </div>
      </div>
    );
  }

  // Always allow access - user is set to guest by default
  return children;
}

function AppRoutes() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        fontSize: '20px',
        fontFamily: 'Arial, sans-serif'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ marginBottom: '20px', fontSize: '48px' }}>🍽️</div>
          <div>Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

function App() {
  const [appReady, setAppReady] = React.useState(false);

  React.useEffect(() => {
    const initializeApp = async () => {
      try {
        console.log('Initializing app...');
        
        // Initialize mobile notification service
        try {
          await mobileNotificationService.initialize();
          console.log('Notifications initialized');
        } catch (error) {
          console.log('Notification init error (non-critical):', error);
        }

        // Configure native app features if on mobile
        if (Capacitor.isNativePlatform()) {
          console.log('Running on native platform');
          
          // Hide splash screen after app loads
          try {
            await SplashScreen.hide();
          } catch (error) {
            console.log('Splash screen error:', error);
          }

          // Set status bar style
          try {
            await StatusBar.setStyle({ style: Style.Light });
            await StatusBar.setBackgroundColor({ color: '#4CAF50' });
          } catch (error) {
            console.log('Status bar not available');
          }

          // Handle back button on Android
          try {
            CapacitorApp.addListener('backButton', ({ canGoBack }) => {
              if (!canGoBack) {
                CapacitorApp.exitApp();
              } else {
                window.history.back();
              }
            });
          } catch (error) {
            console.log('Back button handler error:', error);
          }

          // Handle app state changes
          try {
            CapacitorApp.addListener('appStateChange', ({ isActive }) => {
              console.log('App state changed. Is active:', isActive);
            });
          } catch (error) {
            console.log('App state listener error:', error);
          }
        }

        console.log('App initialization complete');
        setAppReady(true);
      } catch (error) {
        console.error('Error initializing app:', error);
        // Still set app as ready to show error boundary
        setAppReady(true);
      }
    };

    initializeApp();

    return () => {
      // Cleanup listeners
      if (Capacitor.isNativePlatform()) {
        try {
          CapacitorApp.removeAllListeners();
        } catch (error) {
          console.log('Cleanup error:', error);
        }
      }
    };
  }, []);

  if (!appReady) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        fontSize: '20px',
        fontFamily: 'Arial, sans-serif'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ marginBottom: '20px', fontSize: '48px' }}>🍽️</div>
          <div>Starting Diet-N-Health Tracker...</div>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <Router>
        <AuthProvider>
          <AppProvider>
            <AppRoutes />
          </AppProvider>
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
