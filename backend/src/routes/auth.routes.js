const express        = require('express');
const { login, getMe, refreshToken } = require('../controllers/auth.controller');
const { protect }    = require('../middleware/auth.middleware');
const { validateLogin } = require('../middleware/validation.middleware');
const { loginRateLimit } = require('../middleware/rateLimit.middleware');

const router = express.Router();

router.post('/login', loginRateLimit, validateLogin, login);

router.post('/refresh', refreshToken);

router.get('/me', protect, getMe);

module.exports = router;



