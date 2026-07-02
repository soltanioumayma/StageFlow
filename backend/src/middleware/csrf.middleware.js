const crypto = require('crypto');

const csrfTokens = new Map();


const generateCsrfToken = () => {
  return crypto.randomBytes(32).toString('hex');
};


const csrfProtection = (req, res, next) => {

  if (req.method === 'GET') {
    const token = generateCsrfToken();
    csrfTokens.set(token, Date.now());

    const oneHourAgo = Date.now() - 3600000;
    for (const [existingToken, timestamp] of csrfTokens.entries()) {
      if (timestamp < oneHourAgo) {
        csrfTokens.delete(existingToken);
      }
    }
    
    res.setHeader('X-CSRF-Token', token);
    return next();
  }

  const token = req.headers['x-csrf-token'] || req.body._csrf;
  
  if (!token || !csrfTokens.has(token)) {
    return res.status(403).json({
      success: false,
      message: 'Token CSRF invalide ou manquant',
    });
  }

  const tokenTimestamp = csrfTokens.get(token);
  const oneHourAgo = Date.now() - 3600000;
  
  if (tokenTimestamp < oneHourAgo) {
    csrfTokens.delete(token);
    return res.status(403).json({
      success: false,
      message: 'Token CSRF expiré',
    });
  }

  csrfTokens.delete(token);
  next();
};

module.exports = { csrfProtection, generateCsrfToken };



