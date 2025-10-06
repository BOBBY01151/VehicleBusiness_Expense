import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import {
  FileText,
  Users,
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react'
import { getSharedExpenses } from '../../store/slices/expenseSlice'

const SLDashboard = () => {
  const dispatch = useDispatch()
  const { sharedExpenses, isLoading } = useSelector((state) => state.expense)
  const { user } = useSelector((state) => state.auth)

  useEffect(() => {
    dispatch(getSharedExpenses({ limit: 5 }))
  }, [dispatch])

  // Calculate statistics from shared expenses
  const stats = {
    totalShared: sharedExpenses.length,
    totalAmount: sharedExpenses.reduce((sum, expense) => sum + (expense.amountInUSD || 0), 0),
    pending: sharedExpenses.filter(expense => {
      const userShare = expense.sharedWith.find(share => share.userId._id === user.id)
      return userShare && userShare.status === 'pending'
    }).length,
    accepted: sharedExpenses.filter(expense => {
      const userShare = expense.sharedWith.find(share => share.userId._id === user.id)
      return userShare && userShare.status === 'accepted'
    }).length
  }

  const statCards = [
    {
      name: 'Total Shared Expenses',
      value: stats.totalShared,
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      name: 'Total Amount',
      value: `$${stats.totalAmount.toLocaleString()}`,
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      name: 'Pending Review',
      value: stats.pending,
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100'
    },
    {
      name: 'Accepted',
      value: stats.accepted,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    }
  ]

  const getStatusIcon = (status) => {
    switch (status) {
      case 'accepted':
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-600" />
      case 'requested_info':
        return <AlertCircle className="h-5 w-5 text-yellow-600" />
      default:
        return <Clock className="h-5 w-5 text-gray-600" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'accepted':
        return 'bg-green-100 text-green-800'
      case 'rejected':
        return 'bg-red-100 text-red-800'
      case 'requested_info':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome, {user?.firstName}!
        </h1>
        <p className="text-gray-600 mt-1">
          Here are the expenses shared with you by Japan exporters.
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.name} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Recent Shared Expenses */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Recent Shared Expenses</h2>
          <Link
            to="/srilanka/expenses"
            className="text-primary-600 hover:text-primary-700 text-sm font-medium"
          >
            View all
          </Link>
        </div>
        
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading expenses...</p>
          </div>
        ) : sharedExpenses.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No shared expenses yet</p>
            <p className="text-sm text-gray-500 mt-1">
              Exporters will share expenses with you here
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {sharedExpenses.map((expense) => {
              const userShare = expense.sharedWith.find(share => share.userId._id === user.id)
              return (
                <div key={expense._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-white rounded-lg">
                      <FileText className="h-5 w-5 text-gray-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{expense.title}</h3>
                      <p className="text-sm text-gray-600">
                        From: {expense.exporterId.firstName} {expense.exporterId.lastName}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(expense.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      ${expense.amountInUSD.toLocaleString()} USD
                    </p>
                    <div className="flex items-center space-x-2 mt-1">
                      {getStatusIcon(userShare?.status || 'pending')}
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(userShare?.status || 'pending')}`}>
                        {userShare?.status || 'pending'}
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            to="/srilanka/expenses"
            className="bg-primary-600 hover:bg-primary-700 text-white p-6 rounded-lg transition-colors duration-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Review Expenses</h3>
                <p className="text-sm opacity-90 mt-1">View and respond to shared expenses</p>
              </div>
              <FileText className="h-8 w-8" />
            </div>
          </Link>
          
          <Link
            to="/srilanka/exporters"
            className="bg-blue-600 hover:bg-blue-700 text-white p-6 rounded-lg transition-colors duration-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">View Exporters</h3>
                <p className="text-sm opacity-90 mt-1">Browse verified Japan exporters</p>
              </div>
              <Users className="h-8 w-8" />
            </div>
          </Link>
        </div>
      </div>

      {/* Category Breakdown */}
      {sharedExpenses.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Expense Categories</h2>
          <div className="space-y-3">
            {Object.entries(
              sharedExpenses.reduce((acc, expense) => {
                const category = expense.category.replace('_', ' ')
                acc[category] = (acc[category] || 0) + 1
                return acc
              }, {})
            ).map(([category, count]) => (
              <div key={category} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-primary-600 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-900 capitalize">
                    {category}
                  </span>
                </div>
                <p className="text-sm font-semibold text-gray-900">{count} expenses</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default SLDashboard
