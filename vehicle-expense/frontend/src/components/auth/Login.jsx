import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { Eye, EyeOff, Truck, User } from 'lucide-react'
import { login } from '../../store/slices/authSlice'
import toast from 'react-hot-toast'

const Login = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { isLoading, error } = useSelector((state) => state.auth)
  const [showPassword, setShowPassword] = useState(false)
  const [selectedRole, setSelectedRole] = useState('ROLE_LOCAL')

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue
  } = useForm()

  const onSubmit = async (data) => {
    try {
      const result = await dispatch(login({
        email: data.email,
        password: data.password,
        role: selectedRole
      })).unwrap()

      toast.success('Login successful!')
      
      // Navigate based on role
      if (result.user.role === 'ROLE_EXPORTER') {
        navigate('/exporter')
      } else if (result.user.role === 'ROLE_LOCAL') {
        navigate('/srilanka')
      } else if (result.user.role === 'ROLE_ADMIN') {
        navigate('/admin')
      }
    } catch (error) {
      toast.error(error || 'Login failed')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="bg-primary-600 p-3 rounded-full">
            <Truck className="h-8 w-8 text-white" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Vehicle Expense Management System
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {/* Role Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Select your role
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setSelectedRole('ROLE_LOCAL')}
                className={`p-3 border rounded-lg text-center transition-colors ${
                  selectedRole === 'ROLE_LOCAL'
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <User className="h-6 w-6 mx-auto mb-1" />
                <div className="text-sm font-medium">Sri Lanka User</div>
              </button>
              <button
                type="button"
                onClick={() => setSelectedRole('ROLE_EXPORTER')}
                className={`p-3 border rounded-lg text-center transition-colors ${
                  selectedRole === 'ROLE_EXPORTER'
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <Truck className="h-6 w-6 mx-auto mb-1" />
                <div className="text-sm font-medium">Japan Exporter</div>
              </button>
            </div>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1">
                <input
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: 'Invalid email address'
                    }
                  })}
                  type="email"
                  autoComplete="email"
                  className="input"
                  placeholder="Enter your email"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative">
                <input
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters'
                    }
                  })}
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  className="input pr-10"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>
          </form>

          {/* Developer Quick Login Buttons */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Developer Quick Login</span>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-2">
              <button
                type="button"
                onClick={async () => {
                  // Auto-login as Sri Lankan user
                  try {
                    const result = await dispatch(login({
                      email: 'srilanka@example.com',
                      password: 'password123',
                      role: 'ROLE_LOCAL'
                    })).unwrap();

                    toast.success('Logged in as Sri Lankan User!');
                    navigate('/srilanka');
                  } catch (error) {
                    toast.error('Auto-login failed. Please check if test users are seeded.');
                    console.error('Auto-login error:', error);
                  }
                }}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors"
              >
                🇱🇰 Auto Login as Sri Lankan User
              </button>
              
              <button
                type="button"
                onClick={async () => {
                  // Auto-login as Japan Exporter
                  try {
                    const result = await dispatch(login({
                      email: 'exporter@example.com',
                      password: 'password123',
                      role: 'ROLE_EXPORTER'
                    })).unwrap();

                    toast.success('Logged in as Japan Exporter!');
                    navigate('/exporter');
                  } catch (error) {
                    toast.error('Auto-login failed. Please check if test users are seeded.');
                    console.error('Auto-login error:', error);
                  }
                }}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors"
              >
                🇯🇵 Auto Login as Japan Exporter
              </button>
            </div>
          </div>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Don't have an account?</span>
              </div>
            </div>

            <div className="mt-6 text-center">
              <Link
                to="/register"
                className="text-primary-600 hover:text-primary-500 text-sm font-medium"
              >
                Create a new account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
