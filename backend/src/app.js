const express = require('express');
const cors    = require('cors');
const helmet  = require('helmet');
const path    = require('path');
const { protect } = require('./middleware/auth.middleware');
const { rateLimit } = require('./middleware/rateLimit.middleware');

const authRoutes         = require('./routes/auth.routes');
const candidatureRoutes  = require('./routes/candidature.routes');
const hrRoutes           = require('./routes/hr.routes');

const app = express();

app.use(helmet());                        // Security headers (X-Content-Type-Options, X-Frame-Options, etc.)

const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:3000').split(',');
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

app.use(express.json({ limit: '1mb' }));  // Parse les requêtes JSON (size-limited)
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Rend le dossier "uploads" accessible aux utilisateurs RH authentifiés uniquement
app.use('/uploads', protect, express.static(path.join(__dirname, '../../uploads')));

app.use('/api/auth',         authRoutes);          // Login RH
app.use('/api/candidatures', rateLimit({ windowMs: 15 * 60 * 1000, max: 30, message: 'Trop de requêtes. Réessayez plus tard.' }), candidatureRoutes);   // Dépôt de candidature (public, rate-limited)
app.use('/api/hr',           hrRoutes);            // Espace RH (protégé JWT)

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'StageFlow API opérationnelle' });
});

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route introuvable' });
});

app.use((err, req, res, next) => {
  console.error('❌ Erreur serveur :', err.message);
  res.status(500).json({ success: false, message: 'Erreur interne du serveur' });
});

module.exports = app;
