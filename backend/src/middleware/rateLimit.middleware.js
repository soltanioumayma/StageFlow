
const rateLimitMap = new Map();


const rateLimit = (options = {}) => {
  const {
    windowMs = 15 * 60 * 1000, // 15 minutes
    max = 5, // 5 tentatives
    message = 'Trop de tentatives. Réessayez plus tard.'
  } = options;

  return (req, res, next) => {
    const key = req.ip + req.path;
    const now = Date.now();
    const windowStart = now - windowMs;

    // Nettoyer les anciennes entrées
    if (rateLimitMap.has(key)) {
      const requests = rateLimitMap.get(key).filter(time => time > windowStart);
      rateLimitMap.set(key, requests);
    }

    // Vérifier le nombre de requêtes
    const requests = rateLimitMap.get(key) || [];
    
    if (requests.length >= max) {
      return res.status(429).json({
        success: false,
        message,
        retryAfter: Math.ceil((requests[0] + windowMs - now) / 1000)
      });
    }

    // Ajouter la requête actuelle
    requests.push(now);
    rateLimitMap.set(key, requests);

    next();
  };
};


const loginRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 tentatives
  message: 'Trop de tentatives de connexion. Réessayez dans 15 minutes.'
});

module.exports = { rateLimit, loginRateLimit };



