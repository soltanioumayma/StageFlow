
/**
 * Réponse succès
 */
const successResponse = (res, data, message = 'Opération réussie', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    ...data,
  });
};

/**
 * Réponse erreur
 */
const errorResponse = (res, message = 'Erreur serveur', statusCode = 500, errors = null) => {
  const response = {
    success: false,
    message,
  };

  if (errors) {
    response.errors = errors;
  }

  return res.status(statusCode).json(response);
};

/**
 * Réponse validation
 */
const validationResponse = (res, errors) => {
  return errorResponse(res, 'Erreur de validation', 400, errors);
};

/**
 * Réponse non trouvé
 */
const notFoundResponse = (res, message = 'Ressource introuvable') => {
  return errorResponse(res, message, 404);
};

/**
 * Réponse non autorisé
 */
const unauthorizedResponse = (res, message = 'Accès non autorisé') => {
  return errorResponse(res, message, 401);
};

/**
 * Réponse interdit
 */
const forbiddenResponse = (res, message = 'Accès interdit') => {
  return errorResponse(res, message, 403);
};

/**
 * Réponse conflit
 */
const conflictResponse = (res, message = 'Conflit de données') => {
  return errorResponse(res, message, 409);
};

module.exports = {
  successResponse,
  errorResponse,
  validationResponse,
  notFoundResponse,
  unauthorizedResponse,
  forbiddenResponse,
  conflictResponse,
};



