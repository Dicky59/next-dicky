'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Dashboard() {
  const [apiKeys, setApiKeys] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [keyToDelete, setKeyToDelete] = useState(null);
  const [editingKey, setEditingKey] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });

  // Initialize with some sample data
  useEffect(() => {
    const sampleKeys = [
      {
        id: 1,
        name: 'Production API',
        key: 'pk_live_4KYB3JQ2C8H9M6N5L7X1Z9',
        description: 'API key for production environment',
        permissions: 'full',
        created: '2024-01-15',
        lastUsed: '2024-01-20'
      },
      {
        id: 2,
        name: 'Development API',
        key: 'pk_test_A2B4C6D8E1F3G5H7I9J0K2',
        description: 'API key for development and testing',
        permissions: 'read',
        created: '2024-01-10',
        lastUsed: '2024-01-19'
      }
    ];
    setApiKeys(sampleKeys);
  }, []);

  const generateApiKey = () => {
    const prefix = 'pk_';
    const randomPart = Math.random().toString(36).substring(2, 15) + 
                      Math.random().toString(36).substring(2, 15);
    return prefix + randomPart.toUpperCase();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingKey) {
      // Update existing key
      setApiKeys(prev => prev.map(key => 
        key.id === editingKey.id 
          ? { ...key, ...formData, key: editingKey.key }
          : key
      ));
      setEditingKey(null);
    } else {
      // Create new key
      const newKey = {
        id: Date.now(),
        ...formData,
        key: generateApiKey(),
        permissions: 'read',
        created: new Date().toISOString().split('T')[0],
        lastUsed: 'Never'
      };
      setApiKeys(prev => [...prev, newKey]);
    }
    
    setFormData({ name: '', description: '' });
    setShowModal(false);
  };

  const handleEdit = (key) => {
    setEditingKey(key);
    setFormData({
      name: key.name,
      description: key.description
    });
    setShowModal(true);
  };

  const handleDelete = (key) => {
    setKeyToDelete(key);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    setApiKeys(prev => prev.filter(key => key.id !== keyToDelete.id));
    setShowDeleteModal(false);
    setKeyToDelete(null);
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setKeyToDelete(null);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  const resetForm = () => {
    setFormData({ name: '', description: '' });
    setEditingKey(null);
    setShowModal(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                API Keys Dashboard
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Manage your API keys and control access to your application
              </p>
            </div>
            <Link
              href="/"
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
            >
              ← Back to Home
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v2H2v-4l4.257-4.257A6 6 0 1118 8zm-6-2a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                      Total API Keys
                    </dt>
                    <dd className="text-lg font-medium text-gray-900 dark:text-white">
                      {apiKeys.length}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                      Active Keys
                    </dt>
                    <dd className="text-lg font-medium text-gray-900 dark:text-white">
                      {apiKeys.filter(key => key.lastUsed !== 'Never').length}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                      Full Access Keys
                    </dt>
                    <dd className="text-lg font-medium text-gray-900 dark:text-white">
                      {apiKeys.filter(key => key.permissions === 'full').length}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 overflow-y-auto h-full w-full z-50 flex items-start justify-center pt-20" onClick={resetForm}>
            <div className="relative p-4 border w-80 shadow-xl rounded-lg bg-white dark:bg-gray-800" onClick={(e) => e.stopPropagation()}>
              <div className="mt-3">
                <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-4">
                  {editingKey ? 'Edit API Key' : 'Create New API Key'}
                </h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {editingKey && (
                    <div>
                      <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        API Key
                      </label>
                      <div className="mt-1 flex items-center space-x-2">
                        <input
                          type="text"
                          id="apiKey"
                          value={editingKey.key}
                          onChange={(e) => setEditingKey(prev => ({ ...prev, key: e.target.value }))}
                          className="flex-1 px-3 py-2 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white font-mono text-sm"
                        />
                        <button
                          type="button"
                          onClick={() => copyToClipboard(editingKey.key)}
                          className="inline-flex items-center px-2 py-2 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  )}
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white px-3 py-2"
                      placeholder="Enter API key name"
                    />
                  </div>
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Description
                    </label>
                    <textarea
                      id="description"
                      rows={3}
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white px-3 py-2"
                      placeholder="Enter description (optional)"
                    />
                  </div>
                  <div className="flex space-x-3 pt-4">
                    <button
                      type="submit"
                      className="flex-1 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      {editingKey ? 'Update Key' : 'Create Key'}
                    </button>
                    <button
                      type="button"
                      onClick={resetForm}
                      className="flex-1 inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 overflow-y-auto h-full w-full z-50 flex items-start justify-center pt-20" onClick={cancelDelete}>
            <div className="relative p-4 border w-80 shadow-xl rounded-lg bg-white dark:bg-gray-800" onClick={(e) => e.stopPropagation()}>
              <div className="mt-3 text-center">
                <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-4">
                  Delete API Key
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                  Are you sure you want to delete {keyToDelete?.name}? This action cannot be undone.
                </p>
                <div className="flex space-x-3">
                  <button
                    onClick={confirmDelete}
                    className="flex-1 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    Delete
                  </button>
                  <button
                    onClick={cancelDelete}
                    className="flex-1 inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* API Keys List */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                API Keys
              </h3>
              <button
                onClick={() => setShowModal(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                New API Key
              </button>
            </div>

            {apiKeys.length === 0 ? (
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 16.5a6 6 0 01-7.743-5.743M15 7a2 2 0 00-2 2m2-2a2 2 0 00-2-2M9 5a2 2 0 012 2m-2-2a2 2 0 00-2 2m2 2L7 9m2 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6m2-2a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No API keys</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Get started by creating a new API key.</p>
              </div>
            ) : (
              <div className="overflow-hidden">
                <div className="space-y-4">
                  {apiKeys.map((key) => (
                    <div key={key.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                              {key.name}
                            </h4>
                          </div>
                          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            {key.description}
                          </p>
                          <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                            <span>Created: {key.created}</span>
                            <span>Last used: {key.lastUsed}</span>
                          </div>
                          <div className="mt-3 flex items-center space-x-2">
                            <code className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-sm rounded font-mono">
                              {key.key}
                            </code>
                            <button
                              onClick={() => copyToClipboard(key.key)}
                              className="inline-flex items-center px-2 py-1 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
                            >
                              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                              </svg>
                              Copy
                            </button>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleEdit(key)}
                            className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(key)}
                            className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
