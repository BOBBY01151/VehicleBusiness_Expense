const mongoose = require('mongoose');

const shipmentSchema = new mongoose.Schema({
  exporterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Exporter ID is required']
  },
  trackingNumber: {
    type: String,
    required: [true, 'Tracking number is required'],
    unique: true,
    trim: true
  },
  carrier: {
    name: {
      type: String,
      required: [true, 'Carrier name is required']
    },
    contact: {
      phone: String,
      email: String
    }
  },
  origin: {
    address: {
      street: String,
      city: String,
      state: String,
      country: String,
      postalCode: String
    },
    contact: {
      name: String,
      phone: String,
      email: String
    }
  },
  destination: {
    address: {
      street: String,
      city: String,
      state: String,
      country: String,
      postalCode: String
    },
    contact: {
      name: String,
      phone: String,
      email: String
    }
  },
  contents: [{
    type: {
      type: String,
      enum: ['vehicle', 'parts', 'documents', 'other']
    },
    description: String,
    quantity: Number,
    weight: Number,
    value: Number,
    currency: {
      type: String,
      enum: ['USD', 'JPY', 'LKR', 'EUR'],
      default: 'USD'
    }
  }],
  schedule: {
    pickupDate: Date,
    departureDate: Date,
    estimatedArrival: Date,
    actualArrival: Date
  },
  status: {
    type: String,
    enum: [
      'pending',
      'picked_up',
      'in_transit',
      'customs_clearance',
      'delivered',
      'delayed',
      'cancelled'
    ],
    default: 'pending'
  },
  shipping: {
    method: {
      type: String,
      enum: ['air', 'sea', 'land', 'express'],
      required: [true, 'Shipping method is required']
    },
    cost: {
      type: Number,
      required: [true, 'Shipping cost is required'],
      min: [0, 'Cost must be positive']
    },
    currency: {
      type: String,
      enum: ['USD', 'JPY', 'LKR', 'EUR'],
      default: 'USD'
    },
    insurance: {
      included: {
        type: Boolean,
        default: false
      },
      amount: Number,
      currency: String
    }
  },
  documents: [{
    type: {
      type: String,
      enum: ['bill_of_lading', 'invoice', 'packing_list', 'certificate', 'other']
    },
    name: String,
    url: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  tracking: [{
    status: String,
    location: String,
    timestamp: {
      type: Date,
      default: Date.now
    },
    notes: String
  }],
  notes: {
    type: String,
    trim: true,
    maxlength: [1000, 'Notes cannot exceed 1000 characters']
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

// Indexes
shipmentSchema.index({ exporterId: 1 });
shipmentSchema.index({ trackingNumber: 1 });
shipmentSchema.index({ status: 1 });
shipmentSchema.index({ 'schedule.departureDate': -1 });

// Method to add tracking update
shipmentSchema.methods.addTrackingUpdate = function(status, location, notes = '') {
  this.tracking.push({
    status,
    location,
    notes,
    timestamp: new Date()
  });
  
  this.status = status;
  return this.save();
};

// Method to update schedule
shipmentSchema.methods.updateSchedule = function(scheduleData) {
  Object.assign(this.schedule, scheduleData);
  return this.save();
};

module.exports = mongoose.model('Shipment', shipmentSchema);
