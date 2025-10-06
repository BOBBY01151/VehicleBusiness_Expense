import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import {
  Plus,
  FileText,
  DollarSign,
  TrendingUp,
  Users,
  Package,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react'
import { getExpenseStatistics } from '../../store/slices/expenseSlice'
import { getExporterStatistics } from '../../store/slices/exporterSlice'

const ExporterDashboard = () => {
  const dispatch = useDispatch()
  const { statistics: expenseStats } = useSelector((state) => state.expense)
  const { statistics: exporterStats } = useSelector((state) => state.exporter)
  const { user } = useSelector((state) => state.auth)

  useEffect(() => {
    dispatch(getExpenseStatistics())
    dispatch(getExporterStatistics())
  }, [dispatch])

  const stats = [
    {
      name: 'Total Expenses',
      value: expenseStats?.totalExpenses || 0,
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      name: 'Total Amount',
      value: `$${(expenseStats?.totalAmount || 0).toLocaleString()}`,
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      name: 'Shared Expenses',
      value: expenseStats?.sharedExpenses || 0,
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      name: 'Average Amount',
      value: `$${(expenseStats?.averageAmount || 0).toLocaleString()}`,
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    }
  ]

  const quickActions = [
    {
      title: 'Create New Expense',
      description: 'Add a new expense record',
      icon: Plus,
      link: '/exporter/expenses/create',
      color: 'bg-primary-600 hover:bg-primary-700'
    },
    {
      title: 'View All Expenses',
      description: 'Manage your expense records',
      icon: FileText,
      link: '/exporter/expenses',
      color: 'bg-blue-600 hover:bg-blue-700'
    },
    {
      title: 'Manage Parts',
      description: 'Track vehicle parts inventory',
      icon: Package,
      link: '/exporter/parts',
      color: 'bg-green-600 hover:bg-green-700'
    }
  ]

  const recentExpenses = [
    // This would be populated from actual data
    {
      id: 1,
      title: 'Vehicle Purchase - Toyota Camry',
      amount: 15000,
      currency: 'USD',
      date: '2024-01-15',
      status: 'approved'
    },
    {
      id: 2,
      title: 'Freight Shipping',
      amount: 2500,
      currency: 'USD',
      date: '2024-01-14',
      status: 'pending'
    },
    {
      id: 3,
      title: 'Insurance Premium',
      amount: 800,
      currency: 'USD',
      date: '2024-01-13',
      status: 'shared'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {user?.firstName}!
        </h1>
        <p className="text-gray-600 mt-1">
          Here's what's happening with your vehicle export business today.
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
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

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon
            return (
              <Link
                key={action.title}
                to={action.link}
                className={`${action.color} text-white p-6 rounded-lg transition-colors duration-200`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">{action.title}</h3>
                    <p className="text-sm opacity-90 mt-1">{action.description}</p>
                  </div>
                  <Icon className="h-8 w-8" />
                </div>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Recent Expenses */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Recent Expenses</h2>
          <Link
            to="/exporter/expenses"
            className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center"
          >
            View all
            <ArrowUpRight className="h-4 w-4 ml-1" />
          </Link>
        </div>
        
        <div className="space-y-4">
          {recentExpenses.map((expense) => (
            <div key={expense.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-white rounded-lg">
                  <FileText className="h-5 w-5 text-gray-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{expense.title}</h3>
                  <p className="text-sm text-gray-600">
                    {new Date(expense.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900">
                  ${expense.amount.toLocaleString()} {expense.currency}
                </p>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  expense.status === 'approved' ? 'bg-green-100 text-green-800' :
                  expense.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {expense.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Category Breakdown */}
      {expenseStats?.categoryBreakdown && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Expense Categories</h2>
          <div className="space-y-3">
            {expenseStats.categoryBreakdown.map((category) => (
              <div key={category.category} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-primary-600 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-900 capitalize">
                    {category.category.replace('_', ' ')}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">
                    ${category.amount.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-600">{category.count} expenses</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default ExporterDashboard
