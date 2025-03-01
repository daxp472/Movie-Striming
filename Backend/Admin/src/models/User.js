const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  status: {
    type: String,
    enum: ['active', 'suspended', 'banned'],
    default: 'active'
  },
  tier: {
    type: String,
    enum: ['basic', 'premium', 'vip'],
    default: 'basic'
  },
  tierValidUntil: {
    type: Date
  },
  canWatch: {
    type: Boolean,
    default: true
  },
  activityLog: [{
    timestamp: {
      type: Date,
      default: Date.now
    },
    action: String,
    details: String
  }],
  complaints: [{
    subject: String,
    description: String,
    status: {
      type: String,
      enum: ['open', 'resolved'],
      default: 'open'
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);