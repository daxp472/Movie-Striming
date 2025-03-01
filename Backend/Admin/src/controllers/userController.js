const User = require('../models/User');
const { validationResult } = require('express-validator');

exports.getAllUsers = async (req, res) => {
  try {
    const { status, tier, page = 1, limit = 10 } = req.query;
    const query = {};

    if (status) query.status = status;
    if (tier) query.tier = tier;

    const users = await User.find(query)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .select('-password');

    const total = await User.countDocuments(query);

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          total,
          pages: Math.ceil(total / limit),
          currentPage: parseInt(page),
          perPage: parseInt(limit)
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching users',
      error: {
        code: 'FETCH_FAILED',
        details: error.message
      }
    });
  }
};

exports.updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, reason } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
        error: {
          code: 'NOT_FOUND',
          details: 'User with provided ID does not exist'
        }
      });
    }

    user.status = status;
    user.activityLog.push({
      action: 'STATUS_CHANGE',
      details: `Status changed to ${status}. Reason: ${reason}`
    });

    await user.save();

    res.json({
      success: true,
      message: 'User status updated successfully',
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating user status',
      error: {
        code: 'UPDATE_FAILED',
        details: error.message
      }
    });
  }
};

exports.updateUserTier = async (req, res) => {
  try {
    const { id } = req.params;
    const { tier, validUntil } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
        error: {
          code: 'NOT_FOUND',
          details: 'User with provided ID does not exist'
        }
      });
    }

    user.tier = tier;
    user.tierValidUntil = validUntil;
    user.activityLog.push({
      action: 'TIER_CHANGE',
      details: `Subscription tier changed to ${tier}`
    });

    await user.save();

    res.json({
      success: true,
      message: 'User tier updated successfully',
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating user tier',
      error: {
        code: 'UPDATE_FAILED',
        details: error.message
      }
    });
  }
};

exports.getUserActivity = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select('activityLog');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
        error: {
          code: 'NOT_FOUND',
          details: 'User with provided ID does not exist'
        }
      });
    }

    res.json({
      success: true,
      data: user.activityLog
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching user activity',
      error: {
        code: 'FETCH_FAILED',
        details: error.message
      }
    });
  }
};

exports.handleComplaints = async (req, res) => {
  try {
    const { id } = req.params;
    const { subject, description } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
        error: {
          code: 'NOT_FOUND',
          details: 'User with provided ID does not exist'
        }
      });
    }

    user.complaints.push({
      subject,
      description,
      status: 'open',
      timestamp: new Date()
    });

    await user.save();

    res.status(201).json({
      success: true,
      message: 'Complaint registered successfully',
      data: user.complaints[user.complaints.length - 1]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error handling complaint',
      error: {
        code: 'COMPLAINT_FAILED',
        details: error.message
      }
    });
  }
};