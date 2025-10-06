const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  exporterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Exporter ID is required']
  },
  category: {
    type: String,
    required: [true, 'Expense category is required'],
    enum: [
      'vehicle_purchase',
      'freight_shipping',
      'packaging',
      'insurance',
      'customs_duty',
      'inspection',
      'documentation',
      'storage',
      'transportation',
      'other'
    ]
  },
  title: {
    type: String,
    required: [true, 'Expense title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: [0, 'Amount must be positive']
  },
  currency: {
    type: String,
    required: [true, 'Currency is required'],
    enum: ['USD', 'JPY', 'LKR', 'EUR'],
    default: 'JPY'
  },
  exchangeRate: {
    type: Number,
    default: 1
  },
  amountInUSD: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    required: [true, 'Expense date is required']
  },
  invoice: {
    number: {
      type: String,
      trim: true
    },
    date: Date,
    supplier: {
      name: String,
      contact: String
    },
    url: String
  },
  vehicle: {
    vin: String,
    make: String,
    model: String,
    year: Number,
    color: String,
    mileage: Number
  },
  shipment: {
    trackingNumber: String,
    carrier: String,
    origin: String,
    destination: String,
    departureDate: Date,
    arrivalDate: Date
  },
  sharedWithLocal: {
    type: Boolean,
    default: false
  },
  sharedWith: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    sharedAt: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected', 'requested_info'],
      default: 'pending'
    },
    notes: String
  }],
  status: {
    type: String,
    enum: ['draft', 'pending', 'approved', 'rejected', 'paid'],
    default: 'draft'
  },
  attachments: [{
    name: String,
    url: String,
    type: String,
    size: Number,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  tags: [String],
  notes: {
    type: String,
    trim: true,
    maxlength: [500, 'Notes cannot exceed 500 characters']
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Indexes for better query performance
expenseSchema.index({ exporterId: 1 });
expenseSchema.index({ category: 1 });
expenseSchema.index({ date: -1 });
expenseSchema.index({ status: 1 });
expenseSchema.index({ sharedWithLocal: 1 });
expenseSchema.index({ 'sharedWith.userId': 1 });
expenseSchema.index({ 'vehicle.vin': 1 });
expenseSchema.index({ 'shipment.trackingNumber': 1 });

// Virtual for total amount in different currencies
expenseSchema.virtual('amountInCurrency').get(function() {
  return {
    original: this.amount,
    usd: this.amountInUSD,
    jpy: this.currency === 'JPY' ? this.amount : this.amountInUSD * this.exchangeRate,
    lkr: this.currency === 'LKR' ? this.amount : this.amountInUSD * this.exchangeRate
  };
});

// Pre-save middleware to calculate USD amount
expenseSchema.pre('save', async function(next) {
  if (this.isModified('amount') || this.isModified('currency') || this.isModified('exchangeRate')) {
    if (this.currency === 'USD') {
      this.amountInUSD = this.amount;
    } else {
      // In a real application, you would fetch current exchange rates
      // For now, using a simple conversion
      const rates = {
        JPY: 150, // 1 USD = 150 JPY
        LKR: 320, // 1 USD = 320 LKR
        EUR: 0.85 // 1 USD = 0.85 EUR
      };
      
      if (this.exchangeRate && this.exchangeRate !== 1) {
        this.amountInUSD = this.amount / this.exchangeRate;
      } else {
        this.amountInUSD = this.amount / (rates[this.currency] || 1);
      }
    }
  }
  next();
});

// Method to share expense with local users
expenseSchema.methods.shareWithLocal = async function(userIds, notes = '') {
  this.sharedWithLocal = true;
  
  // Add new users to sharedWith array
  userIds.forEach(userId => {
    const existingShare = this.sharedWith.find(share => share.userId.toString() === userId.toString());
    if (!existingShare) {
      this.sharedWith.push({
        userId,
        status: 'pending',
        notes
      });
    }
  });
  
  return this.save();
};

// Method to update share status
expenseSchema.methods.updateShareStatus = async function(userId, status, notes = '') {
  const share = this.sharedWith.find(s => s.userId.toString() === userId.toString());
  if (share) {
    share.status = status;
    share.notes = notes;
    return this.save();
  }
  throw new Error('Share not found');
};

// Method to remove share
expenseSchema.methods.removeShare = async function(userId) {
  this.sharedWith = this.sharedWith.filter(s => s.userId.toString() !== userId.toString());
  
  // If no more shares, set sharedWithLocal to false
  if (this.sharedWith.length === 0) {
    this.sharedWithLocal = false;
  }
  
  return this.save();
};

// Static method to get expenses by exporter
expenseSchema.statics.getByExporter = function(exporterId, filters = {}) {
  const query = { exporterId, ...filters };
  return this.find(query)
    .populate('exporterId', 'firstName lastName email')
    .populate('sharedWith.userId', 'firstName lastName email')
    .sort({ date: -1 });
};

// Static method to get shared expenses for local user
expenseSchema.statics.getSharedForUser = function(userId) {
  return this.find({
    sharedWithLocal: true,
    'sharedWith.userId': userId
  })
  .populate('exporterId', 'firstName lastName email company')
  .sort({ date: -1 });
};

module.exports = mongoose.model('Expense', expenseSchema);
