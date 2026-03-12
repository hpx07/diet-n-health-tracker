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
      <div className="app-loading">
        <div className="brand-icon">🫀</div>
        <div className="brand-text">Diet-N-Health Tracker</div>
        <div className="spinner"></div>
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
      <div className="app-loading">
        <div className="brand-icon">🫀</div>
        <div className="brand-text">Loading...</div>
        <div className="spinner"></div>
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
        
        // Configure native app features if on mobile FIRST
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
            await StatusBar.setBackgroundColor({ color: '#0D9488' });
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

        // Initialize mobile notification service AFTER native setup
        try {
          await mobileNotificationService.initialize();
          console.log('Notifications initialized');
        } catch (error) {
          console.log('Notification init error (non-critical):', error);
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
      // Cleanup listeners only if they were successfully added
      if (Capacitor.isNativePlatform()) {
        try {
          CapacitorApp.removeAllListeners();
        } catch (error) {
          console.log('Cleanup error (non-critical):', error);
        }
      }
    };
  }, []);

  if (!appReady) {
    return (
      <div className="app-loading">
        <div className="brand-icon">🫀</div>
        <div className="brand-text">Starting up...</div>
        <div className="spinner"></div>
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
