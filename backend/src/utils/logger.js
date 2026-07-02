// ============================================================
// utils/logger.js
// Logger simple pour le suivi des erreurs et informations
// ============================================================

const LOG_LEVELS = {
  ERROR: 'ERROR',
  WARN: 'WARN',
  INFO: 'INFO',
  DEBUG: 'DEBUG',
};

/**
 * Formate le message de log avec timestamp
 */
const formatMessage = (level, message, meta = null) => {
  const timestamp = new Date().toISOString();
  let logMessage = `[${timestamp}] [${level}] ${message}`;
  
  if (meta) {
    logMessage += ` | ${JSON.stringify(meta)}`;
  }
  
  return logMessage;
};

/**
 * Logger d'erreur
 */
const error = (message, meta = null) => {
  console.error(formatMessage(LOG_LEVELS.ERROR, message, meta));
};

/**
 * Logger d'avertissement
 */
const warn = (message, meta = null) => {
  console.warn(formatMessage(LOG_LEVELS.WARN, message, meta));
};

/**
 * Logger d'information
 */
const info = (message, meta = null) => {
  console.log(formatMessage(LOG_LEVELS.INFO, message, meta));
};

/**
 * Logger de debug
 */
const debug = (message, meta = null) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(formatMessage(LOG_LEVELS.DEBUG, message, meta));
  }
};

module.exports = {
  error,
  warn,
  info,
  debug,
  LOG_LEVELS,
};
