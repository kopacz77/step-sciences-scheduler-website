import React from 'react';
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';
import App from './App';
import AdminApp from './components/AdminApp';

const AppRouter = () => {
  // Check if current path is admin
  const isAdminRoute = window.location.pathname.startsWith('/admin');

  return (
    <Router>
      <Routes>
        {/* Admin Routes */}
        <Route path="/admin/*" element={<AdminApp />} />

        {/* Public Routes */}
        <Route path="/" element={<App />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
