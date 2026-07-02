// ============================================================
// middleware/validation.middleware.js
// Middleware de validation avec express-validator
// ============================================================
const { body, param, query, validationResult } = require('express-validator');
const { validationResponse } = require('../utils/responseHandler');

/**
 * Middleware qui vérifie les résultats de validation
 */
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map(err => ({
      field: err.path,
      message: err.msg,
    }));
    return validationResponse(res, formattedErrors);
  }
  next();
};

/**
 * Validation pour la connexion
 */
const validateLogin = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email requis')
    .isEmail()
    .withMessage('Email invalide'),
  body('password')
    .notEmpty()
    .withMessage('Mot de passe requis')
    .isLength({ min: 6 })
    .withMessage('Le mot de passe doit contenir au moins 6 caractères'),
  validateRequest,
];

/**
 * Validation pour la soumission de candidature
 */
const validateCandidature = [
  body('prenom')
    .trim()
    .notEmpty()
    .withMessage('Prénom requis')
    .isLength({ max: 100 })
    .withMessage('Le prénom ne peut pas dépasser 100 caractères'),
  body('nom')
    .trim()
    .notEmpty()
    .withMessage('Nom requis')
    .isLength({ max: 100 })
    .withMessage('Le nom ne peut pas dépasser 100 caractères'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email requis')
    .isEmail()
    .withMessage('Email invalide'),
  body('telephone')
    .optional({ checkFalsy: true })
    .trim()
    .matches(/^\+?[0-9\s\-]{8,20}$/)
    .withMessage('Numéro de téléphone invalide'),
  body('etablissement')
    .trim()
    .notEmpty()
    .withMessage('Établissement requis')
    .isLength({ max: 200 })
    .withMessage('L\'établissement ne peut pas dépasser 200 caractères'),
  body('specialite')
    .trim()
    .notEmpty()
    .withMessage('Spécialité requise')
    .isLength({ max: 200 })
    .withMessage('La spécialité ne peut pas dépasser 200 caractères'),
  body('niveau')
    .trim()
    .notEmpty()
    .withMessage('Niveau requis')
    .isIn(['BTS', 'Licence', 'Master', 'Ingenieur', 'Doctorat', 'Autre'])
    .withMessage('Niveau non reconnu'),
  body('type_stage')
    .trim()
    .notEmpty()
    .withMessage('Type de stage requis')
    .isIn(['PFE', 'Stage_ete', 'Alternance', 'Observation', 'Autre'])
    .withMessage('Type de stage non reconnu'),
  body('lien_github')
    .optional({ checkFalsy: true })
    .isURL()
    .withMessage('Lien GitHub invalide'),
  body('lien_linkedin')
    .optional({ checkFalsy: true })
    .isURL()
    .withMessage('Lien LinkedIn invalide'),
  body('lettre_motivation')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 5000 })
    .withMessage('La lettre de motivation ne peut pas dépasser 5000 caractères'),
  body('rgpd_accepted')
    .custom((value) => {
      if (value !== 'true' && value !== true) {
        throw new Error('Vous devez accepter le traitement RGPD');
      }
      return true;
    }),
  validateRequest,
];

/**
 * Validation pour le suivi de candidature
 */
const validateSuivi = [
  query('reference')
    .trim()
    .notEmpty()
    .withMessage('Référence requise')
    .matches(/^RIF-\d{4}-\d{4}$/)
    .withMessage('Format de référence invalide (ex: RIF-2026-0042)'),
  query('email')
    .trim()
    .notEmpty()
    .withMessage('Email requis')
    .isEmail()
    .withMessage('Email invalide'),
  validateRequest,
];

/**
 * Validation pour l'ID de candidature
 */
const validateCandidatureId = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('ID de candidature invalide'),
  validateRequest,
];

/**
 * Validation pour la décision RH
 */
const validateDecision = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('ID de candidature invalide'),
  body('decision')
    .trim()
    .notEmpty()
    .withMessage('Décision requise')
    .isIn(['acceptee', 'refusee'])
    .withMessage('Décision invalide. Valeurs acceptées : "acceptee" ou "refusee"'),
  validateRequest,
];

module.exports = {
  validateRequest,
  validateLogin,
  validateCandidature,
  validateSuivi,
  validateCandidatureId,
  validateDecision,
};