// ============================================================
// controllers/candidature.controller.js
// Actions publiques : soumettre et suivre une candidature
// ============================================================
const path    = require('path');
const Candidature = require('../models/Candidature.model');
const Candidat    = require('../models/Candidat.model');
const Formation   = require('../models/Formation.model');
const Document    = require('../models/Document.model');
const { generateReference } = require('../services/reference.service');
const { sendEmail }         = require('../services/email.service');
const { successResponse, errorResponse, conflictResponse } = require('../utils/responseHandler');
const { cleanString }        = require('../utils/validators');
const logger                 = require('../utils/logger');

// ────────────────────────────────────────────────────────────
// POST /api/candidatures
// Soumet un dossier complet (étapes 1+2+3+4 en une seule requête)
// Body : multipart/form-data (car le CV est un fichier)
//   Champs texte : prenom, nom, email, telephone,
//                  etablissement, specialite, niveau, type_stage,
//                  lien_github, lien_linkedin,
//                  lettre_motivation, rgpd_accepted
//   Fichier      : cv (PDF, max 5Mo)
// ────────────────────────────────────────────────────────────
const soumettreCandidature = async (req, res) => {
  const {
    prenom, nom, email, telephone,
    etablissement, specialite, niveau, type_stage,
    lien_github, lien_linkedin,
    lettre_motivation, rgpd_accepted,
  } = req.body;

  // ── Validation des champs obligatoires ──────────────────
  const champsObligatoires = { prenom, nom, email, etablissement, specialite, niveau, type_stage };
  for (const [champ, valeur] of Object.entries(champsObligatoires)) {
    if (!valeur || String(valeur).trim() === '') {
      return errorResponse(res, `Le champ "${champ}" est obligatoire.`, 400);
    }
  }

  // Validation email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return errorResponse(res, 'Email invalide.', 400);
  }

  // RGPD obligatoire
  if (rgpd_accepted !== 'true' && rgpd_accepted !== true) {
    return errorResponse(res, 'Vous devez accepter le traitement RGPD pour soumettre votre candidature.', 400);
  }

  // Niveau et type_stage : valeurs autorisées
  const niveauxValides     = Formation.getNiveauxValides();
  const typesStageValides  = Formation.getTypesStageValides();

  if (!niveauxValides.includes(niveau)) {
    return errorResponse(res, `Niveau "${niveau}" non reconnu.`, 400);
  }
  if (!typesStageValides.includes(type_stage)) {
    return errorResponse(res, `Type de stage "${type_stage}" non reconnu.`, 400);
  }

  // ── Vérification anti-doublon ────────────────────────────
  // Empêche un même email de soumettre 2 candidatures ACTIVES
  // (statut 'en_attente') pour le même type de stage.
  // Une nouvelle soumission reste possible après refus/acceptation,
  // ou pour un type_stage différent.
  try {
    const doublon = await Formation.findActiveByEmailAndTypeStage(email, type_stage);
    if (doublon) {
      return conflictResponse(
        res,
        `Vous avez déjà une candidature en cours (${doublon.reference}) pour ce type de stage. Consultez son statut via "Mon dossier" avant d'en soumettre une nouvelle.`
      );
    }
  } catch (err) {
    logger.error('Erreur vérification doublon candidature', { error: err.message, email });
    return errorResponse(res, 'Erreur lors de la vérification de votre dossier.');
  }

  // ── Données du CV ────────────────────────────────────────
  let cv_nom_original = null;
  let cv_chemin       = null;
  let cv_taille       = null;

  if (req.file) {
    cv_nom_original = req.file.originalname;
    cv_chemin       = `uploads/cvs/${req.file.filename}`;
    cv_taille       = req.file.size;
  }

  try {
    // ── Génère la référence unique ────────────────────────
    const reference = await generateReference();

    // ── Insertion dans la base de données ─────────────────
    // 1. Candidature (table centrale)
    const candidature = await Candidature.create({
      reference,
      status: 'en_attente',
      rgpd_accepted: true,
    });

    // 2. Candidat (infos personnelles)
    await Candidat.create({
      candidature_id: candidature.id,
      prenom: cleanString(prenom),
      nom: cleanString(nom),
      email: cleanString(email, true),
      telephone: telephone || null,
    });

    // 3. Formation (profil académique)
    await Formation.create({
      candidature_id: candidature.id,
      etablissement: cleanString(etablissement),
      specialite: cleanString(specialite),
      niveau,
      type_stage,
      lien_github: lien_github || null,
      lien_linkedin: lien_linkedin || null,
    });

    // 4. Documents (CV + lettre)
    await Document.create({
      candidature_id: candidature.id,
      cv_nom_original,
      cv_chemin,
      cv_taille_octets: cv_taille,
      lettre_motivation: lettre_motivation || null,
    });

    // ── Envoi de l'email de confirmation ──────────────────
    // On ne bloque pas la réponse si l'email échoue
    sendEmail('confirmation', email, prenom, reference, candidature.id)
      .catch((err) => logger.error('Erreur envoi email confirmation', { error: err.message, email }));

    // ── Réponse succès ────────────────────────────────────
    logger.info('Nouvelle candidature en_attente', { reference, email });
    return successResponse(res, {
      reference,
      candidatureId: candidature.id,
    }, 'Candidature enregistrée avec succès.', 201);

  } catch (err) {
    logger.error('Erreur soumission candidature', { error: err.message, email });
    return errorResponse(res, 'Erreur lors de la soumission de votre candidature.');
  }
};

// ────────────────────────────────────────────────────────────
// GET /api/candidatures/suivi?reference=RIF-2026-0042&email=xxx@gmail.com
// Permet au candidat de suivre son dossier (Screen 02 + 08)
// ────────────────────────────────────────────────────────────
const suiviCandidature = async (req, res) => {
  const { reference, email } = req.query;

  if (!reference || !email) {
    return errorResponse(res, 'Référence et email requis pour consulter votre dossier.', 400);
  }

  try {
    // Recherche le dossier en joignant toutes les tables
    const candidature = await Candidature.findByReference(reference.trim().toUpperCase());

    if (!candidature) {
      return errorResponse(res, 'Aucun dossier trouvé avec cette référence.', 404);
    }

    const candidat = await Candidat.findByCandidatureId(candidature.id);
    const formation = await Formation.findByCandidatureId(candidature.id);

    if (!candidat || candidat.email.toLowerCase() !== email.trim().toLowerCase()) {
      return errorResponse(res, 'Aucun dossier trouvé avec cette référence et cet email.', 404);
    }

    const dossier = {
      id: candidature.id,
      reference: candidature.reference,
      status: candidature.status,
      submitted_at: candidature.submitted_at,
      prenom: candidat.prenom,
      nom: candidat.nom,
      email: candidat.email,
      etablissement: formation?.etablissement,
      specialite: formation?.specialite,
      niveau: formation?.niveau,
      type_stage: formation?.type_stage,
    };

    // Construit la timeline de suivi (basée sur le statut)
    const timeline = buildTimeline(dossier.status);

    logger.info('Suivi de candidature consulté', { reference, email });
    return successResponse(res, {
      dossier: {
        reference: dossier.reference,
        status: dossier.status,
        submitted_at: dossier.submitted_at,
        prenom: dossier.prenom,
        nom: dossier.nom,
        etablissement: dossier.etablissement,
        specialite: dossier.specialite,
        niveau: dossier.niveau,
        type_stage: dossier.type_stage,
      },
      timeline,
    });

  } catch (err) {
    logger.error('Erreur suivi candidature', { error: err.message, reference, email });
    return errorResponse(res, 'Erreur serveur.');
  }
};

// ── Fonction helper : construit la timeline ──────────────────
// Reproduit exactement ce qu'on voit en Screen 08
const buildTimeline = (status) => {
  const steps = [
    { nom: 'Candidature reçue', statut: 'completee' },
    { nom: 'Revue RH',          statut: 'en_attente' },
    { nom: 'Décision',          statut: 'a_venir'    },
  ];

  if (status === 'en_attente' || status === 'en_revue') {
    steps[1].statut = 'completee';
    steps[2].statut = 'en_attente';
  } else if (status === 'acceptee' || status === 'refusee') {
    steps[1].statut = 'completee';
    steps[2].statut = 'completee';
  }

  return steps;
};

module.exports = { soumettreCandidature, suiviCandidature };