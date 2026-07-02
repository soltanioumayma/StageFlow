// ============================================================
// controllers/hr.controller.js
// Actions de l'espace recruteur (toutes protégées par JWT)
// ============================================================
const Candidature = require('../models/Candidature.model');
const Candidat    = require('../models/Candidat.model');
const Formation   = require('../models/Formation.model');
const Document    = require('../models/Document.model');
const RhNote      = require('../models/RhNote.model');
const { addToQueue } = require('../services/emailQueue.service');
const { getCachedStats, setCachedStats, invalidateCache } = require('../services/cache.service');
const { successResponse, errorResponse, notFoundResponse } = require('../utils/responseHandler');
const logger = require('../utils/logger'); // ← CORRIGÉ : plus de { logger }

// ────────────────────────────────────────────────────────────
// GET /api/hr/candidatures
// Liste toutes les candidatures avec filtres et recherche
// Query params : 
//   - status: en_attente | acceptee | refusee
//   - search: recherche sur nom, email, référence
//   - type_stage: PFE | Stage_ete | Alternance | Observation | Autre
//   - niveau: BTS | Licence | Master | Ingenieur | Doctorat | Autre
//   - date_from: date de début (YYYY-MM-DD)
//   - date_to: date de fin (YYYY-MM-DD)
//   - page: numéro de page (défaut 1)
//   - limit: nombre par page (défaut 20)
//   - sort: submitted_at | nom | email (défaut submitted_at)
//   - order: ASC | DESC (défaut DESC)
// ────────────────────────────────────────────────────────────
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

// ────────────────────────────────────────────────────────────
// GET /api/hr/candidatures/:id
// Détail complet d'un dossier (Screen 11)
// ────────────────────────────────────────────────────────────
const detailCandidature = async (req, res) => {
  const { id } = req.params;

  try {
    // Récupère toutes les infos du dossier
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

// ────────────────────────────────────────────────────────────
// PATCH /api/hr/candidatures/:id/decision
// Valider ou refuser un dossier (boutons Screen 11)
// Body : { decision: 'acceptee' | 'refusee' }
// ────────────────────────────────────────────────────────────
const prendreDecision = async (req, res) => {
  const { id }       = req.params;
  const { decision } = req.body;

  // Valide la décision
  if (!['acceptee', 'refusee'].includes(decision)) {
    return errorResponse(res, 'Décision invalide. Valeurs acceptées : "acceptee" ou "refusee".', 400);
  }

  try {
    // Récupère la candidature avec l'email du candidat pour l'email
    const candidature = await Candidature.findById(id);

    if (!candidature) {
      return notFoundResponse(res, 'Candidature introuvable.');
    }

    const candidat = await Candidat.findByCandidatureId(id);

    if (!candidat) {
      return notFoundResponse(res, 'Candidat introuvable.');
    }

    // Empêche de changer une décision déjà prise
    if (['acceptee', 'refusee'].includes(candidature.status)) {
      return errorResponse(res, `Une décision a déjà été prise pour ce dossier (${candidature.status}).`, 400);
    }

    // Met à jour le statut
    await Candidature.updateStatus(id, decision);

    // Invalide le cache des stats
    invalidateCache('hr_stats');

    // Envoie l'email de notification au candidat via la queue
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

// ────────────────────────────────────────────────────────────
// GET /api/hr/stats
// Statistiques rapides pour le dashboard (avec cache)
// ────────────────────────────────────────────────────────────
const getStats = async (req, res) => {
  try {
    // Essayer de récupérer du cache
    const cacheKey = 'hr_stats';
    const cachedStats = getCachedStats(cacheKey);
    
    if (cachedStats) {
      return successResponse(res, { stats: cachedStats });
    }
    
    // Si pas en cache, calculer les stats
    const stats = await Candidature.getStats();
    
    // Mettre en cache
    setCachedStats(cacheKey, stats);
    
    return successResponse(res, { stats });
  } catch (err) {
    logger.error('Erreur stats', { error: err.message });
    return errorResponse(res, 'Erreur serveur.');
  }
};

// ────────────────────────────────────────────────────────────
// POST /api/hr/candidatures/:id/notes
// Ajouter une note à une candidature
// Body : { note: string }
// ────────────────────────────────────────────────────────────
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

// ────────────────────────────────────────────────────────────
// GET /api/hr/candidatures/:id/notes
// Récupérer toutes les notes d'une candidature
// ────────────────────────────────────────────────────────────
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

// ────────────────────────────────────────────────────────────
// PUT /api/hr/notes/:id
// Mettre à jour une note
// Body : { note: string }
// ────────────────────────────────────────────────────────────
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

    // Vérifier que l'utilisateur est le propriétaire de la note
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

// ────────────────────────────────────────────────────────────
// DELETE /api/hr/notes/:id
// Supprimer une note
// ────────────────────────────────────────────────────────────
const deleteNote = async (req, res) => {
  const { id } = req.params;
  const rh_user_id = req.user.id;

  try {
    const existingNote = await RhNote.findById(id);
    if (!existingNote) {
      return notFoundResponse(res, 'Note introuvable.');
    }

    // Vérifier que l'utilisateur est le propriétaire de la note
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