const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  releaseDate: {
    type: Date,
    required: true
  },
  duration: {
    type: Number,
    required: true,
    min: 1
  },
  languages: [{
    type: String,
    required: true
  }],
  genres: [{
    type: String,
    required: true,
    enum: ['Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 'Horror', 'Mystery', 'Romance', 'Sci-Fi', 'Thriller', 'Western']
  }],
  trailerUrl: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})$/.test(v);
      },
      message: 'Invalid YouTube URL format'
    }
  },
  quality: {
    '480p': String,
    '720p': String,
    '1080p': String
  },
  cloudinaryIds: {
    accountId: {
      type: String,
      required: true,
      enum: ['1', '2', '3', '4', '5']
    },
    videoId: {
      type: String,
      required: true
    },
    thumbnailId: {
      type: String,
      required: true
    },
    trailerId: String
  },
  subtitles: [{
    language: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true
    }
  }],
  audioTracks: [{
    language: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true
    }
  }],
  analytics: {
    views: {
      type: Number,
      default: 0
    },
    ratings: [{
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      rating: {
        type: Number,
        min: 1,
        max: 5
      }
    }],
    averageRating: {
      type: Number,
      default: 0
    }
  },
  isSeries: {
    type: Boolean,
    default: false
  },
  seriesInfo: {
    seasonNumber: Number,
    episodeNumber: Number,
    seriesId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Movie'
    }
  }
}, {
  timestamps: true
});

// Calculate average rating before saving
movieSchema.pre('save', function(next) {
  if (this.analytics.ratings.length > 0) {
    const totalRating = this.analytics.ratings.reduce((sum, rating) => sum + rating.rating, 0);
    this.analytics.averageRating = totalRating / this.analytics.ratings.length;
  }
  next();
});

module.exports = mongoose.model('Movie', movieSchema);