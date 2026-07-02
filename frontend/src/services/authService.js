import api from './api';

export const authService = {
  /**
   * Connexion RH
   */
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    
    // Stocker le token et le refresh token
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    if (response.data.refreshToken) {
      localStorage.setItem('refreshToken', response.data.refreshToken);
    }
    if (response.data.user) {
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    
    return response.data;
  },

  /**
   * Récupère le profil utilisateur
   */
  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  /**
   * Déconnexion
   */
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  },

  /**
   * Vérifie si l'utilisateur est connecté
   */
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },
};
