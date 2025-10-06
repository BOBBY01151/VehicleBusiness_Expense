import api from './api'

const authService = {
  // Login user
  login: async (email, password, role) => {
    const response = await api.post('/auth/login', {
      email,
      password,
      role
    })
    return response.data
  },

  // Register user
  register: async (userData) => {
    const response = await api.post('/auth/register', userData)
    return response.data
  },

  // Logout user
  logout: async () => {
    const response = await api.post('/auth/logout')
    return response.data
  },

  // Get user profile
  getProfile: async () => {
    const response = await api.get('/auth/profile')
    return response.data
  },

  // Refresh token
  refreshToken: async () => {
    const refreshToken = localStorage.getItem('refreshToken')
    const response = await api.post('/auth/refresh-token', { refreshToken })
    return response.data
  },

  // Get user sessions
  getSessions: async () => {
    const response = await api.get('/auth/sessions')
    return response.data
  },

  // Logout from all devices
  logoutAll: async () => {
    const response = await api.post('/auth/logout-all')
    return response.data
  }
}

export default authService
