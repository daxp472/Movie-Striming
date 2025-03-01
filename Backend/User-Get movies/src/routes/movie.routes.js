const express = require('express');
const { authenticate } = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validate.middleware');
const { 
  getMovies, 
  getMovieById, 
  getMovieStream, 
  updateMovieProgress,
  getRecommendedMovies
} = require('../controllers/movie.controller');
const { 
  updateProgressSchema 
} = require('../validations/movie.validation');

const router = express.Router();

// Public routes
router.get('/', getMovies);
router.get('/:id', getMovieById);

// Protected routes
router.get('/:id/stream', authenticate, getMovieStream);
router.post('/:id/progress', authenticate, validate(updateProgressSchema), updateMovieProgress);
router.get('/recommendations/list', authenticate, getRecommendedMovies);

module.exports = router;