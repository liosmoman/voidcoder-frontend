// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { AuthProvider } from './AuthContext'; // Path updated // <--- IMPORT AuthProvider

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider> {/* <--- WRAP App with AuthProvider */}
      <App />
    </AuthProvider>
  </React.StrictMode>
);