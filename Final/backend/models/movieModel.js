import mongoose from 'mongoose';

const movieSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    genre: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      required: false, // Not required for episodes with streaming duration
    },
    releaseYear: {
      type: Number,
      required: true,
    },
    posterUrl: {
      type: String,
      required: false, // Not required for episodes that use season poster
    },
    posterPublicId: {
      type: String,
      required: false,
    },
    videoUrl: {
      type: String,
      required: true,
    },
    videoPublicId: {
      type: String,
      required: true,
    },
    seasonInfo: {
      isEpisode: {
        type: Boolean,
        default: false
      },
      seasonNumber: {
        type: Number,
        required: false
      },
      episodeNumber: {
        type: Number,
        required: false
      },
      seriesTitle: {
        type: String,
        required: false
      }
    }
  },
  {
    timestamps: true,
  }
);

// Add indexes for better query performance
movieSchema.index({ 'seasonInfo.seriesTitle': 1, 'seasonInfo.seasonNumber': 1, 'seasonInfo.episodeNumber': 1 });
movieSchema.index({ title: 1 });
movieSchema.index({ genre: 1 });

const Movie = mongoose.model('Movie', movieSchema);

export default Movie;