// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast'; // <--- IMPORT Toaster

import LandingPage from './LandingPage';
import DashboardPage from './DashboardPage';
import AuthCallback from './AuthCallback';
import HistoryPage from './HistoryPage';
import ProtectedRoute from './ProtectedRoute';

function App() {
  return (
    <Router>
      <Toaster // <--- ADD Toaster HERE (can be configured)
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          duration: 3000, // Default duration
          style: {
            background: '#363636', // Example style
            color: '#fff',
          },
          success: {
            duration: 2000,
            theme: {
              primary: 'green',
              secondary: 'black',
            },
          },
        }}
      />
      <Routes>
        {/* ... your routes ... */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/history" element={<HistoryPage />} />
        </Route>
      </Routes>
    </Router>
  );
}
export default App;