import api from './api';

export const hrService = {
  /**
   * Liste toutes les candidatures avec filtres
   * queryString: format "status=en_attente&page=1&limit=20"
   */
  listerCandidatures: async (queryString) => {
    const url = queryString ? `/hr/candidatures?${queryString}` : '/hr/candidatures';
    const response = await api.get(url);
    return response.data;
  },

  /**
   * Récupère le détail d'une candidature
   */
  detailCandidature: async (id) => {
    const response = await api.get(`/hr/candidatures/${id}`);
    return response.data;
  },

  /**
   * Prend une décision sur une candidature
   */
  prendreDecision: async (id, decision) => {
    const response = await api.patch(`/hr/candidatures/${id}/decision`, { decision });
    return response.data;
  },

  /**
   * Récupère les statistiques
   */
  getStats: async () => {
    const response = await api.get('/hr/stats');
    return response.data;
  },

  /**
   * Ajouter une note à une candidature
   */
  addNote: async (candidatureId, note) => {
    const response = await api.post(`/hr/candidatures/${candidatureId}/notes`, { note });
    return response.data;
  },

  /**
   * Récupérer les notes d'une candidature
   */
  getNotes: async (candidatureId) => {
    const response = await api.get(`/hr/candidatures/${candidatureId}/notes`);
    return response.data;
  },

  /**
   * Mettre à jour une note
   */
  updateNote: async (noteId, note) => {
    const response = await api.put(`/hr/notes/${noteId}`, { note });
    return response.data;
  },

  /**
   * Supprimer une note
   */
  deleteNote: async (noteId) => {
    const response = await api.delete(`/hr/notes/${noteId}`);
    return response.data;
  },
};
