require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });

const app    = require('./app');
const logger = require('./utils/logger');
const PORT   = process.env.PORT || 5000;
const HOST   = process.env.HOST || '0.0.0.0';

// ── Gestion des erreurs non capturées ────────────────────────
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Promise Rejection', {
    reason: reason instanceof Error ? reason.message : String(reason),
    stack: reason instanceof Error ? reason.stack : undefined,
  });
});

process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception – arrêt du processus', {
    message: err.message,
    stack: err.stack,
  });
  process.exit(1);
});

app.listen(PORT, HOST, () => {
  logger.info(`Serveur StageFlow démarré sur http://${HOST}:${PORT}`);
  logger.info(`Environnement : ${process.env.NODE_ENV}`);
});
