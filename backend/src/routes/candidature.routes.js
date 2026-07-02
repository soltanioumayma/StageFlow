const express = require('express');
const { upload } = require('../middleware/upload.middleware');
const {
  soumettreCandidature,
  suiviCandidature,
} = require('../controllers/candidature.controller');
const { validateCandidature, validateSuivi } = require('../middleware/validation.middleware');

const router = express.Router();

router.post('/', upload.single('cv'), validateCandidature, soumettreCandidature);

router.get('/suivi', validateSuivi, suiviCandidature);

module.exports = router;



