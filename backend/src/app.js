const express = require('express');
const cors    = require('cors');
const path    = require('path');

const authRoutes         = require('./routes/auth.routes');
const candidatureRoutes  = require('./routes/candidature.routes');
const hrRoutes           = require('./routes/hr.routes');

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

app.use((err, req, res, next) => {
  console.error('❌ Erreur serveur :', err.message);
  res.status(500).json({ success: false, message: 'Erreur interne du serveur' });
});

module.exports = app;



