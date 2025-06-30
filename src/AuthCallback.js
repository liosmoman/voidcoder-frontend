// src/AuthCallback.js
import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext'; // Path updated // <--- IMPORT useAuth

function AuthCallback() {
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth(); // <--- GET login function from context

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get('token');

    if (token) {
     // console.log("AuthCallback: Received token:", token);
      login(token); // <--- USE THE LOGIN FUNCTION FROM CONTEXT
      navigate('/dashboard'); 
    } else {
      console.error("AuthCallback: No token found.");
      navigate('/'); // Or to a login error page
    }
  }, [location, navigate, login]); // <--- Add login to dependency array

  return (
    <div style={{ padding: '50px', textAlign: 'center' }}>
      <h2>Processing login...</h2>
      <p>Please wait while we redirect you.</p>
    </div>
  );
}

export default AuthCallback;