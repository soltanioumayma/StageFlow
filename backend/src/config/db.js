const { Pool } = require('pg');

if (!process.env.DB_PASSWORD) {
  console.warn('[SECURITY] DB_PASSWORD is not set. Set it in .env or environment variables.');
}

const pool = new Pool({
  host:     process.env.DB_HOST     || 'localhost',
  port:     parseInt(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME     || 'stageflow',
  user:     process.env.DB_USER     || 'postgres',
  password: process.env.DB_PASSWORD,
});

pool.connect((err, client, release) => {
  if (err) {
    console.error(' Impossible de se connecter à PostgreSQL :', err.message);
  } else {
    console.log(' Connecté à PostgreSQL – base de données : stageflow');
    release();
  }
});

const query = (text, params) => pool.query(text, params);

module.exports = { query, pool };



