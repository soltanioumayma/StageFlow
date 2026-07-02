// ============================================================
// server.js – Point d'entrée de l'application
// ============================================================
require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });

const app  = require('./app');
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(` Serveur StageFlow démarré sur http://localhost:${PORT}`);
  console.log(` Environnement : ${process.env.NODE_ENV}`);
});
