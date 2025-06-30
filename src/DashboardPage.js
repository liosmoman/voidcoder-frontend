// src/DashboardPage.js
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from './AuthContext';
import Sidebar from './Sidebar';
import ImageUploader from './ImageUploader';
import { Bars3Icon, SparklesIcon } from '@heroicons/react/24/outline';

function DashboardPage() {
  const { isLoggedIn, currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen bg-nimbus-main-bg overflow-hidden">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      
      <div className={`flex-1 flex flex-col overflow-hidden md:pl-64 transition-all duration-300 ease-in-out`}>
        <header className="bg-nimbus-card-bg text-nimbus-text-dark shadow-md p-4 flex items-center justify-between sticky top-0 z-10 border-b border-slate-200">
          {/* Left Section */}
          <div className="flex items-center">
            <button 
              onClick={toggleSidebar} 
              className="md:hidden text-nimbus-text-dark mr-3 p-1 rounded hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-nimbus-primary-accent"
            >
              <Bars3Icon className="h-6 w-6" />
            </button>
            {/* Search Input - hidden on very small screens, visible on sm and up */}
            <div className="relative hidden sm:block">
              <input 
                  type="text" 
                  placeholder="Search..."
                  className="text-sm bg-nimbus-main-bg border border-slate-300 rounded-md py-2 pl-3 pr-4 
                             sm:w-48 md:w-64 lg:w-96 
                             focus:ring-nimbus-primary-accent focus:border-nimbus-primary-accent"
              />
            </div>
          </div>
          
          {/* Right Section: User Info / Auth Buttons */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {isLoggedIn && currentUser ? (
              <>
                <span className="text-sm font-medium text-nimbus-text-dark self-center hidden sm:block">
                  Welcome, {currentUser.given_name || 'User'}
                </span>
                <button 
                  onClick={handleLogout}
                  className="text-xs sm:text-sm bg-red-500 hover:bg-red-600 text-white font-semibold py-1.5 px-2 sm:py-2 sm:px-3 rounded-md transition duration-200"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <a 
                href='http://127.0.0.1:8000/api/v1/auth/login/google'
                className="bg-nimbus-primary-accent hover:opacity-90 text-white text-xs sm:text-sm font-semibold py-2 px-3 sm:px-4 rounded-md transition duration-200"
              >
                Sign in with Google
              </a>
            )}
          </div>
        </header>

        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 sm:p-6">
          <div className="container mx-auto">
            {isLoggedIn ? (
              <>
                <div className="mb-6">
                  <h2 className="text-3xl font-semibold text-nimbus-text-dark">Dashboard</h2>
                </div>
                <ImageUploader />
              </>
            ) : (
              <div className="text-center p-10 bg-nimbus-card-bg rounded-lg shadow mt-10">
                <h2 className="text-2xl font-semibold text-nimbus-text-dark mb-4">Please sign in</h2>
                <p className="text-nimbus-text-medium">Sign in to upload images, generate prompts, and view your history.</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
export default DashboardPage;