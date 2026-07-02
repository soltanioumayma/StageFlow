// ============================================================
// routes/hr.routes.js
// Routes de l'espace recruteur (toutes protégées par JWT)
// ============================================================
const express  = require('express');
const { protect } = require('../middleware/auth.middleware');
const { canDecide, canExport } = require('../middleware/rbac.middleware');
const { csrfProtection } = require('../middleware/csrf.middleware');
const {
  listerCandidatures,
  detailCandidature,
  prendreDecision,
  getStats,
  addNote,
  getNotes,
  updateNote,
  deleteNote,
} = require('../controllers/hr.controller');
const { validateCandidatureId, validateDecision } = require('../middleware/validation.middleware');

const router = express.Router();

// Applique le middleware JWT à TOUTES les routes HR
router.use(protect);

// GET /api/hr/candidatures?status=en_attente
// Liste toutes les candidatures (filtrable par statut)
router.get('/candidatures', listerCandidatures);

// GET /api/hr/candidatures/:id
// Détail complet d'un dossier
router.get('/candidatures/:id', validateCandidatureId, detailCandidature);

// PATCH /api/hr/candidatures/:id/decision
// Valider ou refuser un dossier (nécessite permission de décision + CSRF)
// Body : { "decision": "acceptee" } ou { "decision": "refusee" }
router.patch('/candidatures/:id/decision', csrfProtection, canDecide, validateDecision, prendreDecision);

// GET /api/hr/stats
// Statistiques du dashboard
router.get('/stats', getStats);

// POST /api/hr/candidatures/:id/notes
// Ajouter une note à une candidature (nécessite CSRF)
router.post('/candidatures/:id/notes', csrfProtection, validateCandidatureId, addNote);

// GET /api/hr/candidatures/:id/notes
// Récupérer toutes les notes d'une candidature
router.get('/candidatures/:id/notes', validateCandidatureId, getNotes);

// PUT /api/hr/notes/:id
// Mettre à jour une note (nécessite CSRF)
router.put('/notes/:id', csrfProtection, updateNote);

// DELETE /api/hr/notes/:id
// Supprimer une note (nécessite CSRF)
router.delete('/notes/:id', csrfProtection, deleteNote);

module.exports = router;
