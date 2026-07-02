// ============================================================
// routes/candidature.routes.js
// Routes publiques (sans authentification)
// ============================================================
const express = require('express');
const { upload } = require('../middleware/upload.middleware');
const {
  soumettreCandidature,
  suiviCandidature,
} = require('../controllers/candidature.controller');
const { validateCandidature, validateSuivi } = require('../middleware/validation.middleware');

const router = express.Router();

// POST /api/candidatures
// Soumet un nouveau dossier (formulaire 4 étapes)
// "cv" est le nom du champ fichier dans le formulaire
router.post('/', upload.single('cv'), validateCandidature, soumettreCandidature);

// GET /api/candidatures/suivi?reference=RIF-2026-0042&email=xxx@gmail.com
// Permet au candidat de suivre son dossier (Screen 02 + 08)
router.get('/suivi', validateSuivi, suiviCandidature);

module.exports = router;
