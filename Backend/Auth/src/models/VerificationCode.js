import mongoose from 'mongoose';

const verificationCodeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  code: {
    type: String,
    required: true,
    unique: true // Ensure each code is unique
  },
  type: {
    type: String,
    enum: ['email', 'reset'],
    required: true
  },
  expiresAt: {
    type: Date,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index to automatically expire documents
verificationCodeSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Pre-save hook to delete existing codes of the same type for the user
verificationCodeSchema.pre('save', async function(next) {
  try {
    // Delete existing codes of the same type for the user
    await mongoose.model('VerificationCode').deleteMany({
      userId: this.userId,
      type: this.type
    });
    next();
  } catch (error) {
    next(error);
  }
});

export default mongoose.model('VerificationCode', verificationCodeSchema);