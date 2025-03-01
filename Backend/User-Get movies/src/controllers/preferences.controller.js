const Preferences = require('../models/preferences.model');
const { ApiError } = require('../utils/apiError');

// Get user preferences
const getPreferences = async (req, res, next) => {
  try {
    const userId = req.user.id;
    
    let preferences = await Preferences.findOne({ userId });
    
    // If preferences don't exist, create default preferences
    if (!preferences) {
      preferences = await Preferences.create({
        userId,
        preferredGenres: [],
        language: 'en',
        subtitles: true,
        autoplay: true,
        notifications: true
      });
    }
    
    res.status(200).json({
      success: true,
      data: {
        preferences
      }
    });
  } catch (error) {
    next(error);
  }
};

// Update user preferences
const updatePreferences = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const {
      preferredGenres,
      language,
      subtitles,
      autoplay,
      notifications
    } = req.body;
    
    // Find and update preferences
    const preferences = await Preferences.findOneAndUpdate(
      { userId },
      {
        ...(preferredGenres !== undefined && { preferredGenres }),
        ...(language !== undefined && { language }),
        ...(subtitles !== undefined && { subtitles }),
        ...(autoplay !== undefined && { autoplay }),
        ...(notifications !== undefined && { notifications }),
        updatedAt: new Date()
      },
      {
        new: true,
        upsert: true,
        runValidators: true
      }
    );
    
    res.status(200).json({
      success: true,
      message: 'Preferences updated successfully',
      data: {
        preferences
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPreferences,
  updatePreferences
};