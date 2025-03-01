const express = require('express');
const { authenticate } = require('../middleware/auth.middleware');
const { 
  getWatchlist, 
  addToWatchlist, 
  removeFromWatchlist,
  checkWatchlist
} = require('../controllers/watchlist.controller');

const router = express.Router();

// All routes require authentication
router.use(authenticate);

router.get('/', getWatchlist);
router.post('/:movieId', addToWatchlist);
router.delete('/:movieId', removeFromWatchlist);
router.get('/:movieId/check', checkWatchlist);

module.exports = router;