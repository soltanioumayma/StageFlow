import api from './api';

export const hrService = {
  listerCandidatures: async (queryString) => {
    const url = queryString ? `/hr/candidatures?${queryString}` : '/hr/candidatures';
    const response = await api.get(url);
    return response.data;
  },

  detailCandidature: async (id) => {
    const response = await api.get(`/hr/candidatures/${id}`);
    return response.data;
  },

  prendreDecision: async (id, decision) => {
    const response = await api.patch(`/hr/candidatures/${id}/decision`, { decision });
    return response.data;
  },

  getStats: async () => {
    const response = await api.get('/hr/stats');
    return response.data;
  },

  addNote: async (candidatureId, note) => {
    const response = await api.post(`/hr/candidatures/${candidatureId}/notes`, { note });
    return response.data;
  },

  getNotes: async (candidatureId) => {
    const response = await api.get(`/hr/candidatures/${candidatureId}/notes`);
    return response.data;
  },

  updateNote: async (noteId, note) => {
    const response = await api.put(`/hr/notes/${noteId}`, { note });
    return response.data;
  },

  deleteNote: async (noteId) => {
    const response = await api.delete(`/hr/notes/${noteId}`);
    return response.data;
  },
};

