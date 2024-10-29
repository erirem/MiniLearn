// src/App.js
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './ProtectedRoute';
import { auth } from './firebaseConfig';
import ModuleList from './pages/ModuleList';
import Quiz from './pages/Quiz';

function App() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [backendMessage, setBackendMessage] = useState('');

  // 1. Firebase Authentication Listener
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      setLoading(false); // Loading complete
    });

    // Cleanup the listener on component unmount
    return () => unsubscribe();
  }, []);

  if (loading) return <p>Loading...</p>; // Show loading while waiting

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/modules" element={<ModuleList />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard backendMessage={backendMessage} />
            </ProtectedRoute>
          }
        />
        {/* Redirect root URL to login page */}
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
