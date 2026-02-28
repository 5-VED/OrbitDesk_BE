const Redis = require('ioredis');
const logger = require('../Utils/logger.utils');

let client = null;

const connectRedis = () => {
  if (client) return client;

  client = new Redis({
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
  });

  client.on('error', err => {
    logger.error('Redis connection error:', err);
  });

  client.on('connect', () => {
    logger.info('Connected to Redis');
  });

  return client;
};

const getRedisClient = () => {
  if (!client) {
    throw new Error('Redis not initialized. Call connectRedis() first.');
  }
  return client;
};

module.exports = { connectRedis, getRedisClient };
