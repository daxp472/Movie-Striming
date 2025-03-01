const Watchlist = require('../models/watchlist.model');
const { ApiError } = require('../utils/apiError');

// Get user's watchlist
const getWatchlist = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10 } = req.query;
    
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    
    // Get watchlist with movie details
    const watchlist = await Watchlist.find({ userId })
      .sort({ addedAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum)
      .populate('movieId', 'title thumbnail duration genre rating');
    
    // Get total count for pagination
    const total = await Watchlist.countDocuments({ userId });
    
    res.status(200).json({
      success: true,
      data: {
        watchlist,
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          pages: Math.ceil(total / limitNum)
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// Add to watchlist
const addToWatchlist = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { movieId } = req.params;
    
    // Check if already in watchlist
    const existingEntry = await Watchlist.findOne({ userId, movieId });
    
    if (existingEntry) {
      return res.status(200).json({
        success: true,
        message: 'Movie already in watchlist'
      });
    }
    
    // Add to watchlist
    const watchlistEntry = new Watchlist({
      userId,
      movieId,
      addedAt: new Date()
    });
    
    await watchlistEntry.save();
    
    res.status(201).json({
      success: true,
      message: 'Added to watchlist successfully',
      data: {
        watchlist: watchlistEntry
      }
    });
  } catch (error) {
    next(error);
  }
};

// Remove from watchlist
const removeFromWatchlist = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { movieId } = req.params;
    
    const result = await Watchlist.findOneAndDelete({ userId, movieId });
    
    if (!result) {
      throw new ApiError(404, 'Movie not found in watchlist');
    }
    
    res.status(200).json({
      success: true,
      message: 'Removed from watchlist successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Check if movie is in watchlist
const checkWatchlist = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { movieId } = req.params;
    
    const inWatchlist = await Watchlist.exists({ userId, movieId });
    
    res.status(200).json({
      success: true,
      data: {
        inWatchlist: !!inWatchlist
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getWatchlist,
  addToWatchlist,
  removeFromWatchlist,
  checkWatchlist
};