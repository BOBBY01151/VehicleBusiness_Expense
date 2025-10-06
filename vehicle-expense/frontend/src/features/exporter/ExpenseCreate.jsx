import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { createExpense } from '../../store/slices/expenseSlice'
import { Plus, X, Upload } from 'lucide-react'
import toast from 'react-hot-toast'

const ExpenseCreate = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { isLoading } = useSelector((state) => state.expense)
  const [attachments, setAttachments] = useState([])
  const [vehicleInfo, setVehicleInfo] = useState({
    vin: '',
    make: '',
    model: '',
    year: '',
    color: '',
    mileage: ''
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm({
    defaultValues: {
      category: 'vehicle_purchase',
      currency: 'USD',
      date: new Date().toISOString().split('T')[0]
    }
  })

  const selectedCategory = watch('category')

  const categories = [
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

  const currencies = [
    { value: 'USD', label: 'USD ($)' },
    { value: 'JPY', label: 'JPY (¥)' },
    { value: 'LKR', label: 'LKR (Rs)' },
    { value: 'EUR', label: 'EUR (€)' }
  ]

  const onSubmit = async (data) => {
    try {
      const expenseData = {
        ...data,
        vehicle: vehicleInfo,
        attachments,
        amount: parseFloat(data.amount)
      }

      await dispatch(createExpense(expenseData)).unwrap()
      toast.success('Expense created successfully!')
      navigate('/exporter/expenses')
    } catch (error) {
      toast.error(error || 'Failed to create expense')
    }
  }

  const addAttachment = () => {
    setAttachments([...attachments, { name: '', url: '', type: 'invoice' }])
  }

  const removeAttachment = (index) => {
    setAttachments(attachments.filter((_, i) => i !== index))
  }

  const updateAttachment = (index, field, value) => {
    const updated = [...attachments]
    updated[index][field] = value
    setAttachments(updated)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Create New Expense</h1>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                {...register('category', { required: 'Category is required' })}
                className="input"
              >
                {categories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                {...register('title', { required: 'Title is required' })}
                type="text"
                className="input"
                placeholder="Enter expense title"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              {...register('description')}
              rows={3}
              className="input"
              placeholder="Enter expense description"
            />
          </div>

          {/* Amount and Currency */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amount *
              </label>
              <input
                {...register('amount', { 
                  required: 'Amount is required',
                  min: { value: 0, message: 'Amount must be positive' }
                })}
                type="number"
                step="0.01"
                className="input"
                placeholder="0.00"
              />
              {errors.amount && (
                <p className="mt-1 text-sm text-red-600">{errors.amount.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Currency *
              </label>
              <select
                {...register('currency', { required: 'Currency is required' })}
                className="input"
              >
                {currencies.map((currency) => (
                  <option key={currency.value} value={currency.value}>
                    {currency.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date *
              </label>
              <input
                {...register('date', { required: 'Date is required' })}
                type="date"
                className="input"
              />
              {errors.date && (
                <p className="mt-1 text-sm text-red-600">{errors.date.message}</p>
              )}
            </div>
          </div>

          {/* Vehicle Information (if applicable) */}
          {selectedCategory === 'vehicle_purchase' && (
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Vehicle Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    VIN
                  </label>
                  <input
                    value={vehicleInfo.vin}
                    onChange={(e) => setVehicleInfo({...vehicleInfo, vin: e.target.value})}
                    type="text"
                    className="input"
                    placeholder="Vehicle VIN"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Make
                  </label>
                  <input
                    value={vehicleInfo.make}
                    onChange={(e) => setVehicleInfo({...vehicleInfo, make: e.target.value})}
                    type="text"
                    className="input"
                    placeholder="e.g., Toyota"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Model
                  </label>
                  <input
                    value={vehicleInfo.model}
                    onChange={(e) => setVehicleInfo({...vehicleInfo, model: e.target.value})}
                    type="text"
                    className="input"
                    placeholder="e.g., Camry"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Year
                  </label>
                  <input
                    value={vehicleInfo.year}
                    onChange={(e) => setVehicleInfo({...vehicleInfo, year: e.target.value})}
                    type="number"
                    className="input"
                    placeholder="2020"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Color
                  </label>
                  <input
                    value={vehicleInfo.color}
                    onChange={(e) => setVehicleInfo({...vehicleInfo, color: e.target.value})}
                    type="text"
                    className="input"
                    placeholder="e.g., White"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mileage
                  </label>
                  <input
                    value={vehicleInfo.mileage}
                    onChange={(e) => setVehicleInfo({...vehicleInfo, mileage: e.target.value})}
                    type="number"
                    className="input"
                    placeholder="50000"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Invoice Information */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Invoice Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Invoice Number
                </label>
                <input
                  {...register('invoice.number')}
                  type="text"
                  className="input"
                  placeholder="Invoice number"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Invoice Date
                </label>
                <input
                  {...register('invoice.date')}
                  type="date"
                  className="input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Supplier Name
                </label>
                <input
                  {...register('invoice.supplier.name')}
                  type="text"
                  className="input"
                  placeholder="Supplier name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Supplier Contact
                </label>
                <input
                  {...register('invoice.supplier.contact')}
                  type="text"
                  className="input"
                  placeholder="Contact information"
                />
              </div>
            </div>
          </div>

          {/* Attachments */}
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Attachments</h3>
              <button
                type="button"
                onClick={addAttachment}
                className="btn btn-secondary flex items-center"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Attachment
              </button>
            </div>
            
            {attachments.map((attachment, index) => (
              <div key={index} className="flex items-center space-x-4 mb-4 p-4 bg-white rounded-lg">
                <div className="flex-1">
                  <input
                    value={attachment.name}
                    onChange={(e) => updateAttachment(index, 'name', e.target.value)}
                    type="text"
                    className="input mb-2"
                    placeholder="Attachment name"
                  />
                  <input
                    value={attachment.url}
                    onChange={(e) => updateAttachment(index, 'url', e.target.value)}
                    type="url"
                    className="input"
                    placeholder="File URL"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeAttachment(index)}
                  className="p-2 text-red-600 hover:bg-red-100 rounded-lg"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/exporter/expenses')}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary disabled:opacity-50"
            >
              {isLoading ? 'Creating...' : 'Create Expense'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ExpenseCreate
