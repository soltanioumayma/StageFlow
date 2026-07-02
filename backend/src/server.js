require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });

if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
  console.error('[SECURITY] JWT_SECRET is missing or too short (min 32 chars). Set it in .env.');
  process.exit(1);
}

const app  = require('./app');
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || '0.0.0.0';

app.listen(PORT, HOST, () => {
  console.log(` Serveur StageFlow démarré sur http://${HOST}:${PORT}`);
  console.log(` Environnement : ${process.env.NODE_ENV}`);
});



