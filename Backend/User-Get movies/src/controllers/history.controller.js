const History = require('../models/history.model');
const { ApiError } = require('../utils/apiError');

// Get user's watch history
const getWatchHistory = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10, sort = 'recent' } = req.query;
    
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    
    // Define sort options
    let sortOption = {};
    switch (sort) {
      case 'mostWatched':
        sortOption = { watchCount: -1 };
        break;
      case 'recent':
      default:
        sortOption = { lastWatched: -1 };
    }
    
    // Get history with movie details
    const history = await History.find({ userId })
      .sort(sortOption)
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum)
      .populate('movieId', 'title thumbnail duration genre rating');
    
    // Get total count for pagination
    const total = await History.countDocuments({ userId });
    
    res.status(200).json({
      success: true,
      data: {
        history,
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

// Add to watch history
const addToHistory = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { movieId, progress, completed } = req.body;
    
    // Check if entry already exists
    const existingEntry = await History.findOne({ userId, movieId });
    
    if (existingEntry) {
      // Update existing entry
      existingEntry.progress = progress;
      existingEntry.completed = completed;
      existingEntry.lastWatched = new Date();
      existingEntry.watchCount += 1;
      
      await existingEntry.save();
      
      return res.status(200).json({
        success: true,
        message: 'History updated successfully',
        data: {
          history: existingEntry
        }
      });
    }
    
    // Create new entry
    const historyEntry = new History({
      userId,
      movieId,
      progress,
      completed,
      lastWatched: new Date()
    });
    
    await historyEntry.save();
    
    res.status(201).json({
      success: true,
      message: 'Added to history successfully',
      data: {
        history: historyEntry
      }
    });
  } catch (error) {
    next(error);
  }
};

// Clear watch history
const clearHistory = async (req, res, next) => {
  try {
    const userId = req.user.id;
    
    await History.deleteMany({ userId });
    
    res.status(200).json({
      success: true,
      message: 'Watch history cleared successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Remove specific item from history
const removeFromHistory = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { movieId } = req.params;
    
    const result = await History.findOneAndDelete({ userId, movieId });
    
    if (!result) {
      throw new ApiError(404, 'History entry not found');
    }
    
    res.status(200).json({
      success: true,
      message: 'Removed from history successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getWatchHistory,
  addToHistory,
  clearHistory,
  removeFromHistory
};