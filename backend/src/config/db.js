const { Pool } = require('pg');
const logger = require('../utils/logger');

const pool = new Pool({
  host:     process.env.DB_HOST     || 'localhost',
  port:     parseInt(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME     || 'stageflow',
  user:     process.env.DB_USER     || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
});

// Log les erreurs de connexion au niveau du pool
pool.on('error', (err) => {
  logger.error('Erreur inattendue sur le pool PostgreSQL', { error: err.message });
});

pool.connect((err, client, release) => {
  if (err) {
    logger.error('Impossible de se connecter à PostgreSQL', { error: err.message });
    process.exit(1);
  } else {
    logger.info('Connecté à PostgreSQL', { database: process.env.DB_NAME || 'stageflow' });
    release();
  }
});

const query = (text, params) => pool.query(text, params);

module.exports = { query, pool };
