import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import {
  FileText,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Share2,
  DollarSign,
  Calendar,
  Tag
} from 'lucide-react'
import { getExpenses, deleteExpense, shareExpense } from '../../store/slices/expenseSlice'
import toast from 'react-hot-toast'

const ExporterExpenses = () => {
  const dispatch = useDispatch()
  const { expenses, isLoading, pagination } = useSelector((state) => state.expense)
  const [showShareModal, setShowShareModal] = useState(false)
  const [selectedExpense, setSelectedExpense] = useState(null)
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    status: '',
    sharedWithLocal: ''
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm()

  useEffect(() => {
    dispatch(getExpenses(filters))
  }, [dispatch, filters])

  const categories = [
    { value: '', label: 'All Categories' },
    { value: 'vehicle_purchase', label: 'Vehicle Purchase' },
    { value: 'freight_shipping', label: 'Freight Shipping' },
    { value: 'packaging', label: 'Packaging' },
    { value: 'insurance', label: 'Insurance' },
    { value: 'customs_duty', label: 'Customs Duty' },
    { value: 'inspection', label: 'Inspection' },
    { value: 'documentation', label: 'Documentation' },
    { value: 'storage', label: 'Storage' },
    { value: 'transportation', label: 'Transportation' },
    { value: 'other', label: 'Other' }
  ]

  const statuses = [
    { value: '', label: 'All Status' },
    { value: 'draft', label: 'Draft' },
    { value: 'pending', label: 'Pending' },
    { value: 'approved', label: 'Approved' },
    { value: 'rejected', label: 'Rejected' },
    { value: 'paid', label: 'Paid' }
  ]

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const handleDelete = async (expenseId) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      try {
        await dispatch(deleteExpense(expenseId)).unwrap()
        toast.success('Expense deleted successfully!')
      } catch (error) {
        toast.error(error || 'Failed to delete expense')
      }
    }
  }

  const handleShare = (expense) => {
    setSelectedExpense(expense)
    setShowShareModal(true)
  }

  const onShareSubmit = async (data) => {
    try {
      await dispatch(shareExpense({
        id: selectedExpense._id,
        userIds: data.userIds,
        notes: data.notes
      })).unwrap()
      
      toast.success('Expense shared successfully!')
      setShowShareModal(false)
      setSelectedExpense(null)
      reset()
    } catch (error) {
      toast.error(error || 'Failed to share expense')
    }
  }

  const formatCurrency = (amount, currency) => {
    const symbols = {
      USD: '$',
      JPY: '¥',
      LKR: 'Rs',
      EUR: '€'
    }
    return `${symbols[currency] || currency}${amount.toLocaleString()}`
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'rejected':
        return 'bg-red-100 text-red-800'
      case 'paid':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Expenses</h1>
            <p className="text-gray-600 mt-1">
              Manage your vehicle export expenses
            </p>
          </div>
          <Link
            to="/exporter/expenses/create"
            className="btn btn-primary flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Expense
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search expenses..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="input pl-10"
              />
            </div>
          </div>
          
          <div>
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="input"
            >
              {categories.map(category => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="input"
            >
              {statuses.map(status => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <select
              value={filters.sharedWithLocal}
              onChange={(e) => handleFilterChange('sharedWithLocal', e.target.value)}
              className="input"
            >
              <option value="">All Expenses</option>
              <option value="true">Shared</option>
              <option value="false">Not Shared</option>
            </select>
          </div>
        </div>
      </div>

      {/* Expenses Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading expenses...</p>
          </div>
        ) : expenses.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No expenses found</p>
            <p className="text-sm text-gray-500 mt-1">
              Create your first expense to get started
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Expense Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Shared
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {expenses.map((expense) => (
                  <tr key={expense._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="p-2 bg-primary-100 rounded-lg mr-3">
                          <FileText className="h-5 w-5 text-primary-600" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {expense.title}
                          </div>
                          <div className="text-sm text-gray-500 capitalize">
                            {expense.category.replace('_', ' ')}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900">
                        {formatCurrency(expense.amount, expense.currency)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(expense.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(expense.status)}`}>
                        {expense.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {expense.sharedWithLocal ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          Shared
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          Private
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleShare(expense)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Share"
                        >
                          <Share2 className="h-4 w-4" />
                        </button>
                        <Link
                          to={`/exporter/expenses/${expense._id}`}
                          className="text-primary-600 hover:text-primary-900"
                          title="View"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                        <Link
                          to={`/exporter/expenses/${expense._id}/edit`}
                          className="text-yellow-600 hover:text-yellow-900"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(expense._id)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination && pagination.pages > 1 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing {((pagination.current - 1) * 10) + 1} to {Math.min(pagination.current * 10, pagination.total)} of {pagination.total} results
            </div>
            <div className="flex items-center space-x-2">
              <button
                disabled={pagination.current === 1}
                className="btn btn-secondary disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-sm text-gray-700">
                Page {pagination.current} of {pagination.pages}
              </span>
              <button
                disabled={pagination.current === pagination.pages}
                className="btn btn-secondary disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && selectedExpense && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Share Expense
            </h3>
            
            <div className="mb-4">
              <p className="text-sm text-gray-600">
                <strong>{selectedExpense.title}</strong>
              </p>
              <p className="text-sm text-gray-500">
                Amount: {formatCurrency(selectedExpense.amount, selectedExpense.currency)}
              </p>
            </div>
            
            <form onSubmit={handleSubmit(onShareSubmit)}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Users to Share With
                </label>
                <input
                  {...register('userIds', { required: 'Please select at least one user' })}
                  type="text"
                  className="input"
                  placeholder="Enter user IDs (comma separated)"
                />
                {errors.userIds && (
                  <p className="mt-1 text-sm text-red-600">{errors.userIds.message}</p>
                )}
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes (Optional)
                </label>
                <textarea
                  {...register('notes')}
                  rows={3}
                  className="input"
                  placeholder="Add any notes for the shared users..."
                />
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowShareModal(false)
                    setSelectedExpense(null)
                    reset()
                  }}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                >
                  Share Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default ExporterExpenses
