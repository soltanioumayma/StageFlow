
const LOG_LEVELS = {
  ERROR: 'ERROR',
  WARN: 'WARN',
  INFO: 'INFO',
  DEBUG: 'DEBUG',
};


const formatMessage = (level, message, meta = null) => {
  const timestamp = new Date().toISOString();
  let logMessage = `[${timestamp}] [${level}] ${message}`;
  
  if (meta) {
    logMessage += ` | ${JSON.stringify(meta)}`;
  }
  
  return logMessage;
};


const error = (message, meta = null) => {
  console.error(formatMessage(LOG_LEVELS.ERROR, message, meta));
};


const warn = (message, meta = null) => {
  console.warn(formatMessage(LOG_LEVELS.WARN, message, meta));
};


const info = (message, meta = null) => {
  console.log(formatMessage(LOG_LEVELS.INFO, message, meta));
};


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



