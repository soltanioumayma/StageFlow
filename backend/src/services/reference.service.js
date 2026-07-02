const Candidature = require('../models/Candidature.model');


const generateReference = async () => {
  const year = new Date().getFullYear();
  const prefix = `RIF-${year}-`;

  // Récupère la dernière référence de l'année en cours
  const lastRef = await Candidature.getLastReferenceOfYear(year);

  let nextNum = 1;
  if (lastRef) {
    // Extrait le numéro : "RIF-2026-0042" → 42
    const lastNum = parseInt(lastRef.reference.split('-')[2], 10);
    nextNum = lastNum + 1;
  }

  // Formate sur 4 chiffres : 42 → "0042"
  const padded = String(nextNum).padStart(4, '0');
  return `${prefix}${padded}`;
};

module.exports = { generateReference };



