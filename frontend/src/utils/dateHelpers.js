// ============================================================
// Date formatting utilities
// ============================================================

/**
 * Formats a date string to French short format (e.g. "02/07/2026").
 */
export const formatDateShort = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('fr-FR');
};

/**
 * Formats a date string to French medium format (e.g. "2 juil. 2026").
 */
export const formatDateMedium = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

/**
 * Formats a date string with time (e.g. "02/07/2026 14:30").
 */
export const formatDateTime = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};
