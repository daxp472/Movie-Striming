require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const authRoutes = require('./routes/auth.routes');
const movieRoutes = require('./routes/movie.routes');
const historyRoutes = require('./routes/history.routes');
const watchlistRoutes = require('./routes/watchlist.routes');
const preferencesRoutes = require('./routes/preferences.routes');
const { errorHandler } = require('./middleware/error.middleware');
const { logger } = require('./utils/logger');

const app = express();
const PORT = process.env.PORT || 5001;

// Connect to MongoDB with retry logic
const connectWithRetry = () => {
  mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
      logger.info('Connected to MongoDB');
    })
    .catch((err) => {
      logger.error('MongoDB connection error:', err);
      logger.info('Retrying in 5 seconds...');
      setTimeout(connectWithRetry, 5000);
    });
};

connectWithRetry();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('combined'));

// Rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many requests from this IP, please try again after 15 minutes'
});
app.use('/api/', apiLimiter);

// Cache error handling
app.use((err, req, res, next) => {
  if (err.name === 'CacheError') {
    logger.error('Cache error:', err);
    return next(); // Continue without cache
  }
  next(err);
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/watchlist', watchlistRoutes);
app.use('/api/preferences', preferencesRoutes);

// Error handling middleware
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  logger.info(`User API running on port ${PORT}`);
});

module.exports = app;