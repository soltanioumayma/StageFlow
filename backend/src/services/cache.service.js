
const logger = require('../utils/logger');


const statsCache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes


const getCachedStats = (key) => {
  const cached = statsCache.get(key);
  if (!cached) return null;
  
  const now = Date.now();
  if (now > cached.expiresAt) {
    statsCache.delete(key);
    return null;
  }
  
  logger.info('Stats récupérées du cache', { key });
  return cached.data;
};


const setCachedStats = (key, data) => {
  statsCache.set(key, {
    data,
    expiresAt: Date.now() + CACHE_TTL,
    createdAt: Date.now(),
  });
  logger.info('Stats mises en cache', { key });
};


const invalidateCache = (key) => {
  statsCache.delete(key);
  logger.info('Cache invalidé', { key });
};


const invalidateAllCache = () => {
  const size = statsCache.size;
  statsCache.clear();
  logger.info('Tout le cache invalidé', { size });
};


const getCacheStats = () => {
  return {
    size: statsCache.size,
    keys: Array.from(statsCache.keys()),
  };
};

module.exports = {
  getCachedStats,
  setCachedStats,
  invalidateCache,
  invalidateAllCache,
  getCacheStats,
};



