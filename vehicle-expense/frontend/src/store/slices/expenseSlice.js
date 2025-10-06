import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import expenseService from '../../services/expenseService'

// Async thunks
export const createExpense = createAsyncThunk(
  'expense/createExpense',
  async (expenseData, { rejectWithValue }) => {
    try {
      const response = await expenseService.createExpense(expenseData)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create expense')
    }
  }
)

export const getExpenses = createAsyncThunk(
  'expense/getExpenses',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const response = await expenseService.getExpenses(filters)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch expenses')
    }
  }
)

export const getSharedExpenses = createAsyncThunk(
  'expense/getSharedExpenses',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const response = await expenseService.getSharedExpenses(filters)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch shared expenses')
    }
  }
)

export const getExpenseById = createAsyncThunk(
  'expense/getExpenseById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await expenseService.getExpenseById(id)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch expense')
    }
  }
)

export const updateExpense = createAsyncThunk(
  'expense/updateExpense',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await expenseService.updateExpense(id, data)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update expense')
    }
  }
)

export const deleteExpense = createAsyncThunk(
  'expense/deleteExpense',
  async (id, { rejectWithValue }) => {
    try {
      await expenseService.deleteExpense(id)
      return id
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete expense')
    }
  }
)

export const shareExpense = createAsyncThunk(
  'expense/shareExpense',
  async ({ id, userIds, notes }, { rejectWithValue }) => {
    try {
      const response = await expenseService.shareExpense(id, userIds, notes)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to share expense')
    }
  }
)

export const updateShareStatus = createAsyncThunk(
  'expense/updateShareStatus',
  async ({ id, userId, status, notes }, { rejectWithValue }) => {
    try {
      const response = await expenseService.updateShareStatus(id, userId, status, notes)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update share status')
    }
  }
)

export const getExpenseStatistics = createAsyncThunk(
  'expense/getExpenseStatistics',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const response = await expenseService.getStatistics(filters)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch statistics')
    }
  }
)

const initialState = {
  expenses: [],
  sharedExpenses: [],
  currentExpense: null,
  statistics: null,
  pagination: {
    current: 1,
    pages: 0,
    total: 0
  },
  isLoading: false,
  error: null,
}

const expenseSlice = createSlice({
  name: 'expense',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    clearCurrentExpense: (state) => {
      state.currentExpense = null
    },
    setCurrentExpense: (state, action) => {
      state.currentExpense = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Expense
      .addCase(createExpense.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(createExpense.fulfilled, (state, action) => {
        state.isLoading = false
        state.expenses.unshift(action.payload.expense)
      })
      .addCase(createExpense.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      
      // Get Expenses
      .addCase(getExpenses.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(getExpenses.fulfilled, (state, action) => {
        state.isLoading = false
        state.expenses = action.payload.expenses
        state.pagination = action.payload.pagination
      })
      .addCase(getExpenses.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      
      // Get Shared Expenses
      .addCase(getSharedExpenses.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(getSharedExpenses.fulfilled, (state, action) => {
        state.isLoading = false
        state.sharedExpenses = action.payload.expenses
        state.pagination = action.payload.pagination
      })
      .addCase(getSharedExpenses.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      
      // Get Expense by ID
      .addCase(getExpenseById.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(getExpenseById.fulfilled, (state, action) => {
        state.isLoading = false
        state.currentExpense = action.payload.expense
      })
      .addCase(getExpenseById.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      
      // Update Expense
      .addCase(updateExpense.fulfilled, (state, action) => {
        const index = state.expenses.findIndex(expense => expense._id === action.payload.expense._id)
        if (index !== -1) {
          state.expenses[index] = action.payload.expense
        }
        if (state.currentExpense && state.currentExpense._id === action.payload.expense._id) {
          state.currentExpense = action.payload.expense
        }
      })
      
      // Delete Expense
      .addCase(deleteExpense.fulfilled, (state, action) => {
        state.expenses = state.expenses.filter(expense => expense._id !== action.payload)
        if (state.currentExpense && state.currentExpense._id === action.payload) {
          state.currentExpense = null
        }
      })
      
      // Share Expense
      .addCase(shareExpense.fulfilled, (state, action) => {
        const index = state.expenses.findIndex(expense => expense._id === action.payload.expense._id)
        if (index !== -1) {
          state.expenses[index] = action.payload.expense
        }
      })
      
      // Update Share Status
      .addCase(updateShareStatus.fulfilled, (state, action) => {
        const index = state.sharedExpenses.findIndex(expense => expense._id === action.payload.expense._id)
        if (index !== -1) {
          state.sharedExpenses[index] = action.payload.expense
        }
      })
      
      // Get Statistics
      .addCase(getExpenseStatistics.fulfilled, (state, action) => {
        state.statistics = action.payload.statistics
      })
  },
})

export const { clearError, clearCurrentExpense, setCurrentExpense } = expenseSlice.actions
export default expenseSlice.reducer
