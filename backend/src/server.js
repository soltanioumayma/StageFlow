require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });

const app  = require('./app');
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || '0.0.0.0';

app.listen(PORT, HOST, () => {
  console.log(` Serveur StageFlow démarré sur http://${HOST}:${PORT}`);
  console.log(` Environnement : ${process.env.NODE_ENV}`);
});



