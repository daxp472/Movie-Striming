const mongoose = require('mongoose');

const historySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  movieId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movie',
    required: true
  },
  progress: {
    type: Number,
    default: 0,
    min: 0
  },
  completed: {
    type: Boolean,
    default: false
  },
  watchCount: {
    type: Number,
    default: 1
  },
  lastWatched: {
    type: Date,
    default: Date.now,
    index: true
  }
}, {
  timestamps: true
});

// Create compound index for user's history queries
historySchema.index({ userId: 1, lastWatched: -1 });
historySchema.index({ userId: 1, movieId: 1 }, { unique: true });

const History = mongoose.model('History', historySchema);

module.exports = History;