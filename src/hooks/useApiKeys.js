'use client';

import { useState, useEffect } from 'react';
import { apiKeyService } from '@/lib/api';

export const useApiKeys = () => {
  const [apiKeys, setApiKeys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load API keys from the database
  const loadApiKeys = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiKeyService.getAll();
      setApiKeys(data);
    } catch (err) {
      console.error('Error loading API keys:', err);
      setError('Failed to load API keys');
    } finally {
      setLoading(false);
    }
  };

  // Create new API key
  const createApiKey = async (keyData) => {
    try {
      setError(null);
      await apiKeyService.create(keyData);
      await loadApiKeys(); // Reload the list
      return { success: true };
    } catch (err) {
      console.error('Error creating API key:', err);
      setError('Failed to create API key');
      return { success: false, error: 'Failed to create API key' };
    }
  };

  // Update existing API key
  const updateApiKey = async (id, updateData) => {
    try {
      setError(null);
      await apiKeyService.update(id, updateData);
      await loadApiKeys(); // Reload the list
      return { success: true };
    } catch (err) {
      console.error('Error updating API key:', err);
      setError('Failed to update API key');
      return { success: false, error: 'Failed to update API key' };
    }
  };

  // Delete API key
  const deleteApiKey = async (id) => {
    try {
      setError(null);
      await apiKeyService.delete(id);
      await loadApiKeys(); // Reload the list
      return { success: true };
    } catch (err) {
      console.error('Error deleting API key:', err);
      setError('Failed to delete API key');
      return { success: false, error: 'Failed to delete API key' };
    }
  };

  // Clear error
  const clearError = () => {
    setError(null);
  };

  // Load API keys on mount
  useEffect(() => {
    loadApiKeys();
  }, []);

  return {
    apiKeys,
    loading,
    error,
    createApiKey,
    updateApiKey,
    deleteApiKey,
    clearError,
    loadApiKeys
  };
};
