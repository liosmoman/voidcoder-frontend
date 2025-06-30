// src/LandingPage.js
import React from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Added Link
import { SparklesIcon } from '@heroicons/react/24/solid';

function LandingPage() {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    // Option 1: Navigate directly to dashboard (user might not be logged in)
    // navigate('/dashboard'); 

    // Option 2: Redirect to Google Login, then backend callback handles redirect to dashboard
    window.location.href = 'http://127.0.0.1:8000/api/v1/auth/login/google';
  };

  return (
    <div className="min-h-screen bg-nimbus-sidebar-gradient text-nimbus-sidebar-text flex flex-col items-center justify-center p-8 sm:p-12 text-center">
      <div className="mb-12">
        <Link to="/" className="text-4xl sm:text-5xl font-bold text-white hover:opacity-80 transition-opacity flex items-center justify-center">
          <SparklesIcon className="h-10 w-10 sm:h-12 sm:w-12 mr-3 text-nimbus-primary-accent" />
          VoidCoder
        </Link>
      </div>

      <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight text-white">
        Create Powerful Prompts for AI Coding Tools
      </h1>
      <p className="text-lg sm:text-xl text-slate-200 mb-10 max-w-3xl">
        Inspired by directness and sleekness, VoidCoder helps you translate UI designs into actionable prompts, accelerating your AI-assisted development.
      </p>
      
      <div className="flex space-x-4"> {/* Container for buttons */}
        <button 
          onClick={handleGetStarted} // This will now initiate Google Login
          className="bg-nimbus-primary-accent hover:opacity-80 text-white font-bold py-3 sm:py-4 px-8 sm:px-10 rounded-lg text-lg sm:text-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-nimbus-primary-accent focus:ring-opacity-50"
        >
          Get Started with Google
        </button>
        {/* You could have another button that navigates to /dashboard if they are already logged in,
            or if you want to allow dashboard access without immediate login for some features.
            For now, "Get Started" directly initiates Google login. */}
      </div>

      <footer className="absolute bottom-8 text-center w-full">
        <p className="text-xs text-slate-300">
          © {new Date().getFullYear()} VoidCoder. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
export default LandingPage;