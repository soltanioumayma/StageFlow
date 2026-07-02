const crypto = require('crypto');

const csrfTokens = new Map();

/**
 * Génère un token CSRF
 */
const generateCsrfToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

/**
 * Middleware pour générer et valider les tokens CSRF
 */
const csrfProtection = (req, res, next) => {
  // Pour les requêtes GET, génère un nouveau token
  if (req.method === 'GET') {
    const token = generateCsrfToken();
    csrfTokens.set(token, Date.now());
    
    // Nettoyer les anciens tokens (plus de 1 heure)
    const oneHourAgo = Date.now() - 3600000;
    for (const [existingToken, timestamp] of csrfTokens.entries()) {
      if (timestamp < oneHourAgo) {
        csrfTokens.delete(existingToken);
      }
    }
    
    res.setHeader('X-CSRF-Token', token);
    return next();
  }

  // Pour les requêtes POST/PATCH/DELETE, valider le token
  const token = req.headers['x-csrf-token'] || req.body._csrf;
  
  if (!token || !csrfTokens.has(token)) {
    return res.status(403).json({
      success: false,
      message: 'Token CSRF invalide ou manquant',
    });
  }

  // Valider que le token n'est pas trop ancien (1 heure)
  const tokenTimestamp = csrfTokens.get(token);
  const oneHourAgo = Date.now() - 3600000;
  
  if (tokenTimestamp < oneHourAgo) {
    csrfTokens.delete(token);
    return res.status(403).json({
      success: false,
      message: 'Token CSRF expiré',
    });
  }

  // Token valide - consommer le token (one-time use)
  csrfTokens.delete(token);
  next();
};

module.exports = { csrfProtection, generateCsrfToken };



