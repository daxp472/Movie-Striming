import mongoose from 'mongoose';

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
  password: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'active', 'blocked'],
    default: 'pending'
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  subscription: {
    tier: {
      type: String,
      enum: ['basic', 'premium', 'vip'],
      default: 'basic'
    },
    startDate: {
      type: Date,
      default: Date.now
    },
    endDate: {
      type: Date,
      default: () => new Date(+new Date() + 30*24*60*60*1000) // 30 days from now
    },
    autoRenew: {
      type: Boolean,
      default: false
    },
    paymentId: String,
    features: {
      maxDevices: {
        type: Number,
        default: 1
      },
      maxQuality: {
        type: String,
        enum: ['720p', '1080p', '4k'],
        default: '720p'
      },
      downloads: {
        type: Boolean,
        default: false
      },
      offlineMode: {
        type: Boolean,
        default: false
      },
      hdContent: {
        type: Boolean,
        default: false
      },
      dolbyAtmos: {
        type: Boolean,
        default: false
      },
      prioritySupport: {
        type: Boolean,
        default: false
      },
      familySharing: {
        type: Boolean,
        default: false
      },
      earlyAccess: {
        type: Boolean,
        default: false
      }
    }
  },
  devices: [{
    deviceId: String,
    deviceName: String,
    lastActive: Date
  }],
  preferences: {
    language: {
      type: String,
      default: 'en'
    },
    subtitles: {
      type: Boolean,
      default: true
    },
    notifications: {
      type: Boolean,
      default: true
    },
    autoplay: {
      type: Boolean,
      default: true
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Set subscription features based on tier
userSchema.pre('save', function(next) {
  if (this.isModified('subscription.tier')) {
    switch (this.subscription.tier) {
      case 'basic':
        this.subscription.features = {
          maxDevices: 1,
          maxQuality: '720p',
          downloads: false,
          offlineMode: false,
          hdContent: false,
          dolbyAtmos: false,
          prioritySupport: false,
          familySharing: false,
          earlyAccess: false
        };
        break;
      case 'premium':
        this.subscription.features = {
          maxDevices: 2,
          maxQuality: '1080p',
          downloads: true,
          offlineMode: false,
          hdContent: true,
          dolbyAtmos: false,
          prioritySupport: false,
          familySharing: false,
          earlyAccess: false
        };
        break;
      case 'vip':
        this.subscription.features = {
          maxDevices: 4,
          maxQuality: '4k',
          downloads: true,
          offlineMode: true,
          hdContent: true,
          dolbyAtmos: true,
          prioritySupport: true,
          familySharing: true,
          earlyAccess: true
        };
        break;
    }
  }
  next();
});

export default mongoose.model('User', userSchema);