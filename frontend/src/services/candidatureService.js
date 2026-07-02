import api from './api';

export const candidatureService = {
  /**
   * Soumet une candidature
   */
  submitCandidature: async (formData) => {
    const response = await api.post('/candidatures', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  /**
   * Suit une candidature
   */
  suivreCandidature: async (reference, email) => {
    const response = await api.get('/candidatures/suivi', {
      params: { reference, email },
    });
    return response.data;
  },
};
