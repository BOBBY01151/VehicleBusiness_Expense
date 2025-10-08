import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Toaster } from 'react-hot-toast'

// Components
import Layout from './components/shared/Layout'
import ProtectedRoute from './components/shared/ProtectedRoute'

// Auth Components
import Login from './components/auth/Login'
import ExporterLogin from './components/auth/ExporterLogin'

// Exporter Routes
import ExporterDashboard from './features/exporter/ExporterDashboard'
import ExpenseCreate from './features/exporter/ExpenseCreate'
import ExporterExpenses from './features/exporter/ExporterExpenses'

// Sri Lanka Routes
import SLDashboard from './features/srilanka/SLDashboard'
import SharedExpenses from './features/srilanka/SharedExpenses'

// Parts Routes
import PartsManagement from './features/parts/PartsManagement'

// Admin Routes
import AdminDashboard from './features/admin/AdminDashboard'
import FigmaAdminDashboard from './features/admin/FigmaAdminDashboard'

// Figma Dashboard
import { FigmaDashboard } from './components/figma/FigmaDashboard'

function App() {
  const { user, isAuthenticated } = useSelector((state) => state.auth)

  return (
    <div className="App">
      <Toaster position="top-right" />
      
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/exporter-login" element={<ExporterLogin />} />
        
        {/* UI Design Mode - Direct access for designers */}
        <Route path="/admin" element={<FigmaAdminDashboard />} />
        
        {/* Figma Dashboard - Premium UI Design */}
        <Route path="/figma-dashboard" element={<FigmaDashboard />} />
        
        {/* Protected Routes */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <Layout>
                <Routes>
                  {/* Exporter Routes - Direct access for UI designers */}
                  <Route path="/exporter" element={<ExporterDashboard />} />
                  <Route path="/exporter/expenses" element={<ExporterExpenses />} />
                  <Route path="/exporter/expenses/create" element={<ExpenseCreate />} />
                  <Route path="/exporter/parts" element={<PartsManagement />} />
                  
                  {/* Sri Lanka Routes - Direct access for UI designers */}
                  <Route path="/srilanka" element={<SLDashboard />} />
                  <Route path="/srilanka/expenses" element={<SharedExpenses />} />
                  
                  {/* Authenticated Exporter Routes */}
                  {user?.role === 'ROLE_EXPORTER' && (
                    <>
                      <Route path="/" element={<Navigate to="/exporter" replace />} />
                    </>
                  )}
                  
                  {/* Authenticated Sri Lanka Routes */}
                  {user?.role === 'ROLE_LOCAL' && (
                    <>
                      <Route path="/" element={<Navigate to="/srilanka" replace />} />
                    </>
                  )}
                  
                  {/* Old Admin Dashboard - Direct access without authentication */}
                  <Route path="/admin-old" element={<AdminDashboard />} />
                  
                  {/* Admin Routes with authentication */}
                  {user?.role === 'ROLE_ADMIN' && (
                    <>
                      <Route path="/" element={<Navigate to="/admin" replace />} />
                    </>
                  )}
                  
                  {/* Fallback */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </Layout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  )
}

export default App
