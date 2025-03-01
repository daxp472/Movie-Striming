const Movie = require('../models/movie.model');
const History = require('../models/history.model');
const { ApiError } = require('../utils/apiError');
const { getCache, setCache } = require('../utils/cache');

// Get movies list with filtering, searching, and sorting
const getMovies = async (req, res, next) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      genre, 
      search, 
      sort = 'latest' 
    } = req.query;
    
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    
    // Build query
    const query = {};
    
    // Filter by genre
    if (genre) {
      const genres = Array.isArray(genre) ? genre : [genre];
      query.genre = { $in: genres };
    }
    
    // Search by title or description
    if (search) {
      query.$text = { $search: search };
    }
    
    // Only show approved movies
    query.status = 'approved';
    
    // Cache key based on query parameters
    const cacheKey = `movies:${JSON.stringify(query)}:${sort}:${pageNum}:${limitNum}`;
    
    // Try to get from cache first
    const cachedData = await getCache(cacheKey);
    if (cachedData) {
      return res.status(200).json({
        success: true,
        data: cachedData
      });
    }
    
    // Define sort options
    let sortOption = {};
    switch (sort) {
      case 'popular':
        sortOption = { views: -1 };
        break;
      case 'rating':
        sortOption = { rating: -1 };
        break;
      case 'latest':
      default:
        sortOption = { createdAt: -1 };
    }
    
    // Execute query with pagination
    const movies = await Movie.find(query)
      .sort(sortOption)
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum);
    
    // Get total count for pagination
    const total = await Movie.countDocuments(query);
    
    const result = {
      movies,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        pages: Math.ceil(total / limitNum)
      }
    };
    
    // Cache the result
    await setCache(cacheKey, result, 600); // Cache for 10 minutes
    
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};

// Get movie details by ID
const getMovieById = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Try to get from cache first
    const cacheKey = `movie:${id}`;
    const cachedMovie = await getCache(cacheKey);
    
    if (cachedMovie) {
      return res.status(200).json({
        success: true,
        data: {
          movie: cachedMovie
        }
      });
    }
    
    const movie = await Movie.findById(id);
    
    if (!movie) {
      throw new ApiError(404, 'Movie not found');
    }
    
    // Increment view count
    movie.views += 1;
    await movie.save();
    
    // Cache the result
    await setCache(cacheKey, movie, 3600); // Cache for 1 hour
    
    res.status(200).json({
      success: true,
      data: {
        movie
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get movie stream
const getMovieStream = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    const movie = await Movie.findById(id);
    
    if (!movie) {
      throw new ApiError(404, 'Movie not found');
    }
    
    // Check if movie is approved
    if (movie.status !== 'approved') {
      throw new ApiError(403, 'This movie is not available for streaming');
    }
    
    // Update or create history entry
    await History.findOneAndUpdate(
      { userId, movieId: id },
      { 
        $inc: { watchCount: 1 },
        lastWatched: new Date()
      },
      { upsert: true }
    );
    
    // Return video URL
    res.status(200).json({
      success: true,
      data: {
        streamUrl: movie.videoUrl
      }
    });
  } catch (error) {
    next(error);
  }
};

// Update movie progress
const updateMovieProgress = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { progress, completed } = req.body;
    const userId = req.user.id;
    
    const movie = await Movie.findById(id);
    
    if (!movie) {
      throw new ApiError(404, 'Movie not found');
    }
    
    // Calculate if movie should be marked as completed
    // (if progress is >= 90% of duration)
    const isCompleted = completed || (progress >= movie.duration * 0.9);
    
    // Update history
    const history = await History.findOneAndUpdate(
      { userId, movieId: id },
      { 
        progress,
        completed: isCompleted,
        lastWatched: new Date()
      },
      { 
        upsert: true,
        new: true
      }
    );
    
    res.status(200).json({
      success: true,
      message: 'Progress updated successfully',
      data: {
        history
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get recommended movies
const getRecommendedMovies = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { limit = 10 } = req.query;
    const limitNum = parseInt(limit);
    
    // Try to get from cache first
    const cacheKey = `recommendations:${userId}:${limitNum}`;
    const cachedRecommendations = await getCache(cacheKey);
    
    if (cachedRecommendations) {
      return res.status(200).json({
        success: true,
        data: {
          recommendations: cachedRecommendations
        }
      });
    }
    
    // Get user's watch history
    const userHistory = await History.find({ userId })
      .sort({ lastWatched: -1 })
      .limit(20)
      .populate('movieId', 'genre');
    
    // Extract genres from watch history
    const userGenres = {};
    userHistory.forEach(history => {
      if (history.movieId && history.movieId.genre) {
        history.movieId.genre.forEach(genre => {
          userGenres[genre] = (userGenres[genre] || 0) + 1;
        });
      }
    });
    
    // Sort genres by frequency
    const preferredGenres = Object.keys(userGenres).sort(
      (a, b) => userGenres[b] - userGenres[a]
    ).slice(0, 5);
    
    // Get watched movie IDs to exclude
    const watchedMovieIds = userHistory.map(h => h.movieId._id);
    
    // Find recommendations based on preferred genres
    const recommendations = await Movie.find({
      _id: { $nin: watchedMovieIds },
      genre: { $in: preferredGenres },
      status: 'approved'
    })
    .sort({ rating: -1, views: -1 })
    .limit(limitNum);
    
    // If not enough recommendations, add popular movies
    if (recommendations.length < limitNum) {
      const additionalCount = limitNum - recommendations.length;
      const existingIds = recommendations.map(r => r._id);
      
      const popularMovies = await Movie.find({
        _id: { 
          $nin: [...watchedMovieIds, ...existingIds]
        },
        status: 'approved'
      })
      .sort({ views: -1 })
      .limit(additionalCount);
      
      recommendations.push(...popularMovies);
    }
    
    // Cache the result
    await setCache(cacheKey, recommendations, 3600); // Cache for 1 hour
    
    res.status(200).json({
      success: true,
      data: {
        recommendations
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMovies,
  getMovieById,
  getMovieStream,
  updateMovieProgress,
  getRecommendedMovies
};