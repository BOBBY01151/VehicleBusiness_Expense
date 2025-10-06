import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import {
  FileText,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
  Eye,
  MessageSquare,
  Filter
} from 'lucide-react'
import { getSharedExpenses, updateShareStatus } from '../../store/slices/expenseSlice'
import toast from 'react-hot-toast'

const SharedExpenses = () => {
  const dispatch = useDispatch()
  const { sharedExpenses, isLoading } = useSelector((state) => state.expense)
  const { user } = useSelector((state) => state.auth)
  const [selectedExpense, setSelectedExpense] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [statusFilter, setStatusFilter] = useState('all')

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm()

  useEffect(() => {
    dispatch(getSharedExpenses())
  }, [dispatch])

  const filteredExpenses = sharedExpenses.filter(expense => {
    if (statusFilter === 'all') return true
    const userShare = expense.sharedWith.find(share => share.userId._id === user.id)
    return userShare && userShare.status === statusFilter
  })

  const handleStatusUpdate = async (expenseId, status, notes) => {
    try {
      await dispatch(updateShareStatus({
        id: expenseId,
        userId: user.id,
        status,
        notes
      })).unwrap()
      
      toast.success(`Expense ${status} successfully!`)
      setShowModal(false)
      setSelectedExpense(null)
      reset()
    } catch (error) {
      toast.error(error || 'Failed to update status')
    }
  }

  const openStatusModal = (expense) => {
    setSelectedExpense(expense)
    setShowModal(true)
  }

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

  const formatCurrency = (amount, currency) => {
    const symbols = {
      USD: '$',
      JPY: '¥',
      LKR: 'Rs',
      EUR: '€'
    }
    return `${symbols[currency] || currency}${amount.toLocaleString()}`
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Shared Expenses</h1>
            <p className="text-gray-600 mt-1">
              Review and respond to expenses shared by Japan exporters
            </p>
          </div>
          
          {/* Filter */}
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input w-auto"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="accepted">Accepted</option>
              <option value="rejected">Rejected</option>
              <option value="requested_info">Requested Info</option>
            </select>
          </div>
        </div>
      </div>

      {/* Expenses List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading expenses...</p>
          </div>
        ) : filteredExpenses.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No shared expenses found</p>
            <p className="text-sm text-gray-500 mt-1">
              {statusFilter === 'all' 
                ? 'Exporters will share expenses with you here'
                : `No expenses with status: ${statusFilter}`
              }
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredExpenses.map((expense) => {
              const userShare = expense.sharedWith.find(share => share.userId._id === user.id)
              return (
                <div key={expense._id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="p-2 bg-primary-100 rounded-lg">
                          <FileText className="h-5 w-5 text-primary-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {expense.title}
                          </h3>
                          <p className="text-sm text-gray-600">
                            From: {expense.exporterId.firstName} {expense.exporterId.lastName}
                          </p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                        <div>
                          <p className="text-sm text-gray-500">Amount</p>
                          <p className="font-semibold text-gray-900">
                            {formatCurrency(expense.amount, expense.currency)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Category</p>
                          <p className="font-medium text-gray-900 capitalize">
                            {expense.category.replace('_', ' ')}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Date</p>
                          <p className="font-medium text-gray-900">
                            {new Date(expense.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      
                      {expense.description && (
                        <div className="mt-4">
                          <p className="text-sm text-gray-500">Description</p>
                          <p className="text-gray-900">{expense.description}</p>
                        </div>
                      )}
                      
                      {userShare?.notes && (
                        <div className="mt-4">
                          <p className="text-sm text-gray-500">Exporter Notes</p>
                          <p className="text-gray-900">{userShare.notes}</p>
                        </div>
                      )}
                    </div>
                    
                    <div className="ml-6 flex flex-col items-end space-y-3">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(userShare?.status || 'pending')}
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(userShare?.status || 'pending')}`}>
                          {userShare?.status || 'pending'}
                        </span>
                      </div>
                      
                      <div className="flex space-x-2">
                        <button
                          onClick={() => openStatusModal(expense)}
                          className="btn btn-primary text-sm"
                        >
                          <MessageSquare className="h-4 w-4 mr-1" />
                          Respond
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Status Update Modal */}
      {showModal && selectedExpense && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Update Expense Status
            </h3>
            
            <div className="mb-4">
              <p className="text-sm text-gray-600">
                <strong>{selectedExpense.title}</strong>
              </p>
              <p className="text-sm text-gray-500">
                Amount: {formatCurrency(selectedExpense.amount, selectedExpense.currency)}
              </p>
            </div>
            
            <form onSubmit={handleSubmit((data) => 
              handleStatusUpdate(selectedExpense._id, data.status, data.notes)
            )}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  {...register('status', { required: 'Status is required' })}
                  className="input"
                >
                  <option value="accepted">Accept</option>
                  <option value="rejected">Reject</option>
                  <option value="requested_info">Request More Information</option>
                </select>
                {errors.status && (
                  <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>
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
                  placeholder="Add any comments or questions..."
                />
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false)
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
                  Update Status
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default SharedExpenses
