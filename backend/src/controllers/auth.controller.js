const bcrypt = require('bcryptjs');
const jwt    = require('jsonwebtoken');
const RhUser = require('../models/RhUser.model');
const { successResponse, errorResponse, unauthorizedResponse } = require('../utils/responseHandler');
const logger = require('../utils/logger'); // ← CORRIGÉ : plus de { logger }


const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return errorResponse(res, 'Email et mot de passe requis.', 400);
  }

  try {

    const user = await RhUser.findByEmail(email.toLowerCase().trim());

    if (!user) {
      logger.warn('Tentative de connexion avec email inexistant', { email });
      return unauthorizedResponse(res, 'Email ou mot de passe incorrect.');
    }

    const passwordMatch = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatch) {
      logger.warn('Tentative de connexion avec mot de passe incorrect', { email });
      return unauthorizedResponse(res, 'Email ou mot de passe incorrect.');
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '30m' }
    );

    const refreshToken = jwt.sign(
      { id: user.id, email: user.email, type: 'refresh' },
      process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

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


