import api from './api';

export const candidatureService = {
  submitCandidature: async (formData) => {
    const response = await api.post('/candidatures', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  suivreCandidature: async (reference, email) => {
    const response = await api.get('/candidatures/suivi', {
      params: { reference, email },
    });
    return response.data;
  },
};

