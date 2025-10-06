const mongoose = require('mongoose');

const exporterSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  company: {
    name: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
      maxlength: [100, 'Company name cannot exceed 100 characters']
    },
    registrationNumber: {
      type: String,
      required: [true, 'Company registration number is required'],
      unique: true,
      trim: true
    },
    taxId: {
      type: String,
      trim: true
    },
    address: {
      street: {
        type: String,
        required: [true, 'Street address is required']
      },
      city: {
        type: String,
        required: [true, 'City is required']
      },
      state: {
        type: String,
        required: [true, 'State is required']
      },
      country: {
        type: String,
        required: [true, 'Country is required'],
        default: 'Japan'
      },
      postalCode: {
        type: String,
        required: [true, 'Postal code is required']
      }
    },
    contact: {
      phone: {
        type: String,
        required: [true, 'Phone number is required']
      },
      email: {
        type: String,
        required: [true, 'Email is required']
      },
      website: String
    }
  },
  business: {
    type: {
      type: String,
      enum: ['vehicle_exporter', 'parts_supplier', 'both'],
      required: [true, 'Business type is required']
    },
    specialties: [{
      type: String,
      enum: ['cars', 'trucks', 'motorcycles', 'parts', 'accessories']
    }],
    yearsInBusiness: {
      type: Number,
      min: 0
    },
    annualVolume: {
      type: String,
      enum: ['1-50', '51-100', '101-500', '500+']
    }
  },
  verification: {
    isVerified: {
      type: Boolean,
      default: false
    },
    verifiedAt: Date,
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    documents: [{
      type: {
        type: String,
        enum: ['business_license', 'tax_certificate', 'export_license', 'insurance']
      },
      url: String,
      uploadedAt: Date,
      verified: {
        type: Boolean,
        default: false
      }
    }]
  },
  preferences: {
    currency: {
      type: String,
      default: 'JPY',
      enum: ['USD', 'JPY', 'LKR', 'EUR']
    },
    language: {
      type: String,
      default: 'ja',
      enum: ['ja', 'en']
    },
    timezone: {
      type: String,
      default: 'Asia/Tokyo'
    },
    notifications: {
      newExpenseShared: {
        type: Boolean,
        default: true
      },
      expenseUpdated: {
        type: Boolean,
        default: true
      },
      paymentReceived: {
        type: Boolean,
        default: true
      }
    }
  },
  statistics: {
    totalExpenses: {
      type: Number,
      default: 0
    },
    totalAmount: {
      type: Number,
      default: 0
    },
    sharedExpenses: {
      type: Number,
      default: 0
    },
    lastActivity: Date
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes for better query performance
exporterSchema.index({ userId: 1 });
exporterSchema.index({ 'company.registrationNumber': 1 });
exporterSchema.index({ 'verification.isVerified': 1 });
exporterSchema.index({ 'business.type': 1 });

// Virtual for full company address
exporterSchema.virtual('company.fullAddress').get(function() {
  const addr = this.company.address;
  return `${addr.street}, ${addr.city}, ${addr.state} ${addr.postalCode}, ${addr.country}`;
});

// Method to update statistics
exporterSchema.methods.updateStatistics = async function() {
  const Expense = require('../expenses/expense.model');
  
  const stats = await Expense.aggregate([
    { $match: { exporterId: this.userId } },
    {
      $group: {
        _id: null,
        totalExpenses: { $sum: 1 },
        totalAmount: { $sum: '$amount' },
        sharedExpenses: { $sum: { $cond: ['$sharedWithLocal', 1, 0] } }
      }
    }
  ]);

  if (stats.length > 0) {
    this.statistics = {
      totalExpenses: stats[0].totalExpenses,
      totalAmount: stats[0].totalAmount,
      sharedExpenses: stats[0].sharedExpenses,
      lastActivity: new Date()
    };
  }

  return this.save();
};

// Method to verify exporter
exporterSchema.methods.verify = async function(verifiedBy) {
  this.verification.isVerified = true;
  this.verification.verifiedAt = new Date();
  this.verification.verifiedBy = verifiedBy;
  return this.save();
};

module.exports = mongoose.model('Exporter', exporterSchema);
