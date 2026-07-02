const path = require('path');
const Candidature = require('../models/Candidature.model');
const Candidat = require('../models/Candidat.model');
const Formation = require('../models/Formation.model');
const Document = require('../models/Document.model');

const { generateReference } = require('../services/reference.service');
const { sendEmail } = require('../services/email.service');
const cacheService = require('../services/cache.service'); // 🔥 AJOUT

const { successResponse, errorResponse, conflictResponse } =
  require('../utils/responseHandler');
const { cleanString } = require('../utils/validators');
const logger = require('../utils/logger');

const soumettreCandidature = async (req, res) => {
  const {
    prenom, nom, email, telephone,
    etablissement, specialite, niveau, type_stage,
    lien_github, lien_linkedin,
    lettre_motivation, rgpd_accepted,
  } = req.body;

  const champsObligatoires = { prenom, nom, email, etablissement, specialite, niveau, type_stage };
  for (const [champ, valeur] of Object.entries(champsObligatoires)) {
    if (!valeur || String(valeur).trim() === '') {
      return errorResponse(res, `Le champ "${champ}" est obligatoire.`, 400);
    }
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return errorResponse(res, 'Email invalide.', 400);
  }

  if (rgpd_accepted !== 'true' && rgpd_accepted !== true) {
    return errorResponse(
      res,
      'Vous devez accepter le traitement RGPD pour soumettre votre candidature.',
      400
    );
  }

  const niveauxValides = Formation.getNiveauxValides();
  const typesStageValides = Formation.getTypesStageValides();

  if (!niveauxValides.includes(niveau)) {
    return errorResponse(res, `Niveau "${niveau}" non reconnu.`, 400);
  }

  if (!typesStageValides.includes(type_stage)) {
    return errorResponse(res, `Type de stage "${type_stage}" non reconnu.`, 400);
  }

  try {
    const doublon = await Formation.findActiveByEmailAndTypeStage(email, type_stage);
    if (doublon) {
      return conflictResponse(
        res,
        `Vous avez déjà une candidature en cours (${doublon.reference}).`
      );
    }
  } catch (err) {
    logger.error('Erreur vérification doublon candidature', {
      error: err.message,
      email,
    });
    return errorResponse(res, 'Erreur lors de la vérification de votre dossier.');
  }

  let cv_nom_original = null;
  let cv_chemin = null;
  let cv_taille = null;

  if (req.file) {
    cv_nom_original = req.file.originalname;
    cv_chemin = `uploads/cvs/${req.file.filename}`;
    cv_taille = req.file.size;
  }

  try {
    const reference = await generateReference();

    const candidature = await Candidature.create({
      reference,
      status: 'en_attente',
      rgpd_accepted: true,
    });

    await Candidat.create({
      candidature_id: candidature.id,
      prenom: cleanString(prenom),
      nom: cleanString(nom),
      email: cleanString(email, true),
      telephone: telephone || null,
    });

    await Formation.create({
      candidature_id: candidature.id,
      etablissement: cleanString(etablissement),
      specialite: cleanString(specialite),
      niveau,
      type_stage,
      lien_github: lien_github || null,
      lien_linkedin: lien_linkedin || null,
    });

    await Document.create({
      candidature_id: candidature.id,
      cv_nom_original,
      cv_chemin,
      cv_taille_octets: cv_taille,
      lettre_motivation: lettre_motivation || null,
    });

        cacheService.invalidateCache('hr_stats');
    cacheService.invalidateCache('candidatures_stats');
    cacheService.invalidateCache('candidatures:liste');

    sendEmail('confirmation', email, prenom, reference, candidature.id)
      .catch((err) =>
        logger.error('Erreur envoi email confirmation', {
          error: err.message,
          email,
        })
      );

    logger.info('Nouvelle candidature en_attente', { reference, email });

    return successResponse(
      res,
      {
        reference,
        candidatureId: candidature.id,
      },
      'Candidature enregistrée avec succès.',
      201
    );
  } catch (err) {
    logger.error('Erreur soumission candidature', {
      error: err.message,
      email,
    });
    return errorResponse(res, 'Erreur lors de la soumission de votre candidature.');
  }
};

const suiviCandidature = async (req, res) => {
  const { reference, email } = req.query;

  if (!reference || !email) {
    return errorResponse(
      res,
      'Référence et email requis pour consulter votre dossier.',
      400
    );
  }

  try {
    const candidature = await Candidature.findByReference(
      reference.trim().toUpperCase()
    );

    if (!candidature) {
      return errorResponse(res, 'Aucun dossier trouvé avec cette référence.', 404);
    }

    const candidat = await Candidat.findByCandidatureId(candidature.id);
    const formation = await Formation.findByCandidatureId(candidature.id);

    if (
      !candidat ||
      candidat.email.toLowerCase() !== email.trim().toLowerCase()
    ) {
      return errorResponse(
        res,
        'Aucun dossier trouvé avec cette référence et cet email.',
        404
      );
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

    const timeline = buildTimeline(dossier.status);

    return successResponse(res, {
      dossier,
      timeline,
    });
  } catch (err) {
    logger.error('Erreur suivi candidature', {
      error: err.message,
      reference,
      email,
    });
    return errorResponse(res, 'Erreur serveur.');
  }
};

const buildTimeline = (status) => {
  const steps = [
    { nom: 'Candidature reçue', statut: 'completee' },
    { nom: 'Revue RH', statut: 'en_attente' },
    { nom: 'Décision', statut: 'a_venir' },
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

module.exports = {
  soumettreCandidature,
  suiviCandidature,
};


