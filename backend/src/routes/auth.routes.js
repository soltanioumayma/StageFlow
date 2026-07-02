// ============================================================
// routes/auth.routes.js
// Routes d'authentification
// ============================================================
const express        = require('express');
const { login, getMe, refreshToken } = require('../controllers/auth.controller');
const { protect }    = require('../middleware/auth.middleware');
const { validateLogin } = require('../middleware/validation.middleware');
const { loginRateLimit } = require('../middleware/rateLimit.middleware');

const router = express.Router();

// POST /api/auth/login  → connexion (public) avec rate limiting
router.post('/login', loginRateLimit, validateLogin, login);

// POST /api/auth/refresh  → rafraîchir le token (public)
router.post('/refresh', refreshToken);

// GET /api/auth/me  → profil de l'utilisateur connecté (protégé)
router.get('/me', protect, getMe);

module.exports = router;
