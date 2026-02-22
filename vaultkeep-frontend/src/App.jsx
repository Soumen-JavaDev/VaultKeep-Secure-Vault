import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

function App() {
  // A simple check to see if the JWT token exists in the browser's local storage
  const isAuthenticated = !!localStorage.getItem('token');

  return (
    <Router>
      <div className="app-container">
        <Routes>
          {/* Public Route */}
          <Route path="/login" element={<Login />} />
          
          {/* Protected Route: Only accessible if logged in */}
          <Route 
            path="/dashboard" 
            element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} 
          />
          
          {/* Catch-all: Redirect any unknown URLs to the login page */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;