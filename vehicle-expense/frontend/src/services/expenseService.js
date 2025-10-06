import api from './api'

const expenseService = {
  // Create expense
  createExpense: async (expenseData) => {
    const response = await api.post('/expenses', expenseData)
    return response.data
  },

  // Get expenses
  getExpenses: async (filters = {}) => {
    const params = new URLSearchParams(filters)
    const response = await api.get(`/expenses?${params}`)
    return response.data
  },

  // Get shared expenses
  getSharedExpenses: async (filters = {}) => {
    const params = new URLSearchParams(filters)
    const response = await api.get(`/expenses/shared/me?${params}`)
    return response.data
  },

  // Get expense by ID
  getExpenseById: async (id) => {
    const response = await api.get(`/expenses/${id}`)
    return response.data
  },

  // Update expense
  updateExpense: async (id, data) => {
    const response = await api.put(`/expenses/${id}`, data)
    return response.data
  },

  // Delete expense
  deleteExpense: async (id) => {
    const response = await api.delete(`/expenses/${id}`)
    return response.data
  },

  // Share expense
  shareExpense: async (id, userIds, notes) => {
    const response = await api.post(`/expenses/${id}/share`, {
      userIds,
      notes
    })
    return response.data
  },

  // Update share status
  updateShareStatus: async (id, userId, status, notes) => {
    const response = await api.put(`/expenses/${id}/share/${userId}`, {
      status,
      notes
    })
    return response.data
  },

  // Get statistics
  getStatistics: async (filters = {}) => {
    const params = new URLSearchParams(filters)
    const response = await api.get(`/expenses/statistics?${params}`)
    return response.data
  }
}

export default expenseService
