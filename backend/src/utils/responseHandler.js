

const successResponse = (res, data, message = 'Opération réussie', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    ...data,
  });
};


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


const validationResponse = (res, errors) => {
  return errorResponse(res, 'Erreur de validation', 400, errors);
};


const notFoundResponse = (res, message = 'Ressource introuvable') => {
  return errorResponse(res, message, 404);
};


const unauthorizedResponse = (res, message = 'Accès non autorisé') => {
  return errorResponse(res, message, 401);
};


const forbiddenResponse = (res, message = 'Accès interdit') => {
  return errorResponse(res, message, 403);
};


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



