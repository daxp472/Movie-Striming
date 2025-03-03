import asyncHandler from 'express-async-handler';
import fs from 'fs';
import path from 'path';
import Movie from '../models/movieModel.js';
import { uploadVideo } from '../utils/cloudinary.js';

// @desc    Bulk upload season episodes
// @route   POST /api/movies/season-upload
// @access  Private/Admin
const uploadSeason = asyncHandler(async (req, res) => {
  const { 
    title,
    description,
    genre,
    seasonNumber,
    releaseYear
  } = req.body;

  if (!req.files || !req.files.episodes) {
    res.status(400);
    throw new Error('Please upload episode files');
  }

  try {
    const episodes = Array.isArray(req.files.episodes) ? req.files.episodes : [req.files.episodes];
    const uploadedEpisodes = [];

    // Sort episodes by filename to maintain order
    episodes.sort((a, b) => a.originalname.localeCompare(b.originalname));

    for (const [index, episode] of episodes.entries()) {
      const episodeNumber = index + 1;
      console.log(`Uploading episode ${episodeNumber} of season ${seasonNumber}: ${episode.originalname}`);

      // Upload video to Cloudinary
      const videoResult = await uploadVideo(episode.path);

      // Create movie entry for the episode
      const episodeMovie = await Movie.create({
        title: `${title} S${seasonNumber}E${episodeNumber}`,
        description: `${description} - Episode ${episodeNumber}`,
        genre,
        releaseYear: Number(releaseYear),
        videoUrl: videoResult.secure_url,
        videoPublicId: videoResult.public_id,
        seasonInfo: {
          isEpisode: true,
          seasonNumber: Number(seasonNumber),
          episodeNumber,
          seriesTitle: title
        }
      });

      uploadedEpisodes.push(episodeMovie);

      // Clean up temporary file
      if (fs.existsSync(episode.path)) {
        fs.unlinkSync(episode.path);
      }
    }

    res.status(201).json({
      message: 'Season uploaded successfully',
      episodes: uploadedEpisodes
    });
  } catch (error) {
    console.error('Error uploading season:', error);
    
    // Clean up any temporary files
    if (req.files && req.files.episodes) {
      const episodes = Array.isArray(req.files.episodes) ? req.files.episodes : [req.files.episodes];
      episodes.forEach(episode => {
        if (fs.existsSync(episode.path)) {
          fs.unlinkSync(episode.path);
        }
      });
    }
    
    res.status(500);
    throw new Error('Failed to upload season: ' + error.message);
  }
});

export { uploadSeason };
