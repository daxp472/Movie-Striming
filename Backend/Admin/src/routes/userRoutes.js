const express = require('express');
const router = express.Router();
const { isAdmin } = require('../middleware/auth');
const {
  getAllUsers,
  updateUserStatus,
  updateUserTier,
  getUserActivity,
  handleComplaints
} = require('../controllers/userController');
const { body } = require('express-validator');

// Get all users with filters
router.get('/', isAdmin, getAllUsers);

// Update user status
router.put(
  '/:id/status',
  isAdmin,
  [
    body('status')
      .isIn(['active', 'suspended', 'banned'])
      .withMessage('Invalid status value'),
    body('reason')
      .notEmpty()
      .withMessage('Reason is required')
  ],
  updateUserStatus
);

// Update user tier
router.put(
  '/:id/tier',
  isAdmin,
  [
    body('tier')
      .isIn(['basic', 'premium', 'vip'])
      .withMessage('Invalid tier value'),
    body('validUntil')
      .isISO8601()
      .withMessage('Valid date is required for tier expiration')
  ],
  updateUserTier
);

// Get user activity logs
router.get('/:id/activity', isAdmin, getUserActivity);

// Handle user complaints
router.post(
  '/:id/complaints',
  isAdmin,
  [
    body('subject').notEmpty().withMessage('Subject is required'),
    body('description').notEmpty().withMessage('Description is required')
  ],
  handleComplaints
);

module.exports = router;