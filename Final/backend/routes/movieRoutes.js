import express from 'express';
import { 
  createMovie, 
  getMovies, 
  getMovieById, 
  updateMovie, 
  deleteMovie,
  getMovieStream
} from '../controllers/movieController.js';
import { uploadSeason } from '../controllers/seasonController.js';
import { protect, admin, approved } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

// Configure multer for movie uploads (kept for backward compatibility)
const movieUpload = upload.fields([
  { name: 'poster', maxCount: 1 },
  { name: 'video', maxCount: 1 }
]);

// Configure multer for season uploads
const seasonUpload = upload.fields([
  { name: 'episodes', maxCount: 50 } // Allow up to 50 episodes per season
]);

// @route   POST /api/movies
// Using direct Cloudinary upload, so no need for multer middleware
router.post('/', protect, admin, createMovie);

// @route   POST /api/movies/season-upload
// Bulk upload entire season
router.post('/season-upload', protect, admin, seasonUpload, uploadSeason);

// @route   GET /api/movies
router.get('/', getMovies);

// @route   GET /api/movies/:id
router.get('/:id', getMovieById);

// @route   GET /api/movies/:id/stream
// Only approved users can stream movies
router.get('/:id/stream', protect, approved, getMovieStream);

// @route   PUT /api/movies/:id
// Using direct Cloudinary upload, so no need for multer middleware
router.put('/:id', protect, admin, updateMovie);

// @route   DELETE /api/movies/:id
router.delete('/:id', protect, admin, deleteMovie);

export default router;
