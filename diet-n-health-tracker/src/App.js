import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AppProvider } from './contexts/AppContext';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import { notificationService } from './services/notificationService';
import './App.css';

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return user ? children : <Navigate to="/login" />;
}

function App() {
  React.useEffect(() => {
    // Request notification permission on app load
    notificationService.requestPermission();
  }, []);

  return (
    <Router>
      <AuthProvider>
        <AppProvider>
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
            <Route path="/" element={<Navigate to="/dashboard" />} />
          </Routes>
        </AppProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
