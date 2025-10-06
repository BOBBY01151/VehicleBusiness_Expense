import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import exporterService from '../../services/exporterService'

// Async thunks
export const getExporterProfile = createAsyncThunk(
  'exporter/getProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await exporterService.getProfile()
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch profile')
    }
  }
)

export const updateExporterProfile = createAsyncThunk(
  'exporter/updateProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      const response = await exporterService.updateProfile(profileData)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update profile')
    }
  }
)

export const getExporterStatistics = createAsyncThunk(
  'exporter/getStatistics',
  async (_, { rejectWithValue }) => {
    try {
      const response = await exporterService.getStatistics()
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch statistics')
    }
  }
)

export const uploadDocument = createAsyncThunk(
  'exporter/uploadDocument',
  async ({ documentType, url }, { rejectWithValue }) => {
    try {
      const response = await exporterService.uploadDocument(documentType, url)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to upload document')
    }
  }
)

export const getPublicExporters = createAsyncThunk(
  'exporter/getPublicExporters',
  async (_, { rejectWithValue }) => {
    try {
      const response = await exporterService.getPublicExporters()
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch exporters')
    }
  }
)

const initialState = {
  profile: null,
  statistics: null,
  publicExporters: [],
  isLoading: false,
  error: null,
}

const exporterSlice = createSlice({
  name: 'exporter',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    clearProfile: (state) => {
      state.profile = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Profile
      .addCase(getExporterProfile.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(getExporterProfile.fulfilled, (state, action) => {
        state.isLoading = false
        state.profile = action.payload.exporter
      })
      .addCase(getExporterProfile.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      
      // Update Profile
      .addCase(updateExporterProfile.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(updateExporterProfile.fulfilled, (state, action) => {
        state.isLoading = false
        state.profile = action.payload.exporter
      })
      .addCase(updateExporterProfile.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      
      // Get Statistics
      .addCase(getExporterStatistics.fulfilled, (state, action) => {
        state.statistics = action.payload.statistics
      })
      
      // Upload Document
      .addCase(uploadDocument.fulfilled, (state, action) => {
        state.profile = action.payload.exporter
      })
      
      // Get Public Exporters
      .addCase(getPublicExporters.fulfilled, (state, action) => {
        state.publicExporters = action.payload.exporters
      })
  },
})

export const { clearError, clearProfile } = exporterSlice.actions
export default exporterSlice.reducer
