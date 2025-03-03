import asyncHandler from 'express-async-handler';
import fs from 'fs';
import path from 'path';
import Movie from '../models/movieModel.js';
import { uploadImage, uploadVideo, deleteResource } from '../utils/cloudinary.js';

// @desc    Create a new movie
// @route   POST /api/movies
// @access  Private/Admin
const createMovie = asyncHandler(async (req, res) => {
  console.log('Create movie request received');
  console.log('Request body:', req.body);

  const { 
    title, 
    description, 
    genre, 
    duration, 
    releaseYear,
    posterUrl,
    posterPublicId,
    videoUrl,
    videoPublicId
  } = req.body;

  // Validate required fields
  if (!title || !description || !genre || !duration || !releaseYear || !posterUrl || !videoUrl) {
    console.log('Missing required fields in request');
    res.status(400);
    throw new Error('Please provide all required fields');
  }

  try {
    console.log('Creating movie in database with data:', {
      title, description, genre, duration, releaseYear,
      posterUrl, posterPublicId,
      videoUrl, videoPublicId
    });

    // Create movie in database
    const movie = await Movie.create({
      title,
      description,
      genre,
      duration: Number(duration),
      releaseYear: Number(releaseYear),
      posterUrl,
      posterPublicId,
      videoUrl,
      videoPublicId,
    });

    console.log('Movie created successfully:', movie._id);
    res.status(201).json(movie);
  } catch (error) {
    console.error('Error creating movie:', error);
    if (error.name === 'ValidationError') {
      console.error('Validation error details:', error.errors);
    }
    
    res.status(500);
    throw new Error('Failed to create movie: ' + error.message);
  }
});

// @desc    Get all movies
// @route   GET /api/movies
// @access  Public
const getMovies = asyncHandler(async (req, res) => {
  const movies = await Movie.find({}).sort({ createdAt: -1 });
  res.json(movies);
});

// @desc    Get movie by ID
// @route   GET /api/movies/:id
// @access  Public
const getMovieById = asyncHandler(async (req, res) => {
  const movie = await Movie.findById(req.params.id);
  
  if (movie) {
    res.json(movie);
  } else {
    res.status(404);
    throw new Error('Movie not found');
  }
});

// @desc    Update movie
// @route   PUT /api/movies/:id
// @access  Private/Admin
const updateMovie = asyncHandler(async (req, res) => {
  const { title, description, genre, duration, releaseYear } = req.body;
  
  const movie = await Movie.findById(req.params.id);
  
  if (!movie) {
    res.status(404);
    throw new Error('Movie not found');
  }
  
  try {
    // Update basic info
    movie.title = title || movie.title;
    movie.description = description || movie.description;
    movie.genre = genre || movie.genre;
    movie.duration = duration || movie.duration;
    movie.releaseYear = releaseYear || movie.releaseYear;
    
    // Handle poster update if provided
    if (req.files && req.files.poster) {
      // Delete old poster from Cloudinary if it exists
      if (movie.posterPublicId) {
        await deleteResource(movie.posterPublicId);
      }
      
      // Upload new poster
      const posterResult = await uploadImage(req.files.poster[0].path);
      movie.posterUrl = posterResult.secure_url;
      movie.posterPublicId = posterResult.public_id;
      
      // Delete temporary file
      if (fs.existsSync(req.files.poster[0].path)) {
        fs.unlinkSync(req.files.poster[0].path);
      }
    }
    
    // Handle video update if provided
    if (req.files && req.files.video) {
      // Delete old video from Cloudinary if it exists
      if (movie.videoPublicId) {
        await deleteResource(movie.videoPublicId, 'video');
      }
      
      // Upload new video
      const videoResult = await uploadVideo(req.files.video[0].path);
      movie.videoUrl = videoResult.secure_url;
      movie.videoPublicId = videoResult.public_id;
      
      // Delete temporary file
      if (fs.existsSync(req.files.video[0].path)) {
        fs.unlinkSync(req.files.video[0].path);
      }
    }
    
    const updatedMovie = await movie.save();
    res.json(updatedMovie);
  } catch (error) {
    console.error('Error updating movie:', error);
    
    // Delete temporary files if they exist
    if (req.files && req.files.poster && req.files.poster[0] && req.files.poster[0].path && fs.existsSync(req.files.poster[0].path)) {
      fs.unlinkSync(req.files.poster[0].path);
    }
    if (req.files && req.files.video && req.files.video[0] && req.files.video[0].path && fs.existsSync(req.files.video[0].path)) {
      fs.unlinkSync(req.files.video[0].path);
    }
    
    res.status(500);
    throw new Error('Failed to update movie: ' + error.message);
  }
});

// @desc    Delete movie
// @route   DELETE /api/movies/:id
// @access  Private/Admin
const deleteMovie = asyncHandler(async (req, res) => {
  const movie = await Movie.findById(req.params.id);
  
  if (!movie) {
    res.status(404);
    throw new Error('Movie not found');
  }
  
  try {
    // Delete poster from Cloudinary if it exists
    if (movie.posterPublicId) {
      await deleteResource(movie.posterPublicId);
    }
    
    // Delete video from Cloudinary if it exists
    if (movie.videoPublicId) {
      await deleteResource(movie.videoPublicId, 'video');
    }
    
    // Delete movie from database
    await movie.deleteOne();
    
    res.json({ message: 'Movie removed' });
  } catch (error) {
    console.error('Error deleting movie:', error);
    res.status(500);
    throw new Error('Failed to delete movie: ' + error.message);
  }
});

// @desc    Get movie stream URL
// @route   GET /api/movies/:id/stream
// @access  Private/Approved
const getMovieStream = asyncHandler(async (req, res) => {
  console.log('Stream request received for movie ID:', req.params.id);
  
  try {
    const movie = await Movie.findById(req.params.id);
    
    if (!movie) {
      console.log('Movie not found');
      res.status(404);
      throw new Error('Movie not found');
    }
    
    if (!movie.videoUrl) {
      console.log('Movie video URL not available');
      res.status(404);
      throw new Error('Movie stream not available');
    }
    
    console.log('Returning stream URL:', movie.videoUrl);
    
    // Return the Cloudinary streaming URL
    res.json({ streamUrl: movie.videoUrl });
  } catch (error) {
    console.error('Error in getMovieStream:', error);
    res.status(500).json({ message: error.message });
  }
});

export { createMovie, getMovies, getMovieById, updateMovie, deleteMovie, getMovieStream };
