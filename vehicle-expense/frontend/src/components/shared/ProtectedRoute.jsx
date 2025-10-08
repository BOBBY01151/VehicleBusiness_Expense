import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Navigate } from 'react-router-dom'
import { getProfile } from '../../store/slices/authSlice'

const ProtectedRoute = ({ children }) => {
  const dispatch = useDispatch()
  const { isAuthenticated, user, token } = useSelector((state) => state.auth)

  useEffect(() => {
    if (token && !user) {
      dispatch(getProfile())
    }
  }, [dispatch, token, user])

  if (!token) {
    return <Navigate to="/login" replace />
  }

  if (!isAuthenticated && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return children
}

export default ProtectedRoute
