import { configureStore } from '@reduxjs/toolkit'
import authSlice from './slices/authSlice'
import exporterSlice from './slices/exporterSlice'
import expenseSlice from './slices/expenseSlice'

export const store = configureStore({
  reducer: {
    auth: authSlice,
    exporter: exporterSlice,
    expense: expenseSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
})
