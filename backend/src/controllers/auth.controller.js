const bcrypt = require('bcryptjs');
const jwt    = require('jsonwebtoken');
const RhUser = require('../models/RhUser.model');
const { successResponse, errorResponse, unauthorizedResponse } = require('../utils/responseHandler');
const logger = require('../utils/logger'); // ← CORRIGÉ : plus de { logger }

/**
 * POST /api/auth/login
 * Corps : { email, password }
 * Retourne : { token, user }
 */
const login = async (req, res) => {
  const { email, password } = req.body;

  // Validation basique
  if (!email || !password) {
    return errorResponse(res, 'Email et mot de passe requis.', 400);
  }

  try {
    // Cherche l'utilisateur RH par email
    const user = await RhUser.findByEmail(email.toLowerCase().trim());

    // Si l'utilisateur n'existe pas
    if (!user) {
      logger.warn('Tentative de connexion avec email inexistant', { email });
      return unauthorizedResponse(res, 'Email ou mot de passe incorrect.');
    }

    // Vérifie le mot de passe hashé
    const passwordMatch = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatch) {
      logger.warn('Tentative de connexion avec mot de passe incorrect', { email });
      return unauthorizedResponse(res, 'Email ou mot de passe incorrect.');
    }

    // Génère le token JWT (valable 30 minutes pour la sécurité)
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '30m' }
    );

    // Génère un refresh token (valable 7 jours)
    const refreshToken = jwt.sign(
      { id: user.id, email: user.email, type: 'refresh' },
      process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Retourne le token et les infos de base (sans le mot de passe!)
    logger.info('Connexion réussie', { email, userId: user.id });
    return successResponse(res, {
      token,
      refreshToken,
      user: {
        id:     user.id,
        email:  user.email,
        nom:    user.nom,
        prenom: user.prenom,
        role:   user.role,
      },
    }, 'Connexion réussie.');
  } catch (err) {
    logger.error('Erreur login', { error: err.message, email });
    return errorResponse(res, 'Erreur serveur lors de la connexion.');
  }
};

/**
 * GET /api/auth/me
 * Retourne les infos de l'utilisateur connecté (token requis)
 */
const getMe = async (req, res) => {
  try {
    const user = await RhUser.findById(req.user.id);

    if (!user) {
      return errorResponse(res, 'Utilisateur introuvable.', 404);
    }

    return successResponse(res, { user });
  } catch (err) {
    logger.error('Erreur getMe', { error: err.message, userId: req.user.id });
    return errorResponse(res, 'Erreur serveur.');
  }
};

/**
 * POST /api/auth/refresh
 * Rafraîchit le token d'accès avec le refresh token
 */
const refreshToken = async (req, res) => {
  const { refreshToken: token } = req.body;

  if (!token) {
    return errorResponse(res, 'Refresh token requis', 400);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET);
    
    if (decoded.type !== 'refresh') {
      return errorResponse(res, 'Token invalide', 401);
    }

    const user = await RhUser.findById(decoded.id);
    if (!user) {
      return errorResponse(res, 'Utilisateur introuvable', 404);
    }

    // Génère un nouveau token d'accès
    const newToken = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '30m' }
    );

    logger.info('Token rafraîchi', { userId: user.id });
    return successResponse(res, { token: newToken }, 'Token rafraîchi avec succès');
  } catch (err) {
    logger.error('Erreur refresh token', { error: err.message });
    return errorResponse(res, 'Refresh token invalide ou expiré', 401);
  }
};

module.exports = { login, getMe, refreshToken };


