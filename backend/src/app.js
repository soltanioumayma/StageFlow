const express = require('express');
const cors    = require('cors');
const path    = require('path');

const authRoutes         = require('./routes/auth.routes');
const candidatureRoutes  = require('./routes/candidature.routes');
const hrRoutes           = require('./routes/hr.routes');
const logger             = require('./utils/logger');

const app = express();

app.use(cors());                          // Autorise le frontend (React) à appeler l'API
app.use(express.json());                  // Parse les requêtes JSON
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(__dirname, '../../uploads')));

app.use('/api/auth',         authRoutes);          // Login RH
app.use('/api/candidatures', candidatureRoutes);   // Dépôt de candidature (public)
app.use('/api/hr',           hrRoutes);            // Espace RH (protégé JWT)

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'StageFlow API opérationnelle' });
});

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route introuvable' });
});

// ── Gestion des erreurs Multer ───────────────────────────────
const multer = require('multer');
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    const messages = {
      LIMIT_FILE_SIZE: 'Le fichier dépasse la taille maximale autorisée (5 Mo).',
      LIMIT_UNEXPECTED_FILE: 'Champ de fichier inattendu.',
    };
    const message = messages[err.code] || `Erreur upload : ${err.message}`;
    logger.warn('Erreur Multer', { code: err.code, field: err.field });
    return res.status(400).json({ success: false, message });
  }

  if (err.message === 'Seuls les fichiers PDF sont acceptés.') {
    logger.warn('Upload rejeté : type de fichier non-PDF');
    return res.status(400).json({ success: false, message: err.message });
  }

  next(err);
});

// ── Gestion globale des erreurs ─────────────────────────────
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = statusCode === 500 ? 'Erreur interne du serveur' : err.message;

  logger.error('Erreur serveur', {
    statusCode,
    message: err.message,
    path: req.originalUrl,
    method: req.method,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });

  res.status(statusCode).json({ success: false, message });
});

module.exports = app;
