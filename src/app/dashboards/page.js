'use client';

import { useState } from 'react';
import { useApiKeys } from '@/hooks/useApiKeys';
import { useNotification } from '@/hooks/useNotification';
import Notification from '@/components/Notification';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import ErrorMessage from '@/components/dashboard/ErrorMessage';
import StatsCards from '@/components/dashboard/StatsCards';
import ApiKeyForm from '@/components/dashboard/ApiKeyForm';
import DeleteConfirmationModal from '@/components/dashboard/DeleteConfirmationModal';
import ApiKeysList from '@/components/dashboard/ApiKeysList';

export default function Dashboard() {
  // Custom hooks for state management
  const { 
    apiKeys, 
    loading, 
    error, 
    createApiKey, 
    updateApiKey, 
    deleteApiKey, 
    clearError 
  } = useApiKeys();
  
  const { 
    notification, 
    showSuccess, 
    showError, 
    hideNotification 
  } = useNotification();

  // Local state for UI
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [keyToDelete, setKeyToDelete] = useState(null);
  const [editingKey, setEditingKey] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Handle form submission (create/update)
  const handleFormSubmit = async (formData) => {
    try {
      setSubmitting(true);
      
      if (editingKey) {
        // Update existing key
        const updateData = {
          name: formData.name,
          description: formData.description,
          key: editingKey.key
        };
        const result = await updateApiKey(editingKey.id, updateData);
        
        if (result.success) {
          showSuccess('API Key updated successfully');
          setEditingKey(null);
          setShowModal(false);
        } else {
          showError(result.error);
        }
      } else {
        // Create new key
        const result = await createApiKey(formData);
        
        if (result.success) {
          showSuccess('API Key created successfully');
          setShowModal(false);
        } else {
          showError(result.error);
        }
      }
    } catch (err) {
      showError('An unexpected error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle edit action
  const handleEdit = (key) => {
    setEditingKey(key);
    setShowModal(true);
  };

  // Handle delete action
  const handleDelete = (key) => {
    setKeyToDelete(key);
    setShowDeleteModal(true);
  };

  // Handle delete confirmation
  const handleConfirmDelete = async () => {
    try {
      setSubmitting(true);
      const result = await deleteApiKey(keyToDelete.id);
      
      if (result.success) {
        showSuccess('API Key deleted successfully');
        setShowDeleteModal(false);
        setKeyToDelete(null);
      } else {
        showError(result.error);
      }
    } catch (err) {
      showError('An unexpected error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle copy action
  const handleCopy = () => {
    showSuccess('Copied API Key to clipboard');
  };

  // Handle modal close
  const handleCloseModal = () => {
    setShowModal(false);
    setEditingKey(null);
  };

  // Handle delete modal close
  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setKeyToDelete(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Notification
        isVisible={notification.show}
        message={notification.message}
        type={notification.type}
        onClose={hideNotification}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <DashboardHeader />
        
        <ErrorMessage error={error} onClear={clearError} />
        
        <StatsCards apiKeys={apiKeys} />

        {/* API Keys List Section */}
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

            <ApiKeysList
              apiKeys={apiKeys}
              loading={loading}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onCopy={handleCopy}
            />
          </div>
        </div>
      </div>

      {/* Modals */}
      <ApiKeyForm
        isOpen={showModal}
        onClose={handleCloseModal}
        onSubmit={handleFormSubmit}
        editingKey={editingKey}
        submitting={submitting}
      />

      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        keyToDelete={keyToDelete}
        onConfirm={handleConfirmDelete}
        onCancel={handleCloseDeleteModal}
        submitting={submitting}
      />
    </div>
  );
}
