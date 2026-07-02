const jwt = require('jsonwebtoken');

/**
 * Middleware de protection JWT.
 * À utiliser sur toutes les routes de l'espace RH.
 *
 * Le token doit être envoyé dans le header :
 * Authorization: Bearer <token>
 */
const protect = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  // Vérifie que le header Authorization existe et commence par "Bearer "
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Accès refusé. Token manquant.',
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    // Vérifie et décode le token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Ajoute les infos de l'utilisateur RH à la requête
    req.user = decoded; // { id, email, role }
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Token invalide ou expiré. Veuillez vous reconnecter.',
    });
  }
};

module.exports = { protect };



