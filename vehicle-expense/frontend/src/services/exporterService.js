import api from './api'

const exporterService = {
  // Get exporter profile
  getProfile: async () => {
    const response = await api.get('/exporters/profile')
    return response.data
  },

  // Update exporter profile
  updateProfile: async (profileData) => {
    const response = await api.put('/exporters/profile', profileData)
    return response.data
  },

  // Get exporter statistics
  getStatistics: async () => {
    const response = await api.get('/exporters/statistics')
    return response.data
  },

  // Upload document
  uploadDocument: async (documentType, url) => {
    const response = await api.post('/exporters/documents', {
      documentType,
      url
    })
    return response.data
  },

  // Get public exporters
  getPublicExporters: async () => {
    const response = await api.get('/exporters/public')
    return response.data
  }
}

export default exporterService
