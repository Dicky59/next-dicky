'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Notification from '../../components/Notification';
import Sidebar from '../../components/dashboard/Sidebar';

export default function ProtectedPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const router = useRouter();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const checkAuthStatus = useCallback(async () => {
    try {
      // Get the stored API key from session storage
      const storedApiKey = sessionStorage.getItem('apiKey');
      
      if (!storedApiKey) {
        router.push('/playground');
        return;
      }

      const response = await fetch(`/api/check-auth?apiKey=${encodeURIComponent(storedApiKey)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUserData(data);
        setNotification({
          show: true,
          message: 'Welcome to the protected area!',
          type: 'success'
        });
      } else {
        // Redirect to playground if not authenticated
        router.push('/playground');
        return;
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      router.push('/playground');
      return;
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  useEffect(() => {
    // Check if user has valid session/API key
    checkAuthStatus();
  }, [checkAuthStatus]);

  const closeNotification = () => {
    setNotification({ show: false, message: '', type: 'success' });
  };

  const handleLogout = () => {
    // Clear any stored auth data
    localStorage.removeItem('apiKey');
    sessionStorage.removeItem('apiKey');
    
    setNotification({
      show: true,
      message: 'Logged out successfully',
      type: 'success'
    });
    
    setTimeout(() => {
      router.push('/playground');
    }, 1500);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading protected content...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      <Notification
        isVisible={notification.show}
        message={notification.message}
        type={notification.type}
        onClose={closeNotification}
        duration={4000}
      />
      
      {/* Sidebar */}
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
        onToggle={toggleSidebar}
      />
      
      {/* Backdrop for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : ''}`}>
        {/* Mobile menu button */}
        <div className="lg:hidden fixed top-4 left-4 z-40">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-md bg-gray-800 text-white hover:bg-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
        
        {/* Desktop toggle button integrated with header */}
        {!sidebarOpen && (
          <div className="hidden lg:flex items-center mb-6 mt-8">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-md bg-gray-800 text-white hover:bg-gray-700 transition-colors shadow-lg ml-8"
              title="Show Sidebar"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        )}
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Protected Area
                </h1>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                  You have successfully authenticated with a valid API key
                </p>
              </div>
              <button
                onClick={() => router.push('/playground')}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
              >
                ← Back to Playground
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg mb-6">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Welcome!</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                This is a protected area that can only be accessed with a valid API key. 
                You have successfully authenticated and can now access exclusive content.
              </p>
              
              {userData && (
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-4">
                  <h3 className="font-medium text-gray-900 dark:text-white mb-2">API Key Information:</h3>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    <p><strong>Status:</strong> <span className="text-green-600 dark:text-green-400">Valid</span></p>
                    <p><strong>Key Name:</strong> {userData.apiKeyName || 'Unnamed Key'}</p>
                    <p><strong>Description:</strong> {userData.description || 'No description'}</p>
                    <p><strong>Access Level:</strong> Full</p>
                    <p><strong>Last Validated:</strong> {new Date().toLocaleString()}</p>
                    {userData.lastUsed && (
                      <p><strong>Last Used:</strong> {new Date(userData.lastUsed).toLocaleString()}</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
              <div className="text-blue-600 dark:text-blue-400 mb-3">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">API Endpoints</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Access to all available API endpoints and documentation.</p>
            </div>

            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
              <div className="text-green-600 dark:text-green-400 mb-3">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h3a2 2 0 012 2v14a2 2 0 01-2 2h-3a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Analytics</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">View detailed analytics and usage statistics.</p>
            </div>

            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
              <div className="text-purple-600 dark:text-purple-400 mb-3">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826-3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Settings</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Manage your account settings and preferences.</p>
            </div>
          </div>

          {/* Logout Button */}
          <div className="text-center">
            <button
              onClick={handleLogout}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
