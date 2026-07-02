// ============================================================
// utils/validators.js
// Fonctions de validation réutilisables
// ============================================================
const { NIVEAUX, TYPES_STAGE } = require('./constants');


const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};


const isValidPhone = (phone) => {
  if (!phone) return true; // Optionnel
  const phoneRegex = /^\+?[0-9\s\-]{8,20}$/;
  return phoneRegex.test(phone);
};


const isValidUrl = (url) => {
  if (!url) return true; // Optionnel
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};


const isNotEmpty = (value) => {
  if (value === null || value === undefined) return false;
  return String(value).trim().length > 0;
};


const isInList = (value, list) => {
  return list.includes(value);
};


const cleanString = (str, toLowerCase = false) => {
  if (!str) return null;
  let cleaned = str.trim();
  if (toLowerCase) cleaned = cleaned.toLowerCase();
  return cleaned;
};


const validateCandidatureData = (data) => {
  const errors = [];

  const requiredFields = ['prenom', 'nom', 'email', 'etablissement', 'specialite', 'niveau', 'type_stage'];
  for (const field of requiredFields) {
    if (!isNotEmpty(data[field])) {
      errors.push(`Le champ "${field}" est obligatoire.`);
    }
  }

  if (data.email && !isValidEmail(data.email)) {
    errors.push('Email invalide.');
  }

  if (data.telephone && !isValidPhone(data.telephone)) {
    errors.push('Numéro de téléphone invalide.');
  }

  if (data.lien_github && !isValidUrl(data.lien_github)) {
    errors.push('Lien GitHub invalide.');
  }
  if (data.lien_linkedin && !isValidUrl(data.lien_linkedin)) {
    errors.push('Lien LinkedIn invalide.');
  }

  if (data.niveau && !isInList(data.niveau, NIVEAUX)) {
    errors.push(`Niveau "${data.niveau}" non reconnu.`);
  }

  if (data.type_stage && !isInList(data.type_stage, TYPES_STAGE)) {
    errors.push(`Type de stage "${data.type_stage}" non reconnu.`);
  }

  if (data.rgpd_accepted !== 'true' && data.rgpd_accepted !== true) {
    errors.push('Vous devez accepter le traitement RGPD.');
  }

  return errors;
};


const validateDecisionData = (data) => {
  const errors = [];
  const decisionsValides = ['acceptee', 'refusee'];

  if (!data.decision) {
    errors.push('La décision est obligatoire.');
  } else if (!isInList(data.decision, decisionsValides)) {
    errors.push('Décision invalide. Valeurs acceptées : "acceptee" ou "refusee".');
  }

  return errors;
};

module.exports = {
  isValidEmail,
  isValidPhone,
  isValidUrl,
  isNotEmpty,
  isInList,
  cleanString,
  validateCandidatureData,
  validateDecisionData,
};



