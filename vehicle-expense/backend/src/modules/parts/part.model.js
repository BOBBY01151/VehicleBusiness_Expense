const mongoose = require('mongoose');

const partSchema = new mongoose.Schema({
  exporterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Exporter ID is required']
  },
  partNumber: {
    type: String,
    required: [true, 'Part number is required'],
    trim: true,
    unique: true
  },
  name: {
    type: String,
    required: [true, 'Part name is required'],
    trim: true,
    maxlength: [200, 'Part name cannot exceed 200 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: [
      'engine',
      'transmission',
      'brake',
      'suspension',
      'electrical',
      'body',
      'interior',
      'exterior',
      'other'
    ]
  },
  vehicle: {
    make: String,
    model: String,
    year: {
      start: Number,
      end: Number
    },
    vin: String
  },
  specifications: {
    weight: Number,
    dimensions: {
      length: Number,
      width: Number,
      height: Number
    },
    material: String,
    color: String,
    condition: {
      type: String,
      enum: ['new', 'used', 'refurbished'],
      default: 'used'
    }
  },
  pricing: {
    cost: {
      type: Number,
      required: [true, 'Cost is required'],
      min: [0, 'Cost must be positive']
    },
    currency: {
      type: String,
      required: [true, 'Currency is required'],
      enum: ['USD', 'JPY', 'LKR', 'EUR'],
      default: 'JPY'
    },
    markup: {
      type: Number,
      default: 0
    },
    sellingPrice: Number
  },
  inventory: {
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [0, 'Quantity cannot be negative']
    },
    minimumStock: {
      type: Number,
      default: 0
    },
    location: String,
    lastRestocked: Date
  },
  images: [{
    url: String,
    caption: String,
    isPrimary: {
      type: Boolean,
      default: false
    }
  }],
  documents: [{
    type: {
      type: String,
      enum: ['manual', 'warranty', 'certificate', 'other']
    },
    url: String,
    name: String
  }],
  tags: [String],
  isActive: {
    type: Boolean,
    default: true
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
partSchema.index({ exporterId: 1 });
partSchema.index({ partNumber: 1 });
partSchema.index({ category: 1 });
partSchema.index({ 'vehicle.make': 1, 'vehicle.model': 1 });
partSchema.index({ isActive: 1 });

// Pre-save middleware to calculate selling price
partSchema.pre('save', function(next) {
  if (this.isModified('pricing.cost') || this.isModified('pricing.markup')) {
    this.pricing.sellingPrice = this.pricing.cost * (1 + this.pricing.markup / 100);
  }
  next();
});

// Method to update inventory
partSchema.methods.updateInventory = function(quantity, operation = 'add') {
  if (operation === 'add') {
    this.inventory.quantity += quantity;
  } else if (operation === 'subtract') {
    this.inventory.quantity = Math.max(0, this.inventory.quantity - quantity);
  } else if (operation === 'set') {
    this.inventory.quantity = quantity;
  }
  
  if (operation === 'add' || operation === 'set') {
    this.inventory.lastRestocked = new Date();
  }
  
  return this.save();
};

module.exports = mongoose.model('Part', partSchema);
