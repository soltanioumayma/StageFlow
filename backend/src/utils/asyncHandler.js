// ============================================================
// utils/asyncHandler.js
// Wrapper pour gérer les erreurs async dans les contrôleurs
// ============================================================

/**
 * Wrapper qui capture les erreurs async et les passe à next()
 * Évite d'avoir à utiliser try/catch dans chaque contrôleur
 */
const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

module.exports = asyncHandler;
