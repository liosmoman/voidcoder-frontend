// src/context/AuthContext.js
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authToken, setAuthToken] = useState(null);
  const [currentUser, setCurrentUser] = useState(null); // Will store { id, email, given_name }

  // Check for existing token in localStorage on initial load
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000; // in seconds

        if (decodedToken.exp > currentTime) {
          setAuthToken(token);
          setIsLoggedIn(true);
          setCurrentUser({ 
            id: decodedToken.sub, // Assuming 'sub' is user ID from your backend
            email: decodedToken.email, 
            given_name: decodedToken.given_name 
          });
         // console.log("AuthContext: User restored from localStorage:", { id: decodedToken.sub, email: decodedToken.email, given_name: decodedToken.given_name });
        } else {
          // Token expired
          localStorage.removeItem('authToken');
          console.warn("AuthContext: Auth token expired, removed from storage.");
        }
      } catch (error) {
        console.error("AuthContext: Error decoding token on initial load:", error);
        localStorage.removeItem('authToken'); // Remove invalid token
      }
    }
  }, []); // Empty dependency array ensures this runs only once on mount

  const login = useCallback((token) => {
    try {
      const decodedToken = jwtDecode(token);
      localStorage.setItem('authToken', token);
      setAuthToken(token);
      setIsLoggedIn(true);
      setCurrentUser({ 
        id: decodedToken.sub,
        email: decodedToken.email,
        given_name: decodedToken.given_name
      });
      // console.log("AuthContext: User logged in, token stored, user set:", { id: decodedToken.sub, email: decodedToken.email, given_name: decodedToken.given_name });
    } catch (error) {
      console.error("AuthContext: Error decoding token on login:", error);
      // Reset auth state on error
      localStorage.removeItem('authToken');
      setAuthToken(null);
      setIsLoggedIn(false);
      setCurrentUser(null);
    }
  }, []); // Empty dependency array as setters from useState are stable

  const logout = useCallback(() => {
    localStorage.removeItem('authToken');
    setAuthToken(null);
    setIsLoggedIn(false);
    setCurrentUser(null);
   // console.log("AuthContext: User logged out, token removed.");
    // Navigation can be handled by the component calling logout
  }, []); // Empty dependency array

  return (
    <AuthContext.Provider value={{ isLoggedIn, authToken, currentUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = () => {
  return useContext(AuthContext);
};