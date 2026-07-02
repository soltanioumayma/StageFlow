
/**
 * Valide un email
 */
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Valide un numéro de téléphone (format international)
 */
const isValidPhone = (phone) => {
  if (!phone) return true; // Optionnel
  const phoneRegex = /^\+?[0-9\s\-]{8,20}$/;
  return phoneRegex.test(phone);
};

/**
 * Valide une URL
 */
const isValidUrl = (url) => {
  if (!url) return true; // Optionnel
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Valide que la chaîne n'est pas vide
 */
const isNotEmpty = (value) => {
  if (value === null || value === undefined) return false;
  return String(value).trim().length > 0;
};

/**
 * Valide que la valeur est dans une liste
 */
const isInList = (value, list) => {
  return list.includes(value);
};

/**
 * Nettoie une chaîne (trim et lowercase pour emails)
 */
const cleanString = (str, toLowerCase = false) => {
  if (!str) return null;
  let cleaned = str.trim();
  if (toLowerCase) cleaned = cleaned.toLowerCase();
  return cleaned;
};

/**
 * Valide les données de candidature
 */
const validateCandidatureData = (data) => {
  const errors = [];

  // Champs obligatoires
  const requiredFields = ['prenom', 'nom', 'email', 'etablissement', 'specialite', 'niveau', 'type_stage'];
  for (const field of requiredFields) {
    if (!isNotEmpty(data[field])) {
      errors.push(`Le champ "${field}" est obligatoire.`);
    }
  }

  // Email
  if (data.email && !isValidEmail(data.email)) {
    errors.push('Email invalide.');
  }

  // Téléphone
  if (data.telephone && !isValidPhone(data.telephone)) {
    errors.push('Numéro de téléphone invalide.');
  }

  // Liens
  if (data.lien_github && !isValidUrl(data.lien_github)) {
    errors.push('Lien GitHub invalide.');
  }
  if (data.lien_linkedin && !isValidUrl(data.lien_linkedin)) {
    errors.push('Lien LinkedIn invalide.');
  }

  // Niveau
  const niveauxValides = ['BTS', 'Licence', 'Master', 'Ingenieur', 'Doctorat', 'Autre'];
  if (data.niveau && !isInList(data.niveau, niveauxValides)) {
    errors.push(`Niveau "${data.niveau}" non reconnu.`);
  }

  // Type de stage
  const typesStageValides = ['PFE', 'Stage_ete', 'Alternance', 'Observation', 'Autre'];
  if (data.type_stage && !isInList(data.type_stage, typesStageValides)) {
    errors.push(`Type de stage "${data.type_stage}" non reconnu.`);
  }

  // RGPD
  if (data.rgpd_accepted !== 'true' && data.rgpd_accepted !== true) {
    errors.push('Vous devez accepter le traitement RGPD.');
  }

  return errors;
};

/**
 * Valide les données de décision RH
 */
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



