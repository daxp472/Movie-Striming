const express = require('express');
const { authenticate } = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validate.middleware');
const { 
  getWatchHistory, 
  addToHistory, 
  clearHistory,
  removeFromHistory
} = require('../controllers/history.controller');
const { 
  addToHistorySchema 
} = require('../validations/history.validation');

const router = express.Router();

// All routes require authentication
router.use(authenticate);

router.get('/', getWatchHistory);
router.post('/', validate(addToHistorySchema), addToHistory);
router.delete('/', clearHistory);
router.delete('/:movieId', removeFromHistory);

module.exports = router;