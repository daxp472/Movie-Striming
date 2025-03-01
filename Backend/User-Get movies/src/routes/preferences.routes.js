const express = require('express');
const { authenticate } = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validate.middleware');
const { 
  getPreferences, 
  updatePreferences 
} = require('../controllers/preferences.controller');
const { 
  updatePreferencesSchema 
} = require('../validations/preferences.validation');

const router = express.Router();

// All routes require authentication
router.use(authenticate);

router.get('/', getPreferences);
router.put('/', validate(updatePreferencesSchema), updatePreferences);

module.exports = router;