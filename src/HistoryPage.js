// src/HistoryPage.js
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getHistory } from './apiService';
import { useAuth } from './AuthContext';
import Sidebar from './Sidebar';
import { Bars3Icon, SparklesIcon } from '@heroicons/react/24/outline'; // Import SparklesIcon
import toast from 'react-hot-toast';

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    return new Date(dateString).toLocaleString(undefined, { 
      year: 'numeric', month: 'short', day: 'numeric', 
      hour: '2-digit', minute: '2-digit' 
    });
  } catch (e) {
    console.error("Error formatting date:", e);
    return dateString;
  }
};

function HistoryPage() {
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedSession, setSelectedSession] = useState(null);
  const [copiedStates, setCopiedStates] = useState({});
  const [sidebarOpen, setSidebarOpen] = useState(false); // For mobile sidebar

  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  useEffect(() => {
    if (!isLoggedIn) {
      setError("Please log in to view your history.");
      setIsLoading(false);
      setHistory([]); 
      return;
    }
    const fetchHistory = async () => {
      setIsLoading(true);
      setError('');
      setHistory([]); 
      try {
        const data = await getHistory();
        setHistory(data || []); 
      } catch (err) {
        const errorMessage = (err.data && err.data.detail) || err.message || 'Failed to fetch history.';
        setError(errorMessage);
        setHistory([]); 
      } finally {
        setIsLoading(false);
      }
    };
    fetchHistory();
  }, [isLoggedIn]);

  const handleViewDetails = (session) => {
    setSelectedSession(session);
    setCopiedStates({}); 
  };

  const closeDetailsModal = () => {
    setSelectedSession(null);
  };

  const handleCopyModalPrompt = (textToCopy, key) => {
    navigator.clipboard.writeText(textToCopy)
    .then(() => {
      toast.success('Prompt copied!');
      setCopiedStates(prev => ({ ...prev, [key]: true }));
      setTimeout(() => {
        setCopiedStates(prev => ({ ...prev, [key]: false }));
      }, 1500);
    })
    .catch(err => {
      toast.error('Failed to copy.');
      console.error('Failed to copy text: ', err);
    });
  };

  let modalConsolidatedPromptText = '';
  if (selectedSession && selectedSession.generated_prompts && selectedSession.generated_prompts.length > 0) {
    modalConsolidatedPromptText = selectedSession.generated_prompts
      .map(p => `<!-- ${p.prompt_type.replace(/_/g, ' ').toUpperCase()} -->\n${p.prompt_text}\n\n`)
      .join('')
      .trim();
  }

  if (!isLoggedIn && !isLoading) { 
    return ( 
      <div className="flex h-screen bg-nimbus-main-bg">
        <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
        <div className={`flex-1 flex flex-col overflow-hidden md:pl-64 transition-all duration-300 ease-in-out`}>
          <header className="bg-nimbus-card-bg text-nimbus-text-dark shadow-md p-4 sticky top-0 z-10 border-b border-slate-200 flex items-center">
            <button onClick={toggleSidebar} className="md:hidden text-nimbus-text-dark mr-4 p-1 rounded hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-nimbus-primary-accent">
                <Bars3Icon className="h-6 w-6" />
            </button>
            <h1 className="text-xl font-semibold">Prompt History</h1>
          </header>
          <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 sm:p-6 flex items-center justify-center">
            <div className="text-center p-6 sm:p-10 bg-nimbus-card-bg rounded-lg shadow-xl max-w-md">
              <h2 className="text-xl sm:text-2xl font-semibold text-nimbus-text-dark mb-4">Access Denied</h2>
              <p className="text-nimbus-text-medium mb-6 text-sm sm:text-base">{error || "Please log in to view your history."}</p>
              <button
                onClick={() => window.location.href = 'http://127.0.0.1:8000/api/v1/auth/login/google'}
                className="bg-nimbus-primary-accent hover:opacity-90 text-white font-semibold py-2 px-6 rounded-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-nimbus-primary-accent focus:ring-opacity-50 text-sm sm:text-base"
              >
                Sign in with Google
              </button>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-nimbus-main-bg overflow-hidden">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <div className={`flex-1 flex flex-col overflow-hidden md:pl-64 transition-all duration-300 ease-in-out`}>
        <header className="bg-nimbus-card-bg text-nimbus-text-dark shadow-md p-4 sticky top-0 z-10 border-b border-slate-200 flex items-center">
            <button onClick={toggleSidebar} className="md:hidden text-nimbus-text-dark mr-4 p-1 rounded hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-nimbus-primary-accent">
                <Bars3Icon className="h-6 w-6" />
            </button>
            <h1 className="text-xl font-semibold">Prompt History</h1>
        </header>
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 sm:p-6">
          <div className="container mx-auto">
            {isLoading && (
                <div className="text-center py-10 flex justify-center items-center space-x-2 text-nimbus-text-medium">
                    <svg className="animate-spin h-6 w-6 text-nimbus-primary-accent" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Loading history...</span>
                </div>
            )}
            {error && !isLoading && (
              <div className="my-6 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded-r-md text-sm">
                <p><strong>Error:</strong> {error}</p>
              </div>
            )}
            {!isLoading && !error && history.length === 0 && (
              <div className="text-center py-10 bg-nimbus-card-bg rounded-lg shadow-lg mt-6">
                <h3 className="text-xl font-semibold text-nimbus-text-dark mb-2">No History Found</h3>
                <p className="text-nimbus-text-medium">You haven't analyzed any images yet.</p>
                <button 
                    onClick={() => navigate('/dashboard')}
                    className="mt-4 bg-nimbus-primary-accent hover:opacity-90 text-white font-semibold py-2 px-4 rounded-md transition duration-200"
                >
                    Analyze Your First Image
                </button>
              </div>
            )}
            {!isLoading && !error && history.length > 0 && (
              <div className="space-y-4">
                {history.map((session) => (
                  <div key={session.id} className="bg-nimbus-card-bg p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                      <div className="mb-3 sm:mb-0 sm:mr-4 flex-grow">
                        <h3 className="text-md sm:text-lg font-semibold text-nimbus-primary-accent">{session.session_name || `Session ${session.id}`}</h3>
                        <p className="text-xs text-nimbus-text-light mt-1">
                          Analyzed: {session.image_filename || 'N/A'}
                        </p>
                        <p className="text-xs text-nimbus-text-light mt-0.5"> 
                          Created: {formatDate(session.created_at)}
                        </p>
                      </div>
                      <button 
                        onClick={() => handleViewDetails(session)}
                        className="bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold py-1.5 px-4 rounded-md transition self-start sm:self-center flex-shrink-0"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>

        {selectedSession && (
          <div className="fixed inset-0 bg-black bg-opacity-75 backdrop-blur-sm flex items-center justify-center z-40 p-2 sm:p-4 transition-opacity duration-300 ease-in-out">
            <div className="bg-nimbus-card-bg p-4 sm:p-6 rounded-lg shadow-2xl w-full max-w-xs sm:max-w-md md:max-w-2xl max-h-[90vh] flex flex-col">
              <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-200 flex-shrink-0">
                <h2 className="text-lg sm:text-xl font-semibold text-nimbus-text-dark">
                  Session: {selectedSession.session_name || `ID ${selectedSession.id}`}
                </h2>
                <button onClick={closeDetailsModal} className="text-slate-400 hover:text-slate-600 text-3xl leading-none p-1 focus:outline-none">×</button>
              </div>
              <div className="flex-grow overflow-y-auto scrollbar-thin scrollbar-thumb-slate-400 hover:scrollbar-thumb-slate-500 pr-2 space-y-4 text-xs sm:text-sm">
                <div>
                  <p className="text-slate-600 mb-1"><strong>Image:</strong> {selectedSession.image_filename}</p>
                  <p className="text-slate-600 mb-4"><strong>Created:</strong> {formatDate(selectedSession.created_at)}</p>
                </div>
                {modalConsolidatedPromptText ? (
                   <div className="my-4 p-3 bg-sky-50 border border-sky-200 rounded-lg shadow-sm">
                    <strong className="block mb-1 text-sky-700 font-semibold">Consolidated Prompt:</strong>
                    <pre className="bg-white p-2 border border-slate-300 rounded whitespace-pre-wrap break-words max-h-48 sm:max-h-60 overflow-y-auto">
                      {modalConsolidatedPromptText}
                    </pre>
                    <button 
                      onClick={() => handleCopyModalPrompt(modalConsolidatedPromptText, `modal-consolidated-${selectedSession.id}`)}
                      className="mt-2 px-3 py-1 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-sky-500"
                    >
                      {copiedStates[`modal-consolidated-${selectedSession.id}`] ? 'Copied!' : 'Copy Consolidated'}
                    </button>
                  </div>
                ) : ( <p className="text-slate-500">No consolidated prompt available.</p> )}
                
                {/* Individual Prompts and AI Analysis JSON are now HIDDEN by default */}
              </div>
              <div className="mt-auto pt-4 border-t border-slate-200 flex-shrink-0">
                <button 
                  onClick={closeDetailsModal} 
                  className="w-full bg-nimbus-primary-accent hover:opacity-90 text-white font-semibold py-2 px-4 rounded-md transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
export default HistoryPage;