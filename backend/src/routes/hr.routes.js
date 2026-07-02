const express  = require('express');
const { protect } = require('../middleware/auth.middleware');
const { canExport } = require('../middleware/rbac.middleware');
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

router.use(protect);

router.get('/candidatures', listerCandidatures);

router.get('/candidatures/:id', validateCandidatureId, detailCandidature);

router.patch('/candidatures/:id/decision', validateDecision, prendreDecision);

router.get('/stats', getStats);

router.post('/candidatures/:id/notes', validateCandidatureId, addNote);

router.get('/candidatures/:id/notes', validateCandidatureId, getNotes);

router.put('/notes/:id', updateNote);

router.delete('/notes/:id', deleteNote);

module.exports = router;


