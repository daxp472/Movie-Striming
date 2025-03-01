const redis = require('redis');
const { logger } = require('./logger');

let redisClient;

const initRedis = async () => {
  try {
    redisClient = redis.createClient({
      url: process.env.REDIS_URL
    });

    redisClient.on('error', (err) => {
      logger.error('Redis Client Error', err);
    });

    await redisClient.connect();
    logger.info('Redis client connected');
    
    return redisClient;
  } catch (error) {
    logger.error('Redis connection failed:', error);
    // Continue without Redis if connection fails
    return null;
  }
};

const getCache = async (key) => {
  if (!redisClient || !redisClient.isOpen) return null;
  
  try {
    const data = await redisClient.get(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    logger.error(`Cache get error for key ${key}:`, error);
    return null;
  }
};

const setCache = async (key, data, expiry = 3600) => {
  if (!redisClient || !redisClient.isOpen) return;
  
  try {
    await redisClient.set(key, JSON.stringify(data), {
      EX: expiry
    });
  } catch (error) {
    logger.error(`Cache set error for key ${key}:`, error);
  }
};

const deleteCache = async (key) => {
  if (!redisClient || !redisClient.isOpen) return;
  
  try {
    await redisClient.del(key);
  } catch (error) {
    logger.error(`Cache delete error for key ${key}:`, error);
  }
};

const clearCache = async (pattern) => {
  if (!redisClient || !redisClient.isOpen) return;
  
  try {
    const keys = await redisClient.keys(pattern);
    if (keys.length > 0) {
      await redisClient.del(keys);
    }
  } catch (error) {
    logger.error(`Cache clear error for pattern ${pattern}:`, error);
  }
};

module.exports = {
  initRedis,
  getCache,
  setCache,
  deleteCache,
  clearCache
};