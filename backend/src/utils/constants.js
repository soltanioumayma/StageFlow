// ============================================================
// utils/constants.js
// Centralized enums and constants used across the application
// ============================================================

const NIVEAUX = ['BTS', 'Licence', 'Master', 'Ingenieur', 'Doctorat', 'Autre'];

const TYPES_STAGE = ['PFE', 'Stage_ete', 'Alternance', 'Observation', 'Autre'];

const DECISIONS = ['acceptee', 'refusee'];

const CANDIDATURE_STATUSES = ['en_attente', 'en_revue', 'acceptee', 'refusee'];

const ROLES = ['admin', 'recruteur'];

const NOTIFICATION_TYPES = ['confirmation', 'acceptation', 'refus'];

const NOTIFICATION_STATUSES = ['envoye', 'echec'];

module.exports = {
  NIVEAUX,
  TYPES_STAGE,
  DECISIONS,
  CANDIDATURE_STATUSES,
  ROLES,
  NOTIFICATION_TYPES,
  NOTIFICATION_STATUSES,
};
