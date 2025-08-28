// API utility functions for API key management

export const apiKeyService = {
  // Get all API keys
  async getAll() {
    const response = await fetch('/api/api-keys')
    if (!response.ok) {
      throw new Error('Failed to fetch API keys')
    }
    return response.json()
  },

  // Create a new API key
  async create(apiKeyData) {
    const response = await fetch('/api/api-keys', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(apiKeyData),
    })
    
    if (!response.ok) {
      throw new Error('Failed to create API key')
    }
    return response.json()
  },

  // Update an API key
  async update(id, apiKeyData) {
    const response = await fetch(`/api/api-keys/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(apiKeyData),
    })
    
    if (!response.ok) {
      throw new Error('Failed to update API key')
    }
    return response.json()
  },

  // Delete an API key
  async delete(id) {
    const response = await fetch(`/api/api-keys/${id}`, {
      method: 'DELETE',
    })
    
    if (!response.ok) {
      throw new Error('Failed to delete API key')
    }
    return response.json()
  },
}
