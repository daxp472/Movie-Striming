const express = require('express');
const router = express.Router();
const { isAdmin } = require('../middleware/auth');
const { createMovie, updateMovie, deleteMovie, uploadSeriesBatch } = require('../controllers/movieController');
const multer = require('multer');
const { body } = require('express-validator');

const upload = multer({ dest: 'uploads/' });

const validGenres = ['Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 'Horror', 'Mystery', 'Romance', 'Sci-Fi', 'Thriller', 'Western'];

const validateMovie = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('releaseDate').isDate().withMessage('Invalid release date format'),
  body('duration').isInt({ min: 1 }).withMessage('Duration must be a positive number'),
  body('languages').custom(value => {
    try {
      const languages = JSON.parse(value);
      if (!Array.isArray(languages) || languages.length === 0) {
        throw new Error('Languages must be a non-empty array');
      }
      return true;
    } catch (error) {
      throw new Error('Invalid languages format');
    }
  }),
  body('genres').custom(value => {
    try {
      const genres = JSON.parse(value);
      if (!Array.isArray(genres) || genres.length === 0) {
        throw new Error('Genres must be a non-empty array');
      }
      if (!genres.every(genre => validGenres.includes(genre))) {
        throw new Error('Invalid genre(s) provided');
      }
      return true;
    } catch (error) {
      throw new Error('Invalid genres format');
    }
  }),
  body('trailerUrl')
    .matches(/^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})$/)
    .withMessage('Invalid YouTube URL format'),
  body('cloudinaryAccountId')
    .isIn(['1', '2', '3', '4', '5'])
    .withMessage('Invalid Cloudinary account ID'),
  body('isSeries')
    .isBoolean()
    .withMessage('isSeries must be a boolean'),
  body('seasonNumber')
    .if(body('isSeries').equals('true'))
    .isInt({ min: 1 })
    .withMessage('Season number must be a positive integer'),
  body('episodeNumber')
    .if(body('isSeries').equals('true'))
    .isInt({ min: 1 })
    .withMessage('Episode number must be a positive integer')
];

// Create movie route with multiple file uploads
router.post(
  '/',
  isAdmin,
  upload.fields([
    { name: 'video', maxCount: 1 },
    { name: 'thumbnail', maxCount: 1 },
    { name: 'subtitles', maxCount: 10 },
    { name: 'audioTracks', maxCount: 5 }
  ]),
  validateMovie,
  createMovie
);

// Update movie route
router.put(
  '/:id',
  isAdmin,
  upload.single('thumbnail'),
  validateMovie.map(validation => validation.optional()),
  updateMovie
);

// Delete movie route
router.delete('/:id', isAdmin, deleteMovie);

// Upload series batch
router.post(
  '/series-batch',
  isAdmin,
  upload.array('episodes'),
  [
    body('seriesInfo').isObject().withMessage('Series info is required'),
    body('seriesInfo.title').notEmpty().withMessage('Series title is required'),
    body('seriesInfo.seasonNumber').isInt({ min: 1 }).withMessage('Valid season number is required')
  ],
  uploadSeriesBatch
);

module.exports = router;