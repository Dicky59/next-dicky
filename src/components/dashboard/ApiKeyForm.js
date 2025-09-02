'use client';

import { useState, useEffect } from 'react';
import { copyToClipboard } from '@/utils/clipboard';

const ApiKeyForm = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  editingKey, 
  submitting 
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });

  // Update form data when editingKey changes
  useEffect(() => {
    if (editingKey) {
      setFormData({
        name: editingKey.name || '',
        description: editingKey.description || ''
      });
    } else {
      setFormData({
        name: '',
        description: ''
      });
    }
  }, [editingKey]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleClose = () => {
    setFormData({ name: '', description: '' });
    onClose();
  };

  const handleCopyKey = async () => {
    if (editingKey?.key) {
      const result = await copyToClipboard(editingKey.key);
      if (result.success) {
        // You can add a notification here if needed
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 overflow-y-auto h-full w-full z-50 flex items-start justify-center pt-20" onClick={handleClose}>
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
                    readOnly
                    className="flex-1 px-3 py-2 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white font-mono text-sm"
                  />
                  <button
                    type="button"
                    onClick={handleCopyKey}
                    className="inline-flex items-center px-2 py-2 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
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
                disabled={submitting}
                className="flex-1 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {editingKey ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  editingKey ? 'Update Key' : 'Create Key'
                )}
              </button>
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ApiKeyForm;
