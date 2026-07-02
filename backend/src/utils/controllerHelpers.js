// ============================================================
// utils/controllerHelpers.js
// Shared helpers to reduce repetition in controller functions
// ============================================================
const Candidature = require('../models/Candidature.model');
const { notFoundResponse } = require('./responseHandler');

/**
 * Finds a candidature by ID or returns a 404 response.
 * Returns { candidature } on success, or null if 404 was sent.
 */
const findCandidatureOr404 = async (id, res) => {
  const candidature = await Candidature.findById(id);
  if (!candidature) {
    notFoundResponse(res, 'Candidature introuvable.');
    return null;
  }
  return candidature;
};

module.exports = {
  findCandidatureOr404,
};
