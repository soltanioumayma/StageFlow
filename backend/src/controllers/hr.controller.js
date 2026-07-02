const Candidature = require('../models/Candidature.model');
const Candidat    = require('../models/Candidat.model');
const Formation   = require('../models/Formation.model');
const Document    = require('../models/Document.model');
const RhNote      = require('../models/RhNote.model');
const { addToQueue } = require('../services/emailQueue.service');
const { getCachedStats, setCachedStats, invalidateCache } = require('../services/cache.service');
const { successResponse, errorResponse, notFoundResponse } = require('../utils/responseHandler');
const logger = require('../utils/logger'); // ← CORRIGÉ : plus de { logger }

const listerCandidatures = async (req, res) => {
  const { 
    status, 
    search, 
    type_stage, 
    niveau, 
    date_from, 
    date_to,
    page = 1, 
    limit = 20, 
    sort = 'submitted_at', 
    order = 'DESC' 
  } = req.query;

  try {
    const filters = {};
    if (status) filters.status = status;
    
    const candidatures = await Candidature.findAllWithFilters({
      filters,
      search,
      type_stage,
      niveau,
      date_from,
      date_to,
      page: parseInt(page),
      limit: parseInt(limit),
      sort,
      order
    });

    return successResponse(res, candidatures);

  } catch (err) {
    logger.error('Erreur lister candidatures', { error: err.message, status, search });
    return errorResponse(res, 'Erreur serveur.');
  }
};

const detailCandidature = async (req, res) => {
  const { id } = req.params;

  try {

    const candidature = await Candidature.findById(id);

    if (!candidature) {
      return notFoundResponse(res, 'Candidature introuvable.');
    }

    const candidat = await Candidat.findByCandidatureId(id);
    const formation = await Formation.findByCandidatureId(id);
    const document = await Document.findByCandidatureId(id);


    const dossier = {
      id: candidature.id,
      reference: candidature.reference,
      status: candidature.status,
      rgpd_accepted: candidature.rgpd_accepted,
      submitted_at: candidature.submitted_at,
      updated_at: candidature.updated_at,
      prenom: candidat?.prenom,
      nom: candidat?.nom,
      email: candidat?.email,
      telephone: candidat?.telephone,
      etablissement: formation?.etablissement,
      specialite: formation?.specialite,
      niveau: formation?.niveau,
      type_stage: formation?.type_stage,
      lien_github: formation?.lien_github,
      lien_linkedin: formation?.lien_linkedin,
      cv_nom_original: document?.cv_nom_original,
      cv_chemin: document?.cv_chemin,
      cv_taille_octets: document?.cv_taille_octets,
      lettre_motivation: document?.lettre_motivation,
    };

    logger.info('Dossier consulté par RH', { candidatureId: id, reference: candidature.reference });
    return successResponse(res, { dossier });

  } catch (err) {
    logger.error('Erreur détail candidature', { error: err.message, id });
    return errorResponse(res, 'Erreur serveur.');
  }
};

const prendreDecision = async (req, res) => {
  const { id }       = req.params;
  const { decision } = req.body;

  if (!['acceptee', 'refusee'].includes(decision)) {
    return errorResponse(res, 'Décision invalide. Valeurs acceptées : "acceptee" ou "refusee".', 400);
  }

  try {

    const candidature = await Candidature.findById(id);

    if (!candidature) {
      return notFoundResponse(res, 'Candidature introuvable.');
    }

    const candidat = await Candidat.findByCandidatureId(id);

    if (!candidat) {
      return notFoundResponse(res, 'Candidat introuvable.');
    }

    if (['acceptee', 'refusee'].includes(candidature.status)) {
      return errorResponse(res, `Une décision a déjà été prise pour ce dossier (${candidature.status}).`, 400);
    }

    await Candidature.updateStatus(id, decision);

    invalidateCache('hr_stats');

    const typeEmail = decision === 'acceptee' ? 'acceptation' : 'refus';
    addToQueue(typeEmail, candidat.email, candidat.prenom, candidature.reference, id)
      .catch((err) => logger.error('Erreur ajout email à la queue', { error: err.message, candidatureId: id }));

    logger.info('Décision prise sur candidature', { candidatureId: id, decision, reference: candidature.reference });
    return successResponse(res, {
      decision,
    }, `Candidature ${decision === 'acceptee' ? 'validée' : 'refusée'} avec succès.`);

  } catch (err) {
    logger.error('Erreur décision', { error: err.message, id, decision });
    return errorResponse(res, 'Erreur serveur.');
  }
};

const getStats = async (req, res) => {
  try {

    const cacheKey = 'hr_stats';
    const cachedStats = getCachedStats(cacheKey);
    
    if (cachedStats) {
      return successResponse(res, { stats: cachedStats });
    }

    const stats = await Candidature.getStats();

    setCachedStats(cacheKey, stats);
    
    return successResponse(res, { stats });
  } catch (err) {
    logger.error('Erreur stats', { error: err.message });
    return errorResponse(res, 'Erreur serveur.');
  }
};

const addNote = async (req, res) => {
  const { id } = req.params;
  const { note } = req.body;
  const rh_user_id = req.user.id; // From JWT middleware

  if (!note || note.trim() === '') {
    return errorResponse(res, 'La note ne peut pas être vide', 400);
  }

  try {
    const candidature = await Candidature.findById(id);
    if (!candidature) {
      return notFoundResponse(res, 'Candidature introuvable.');
    }

    const newNote = await RhNote.create({
      candidature_id: id,
      rh_user_id,
      note: note.trim()
    });

    logger.info('Note ajoutée', { candidatureId: id, noteId: newNote.id, rh_user_id });
    return successResponse(res, { note: newNote }, 'Note ajoutée avec succès', 201);
  } catch (err) {
    logger.error('Erreur ajout note', { error: err.message, id });
    return errorResponse(res, 'Erreur serveur.');
  }
};

const getNotes = async (req, res) => {
  const { id } = req.params;

  try {
    const candidature = await Candidature.findById(id);
    if (!candidature) {
      return notFoundResponse(res, 'Candidature introuvable.');
    }

    const notes = await RhNote.findByCandidatureId(id);
    return successResponse(res, { notes });
  } catch (err) {
    logger.error('Erreur récupération notes', { error: err.message, id });
    return errorResponse(res, 'Erreur serveur.');
  }
};

const updateNote = async (req, res) => {
  const { id } = req.params;
  const { note } = req.body;
  const rh_user_id = req.user.id;

  if (!note || note.trim() === '') {
    return errorResponse(res, 'La note ne peut pas être vide', 400);
  }

  try {
    const existingNote = await RhNote.findById(id);
    if (!existingNote) {
      return notFoundResponse(res, 'Note introuvable.');
    }

    if (existingNote.rh_user_id !== rh_user_id) {
      return errorResponse(res, 'Vous n\'êtes pas autorisé à modifier cette note', 403);
    }

    const updatedNote = await RhNote.update(id, note.trim());
    logger.info('Note mise à jour', { noteId: id, rh_user_id });
    return successResponse(res, { note: updatedNote }, 'Note mise à jour avec succès');
  } catch (err) {
    logger.error('Erreur mise à jour note', { error: err.message, id });
    return errorResponse(res, 'Erreur serveur.');
  }
};

const deleteNote = async (req, res) => {
  const { id } = req.params;
  const rh_user_id = req.user.id;

  try {
    const existingNote = await RhNote.findById(id);
    if (!existingNote) {
      return notFoundResponse(res, 'Note introuvable.');
    }

    if (existingNote.rh_user_id !== rh_user_id) {
      return errorResponse(res, 'Vous n\'êtes pas autorisé à supprimer cette note', 403);
    }

    await RhNote.delete(id);
    logger.info('Note supprimée', { noteId: id, rh_user_id });
    return successResponse(res, {}, 'Note supprimée avec succès');
  } catch (err) {
    logger.error('Erreur suppression note', { error: err.message, id });
    return errorResponse(res, 'Erreur serveur.');
  }
};

module.exports = { 
  listerCandidatures, 
  detailCandidature, 
  prendreDecision, 
  getStats,
  addNote,
  getNotes,
  updateNote,
  deleteNote
};


