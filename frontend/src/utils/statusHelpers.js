// ============================================================
// Status display helpers shared across RH pages
// ============================================================

/**
 * Returns Tailwind CSS classes for a candidature status badge.
 */
export const getStatusColor = (status) => {
  switch (status) {
    case 'en_attente':
      return 'bg-blue-100 text-blue-800';
    case 'acceptee':
      return 'bg-green-100 text-green-800';
    case 'refusee':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

/**
 * Returns a human-readable label for a candidature status.
 */
export const getStatusLabel = (status) => {
  switch (status) {
    case 'en_attente':
      return 'En attente';
    case 'acceptee':
      return 'Acceptée';
    case 'refusee':
      return 'Refusée';
    default:
      return status;
  }
};
