// Example ProtectedRoute.js
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthContext'; // Assuming AuthContext is in src/

const ProtectedRoute = () => {
  const { isLoggedIn } = useAuth();
  if (!isLoggedIn && localStorage.getItem('authToken') === null) { // Double check localStorage for persistence
    return <Navigate to="/" replace />;
  }
  return <Outlet />; // Renders the child route (DashboardPage or HistoryPage)
};
export default ProtectedRoute;

// App.js
// ...
// <Routes>
//   <Route path="/" element={<LandingPage />} />
//   <Route element={<ProtectedRoute />}> {/* Wrap protected routes */}
//     <Route path="/dashboard" element={<DashboardPage />} />
//     <Route path="/history" element={<HistoryPage />} />
//   </Route>
//   <Route path="/auth/callback" element={<AuthCallback />} />
// </Routes>
// ...