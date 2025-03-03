import express from 'express';
import { 
  getCurrentUser, 
  getAllUsers, 
  approveUser, 
  rejectUser 
} from '../controllers/userController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// @route   GET /api/users/me
router.get('/me', protect, getCurrentUser);

// @route   GET /api/users
router.get('/', protect, admin, getAllUsers);

// @route   PATCH /api/users/:id/approve
router.patch('/:id/approve', protect, admin, approveUser);

// @route   PATCH /api/users/:id/reject
router.patch('/:id/reject', protect, admin, rejectUser);

export default router;
