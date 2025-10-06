const mongoose = require('mongoose');

const authSessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  token: {
    type: String,
    required: true
  },
  refreshToken: {
    type: String,
    required: true
  },
  deviceInfo: {
    userAgent: String,
    ipAddress: String,
    deviceType: String,
    browser: String,
    os: String
  },
  isActive: {
    type: Boolean,
    default: true
  },
  expiresAt: {
    type: Date,
    required: true
  },
  lastActivity: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for better query performance
authSessionSchema.index({ userId: 1 });
authSessionSchema.index({ token: 1 });
authSessionSchema.index({ refreshToken: 1 });
authSessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Method to check if session is valid
authSessionSchema.methods.isValid = function() {
  return this.isActive && this.expiresAt > new Date();
};

// Method to deactivate session
authSessionSchema.methods.deactivate = function() {
  this.isActive = false;
  return this.save();
};

module.exports = mongoose.model('AuthSession', authSessionSchema);
