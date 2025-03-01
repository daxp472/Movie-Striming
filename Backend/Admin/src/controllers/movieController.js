const Movie = require('../models/Movie');
const cloudinary = require('../config/cloudinary');
const { validationResult } = require('express-validator');

// Helper function to process video uploads for different qualities
async function processVideoQualities(videoFile, accountId) {
  const qualities = ['480p', '720p', '1080p'];
  const videoUrls = {};

  for (const quality of qualities) {
    const result = await cloudinary.uploadToCloudinary(videoFile.path, {
      folder: `movies/${quality}`,
      resource_type: 'video',
      transformation: [
        { quality: quality === '480p' ? '480' : quality === '720p' ? '720' : '1080' }
      ]
    });
    videoUrls[quality] = result.secure_url;
  }

  return videoUrls;
}

exports.createMovie = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Upload thumbnail
    const thumbnailResult = await cloudinary.uploadToCloudinary(req.files.thumbnail[0].path, {
      folder: 'movie-thumbnails'
    });

    // Process video for different qualities
    const videoUrls = await processVideoQualities(req.files.video[0], req.body.cloudinaryAccountId);

    // Upload subtitles if provided
    const subtitles = [];
    if (req.files.subtitles) {
      for (const subtitle of req.files.subtitles) {
        const result = await cloudinary.uploadToCloudinary(subtitle.path, {
          folder: 'subtitles',
          resource_type: 'raw'
        });
        subtitles.push({
          language: subtitle.originalname.split('.')[0],
          url: result.secure_url
        });
      }
    }

    // Upload audio tracks if provided
    const audioTracks = [];
    if (req.files.audioTracks) {
      for (const track of req.files.audioTracks) {
        const result = await cloudinary.uploadToCloudinary(track.path, {
          folder: 'audio-tracks',
          resource_type: 'video'
        });
        audioTracks.push({
          language: track.originalname.split('.')[0],
          url: result.secure_url
        });
      }
    }

    // Create new movie
    const movie = new Movie({
      title: req.body.title,
      description: req.body.description,
      releaseDate: req.body.releaseDate,
      duration: req.body.duration,
      languages: JSON.parse(req.body.languages),
      genres: JSON.parse(req.body.genres),
      trailerUrl: req.body.trailerUrl,
      quality: videoUrls,
      cloudinaryIds: {
        accountId: req.body.cloudinaryAccountId,
        videoId: req.files.video[0].filename,
        thumbnailId: thumbnailResult.public_id
      },
      subtitles,
      audioTracks,
      isSeries: req.body.isSeries === 'true',
      seriesInfo: req.body.isSeries === 'true' ? {
        seasonNumber: req.body.seasonNumber,
        episodeNumber: req.body.episodeNumber,
        seriesId: req.body.seriesId
      } : undefined
    });

    await movie.save();

    res.status(201).json({
      success: true,
      message: 'Movie created successfully',
      data: movie
    });
  } catch (error) {
    console.error('Create movie error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating movie',
      error: {
        code: 'CREATION_FAILED',
        details: error.message
      }
    });
  }
};

exports.updateMovie = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const movieId = req.params.id;
    const movie = await Movie.findById(movieId);

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found',
        error: {
          code: 'NOT_FOUND',
          details: 'Movie with provided ID does not exist'
        }
      });
    }

    // Handle thumbnail update
    if (req.file) {
      await cloudinary.deleteFromCloudinary(movie.cloudinaryIds.thumbnailId);
      const result = await cloudinary.uploadToCloudinary(req.file.path, {
        folder: 'movie-thumbnails'
      });
      movie.cloudinaryIds.thumbnailId = result.public_id;
      movie.thumbnail = result.secure_url;
    }

    // Update other fields
    const updateFields = [
      'title', 'description', 'releaseDate', 'duration',
      'languages', 'genres', 'trailerUrl', 'isSeries', 'seriesInfo'
    ];

    updateFields.forEach(field => {
      if (req.body[field] !== undefined) {
        if (field === 'languages' || field === 'genres') {
          movie[field] = JSON.parse(req.body[field]);
        } else if (field === 'seriesInfo' && req.body[field]) {
          movie[field] = JSON.parse(req.body[field]);
        } else {
          movie[field] = req.body[field];
        }
      }
    });

    await movie.save();

    res.json({
      success: true,
      message: 'Movie updated successfully',
      data: movie
    });
  } catch (error) {
    console.error('Update movie error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating movie',
      error: {
        code: 'UPDATE_FAILED',
        details: error.message
      }
    });
  }
};

exports.deleteMovie = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found',
        error: {
          code: 'NOT_FOUND',
          details: 'Movie with provided ID does not exist'
        }
      });
    }

    // Delete all associated files from Cloudinary
    await cloudinary.deleteFromCloudinary(movie.cloudinaryIds.thumbnailId);
    await cloudinary.deleteFromCloudinary(movie.cloudinaryIds.videoId, { resource_type: 'video' });

    if (movie.subtitles) {
      for (const subtitle of movie.subtitles) {
        await cloudinary.deleteFromCloudinary(subtitle.url.split('/').pop());
      }
    }

    if (movie.audioTracks) {
      for (const track of movie.audioTracks) {
        await cloudinary.deleteFromCloudinary(track.url.split('/').pop(), { resource_type: 'video' });
      }
    }

    await movie.deleteOne();

    res.json({
      success: true,
      message: 'Movie deleted successfully'
    });
  } catch (error) {
    console.error('Delete movie error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting movie',
      error: {
        code: 'DELETE_FAILED',
        details: error.message
      }
    });
  }
};

exports.uploadSeriesBatch = async (req, res) => {
  try {
    const { seriesInfo, episodes } = req.body;
    const uploadedEpisodes = [];

    for (const episode of episodes) {
      const videoUrls = await processVideoQualities(episode.video, req.body.cloudinaryAccountId);
      const thumbnailResult = await cloudinary.uploadToCloudinary(episode.thumbnail, {
        folder: 'series-thumbnails'
      });

      const movieEpisode = new Movie({
        title: `${seriesInfo.title} S${seriesInfo.seasonNumber}E${episode.episodeNumber}`,
        description: seriesInfo.description,
        releaseDate: req.body.releaseDate,
        duration: episode.duration,
        languages: JSON.parse(req.body.languages),
        genres: JSON.parse(req.body.genres),
        quality: videoUrls,
        cloudinaryIds: {
          accountId: req.body.cloudinaryAccountId,
          videoId: episode.video.filename,
          thumbnailId: thumbnailResult.public_id
        },
        isSeries: true,
        seriesInfo: {
          seasonNumber: seriesInfo.seasonNumber,
          episodeNumber: episode.episodeNumber,
          seriesId: seriesInfo.seriesId
        }
      });

      await movieEpisode.save();
      uploadedEpisodes.push(movieEpisode);
    }

    res.status(201).json({
      success: true,
      message: 'Series episodes uploaded successfully',
      data: uploadedEpisodes
    });
  } catch (error) {
    console.error('Series batch upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Error uploading series batch',
      error: {
        code: 'BATCH_UPLOAD_FAILED',
        details: error.message
      }
    });
  }
};