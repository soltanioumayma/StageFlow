import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 secondes timeout
});

// Configuration du retry
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 seconde

// Fonction de délai
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Intercepteur pour ajouter le token JWT
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercepteur pour gérer les erreurs avec retry
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config;
    
    // Ne pas retry pour les requêtes de login ou si déjà retry
    const isLoginRequest = config?.url?.includes('/auth/login');
    if (!config._retry && !isLoginRequest && config._retryCount < MAX_RETRIES) {
      // Retry pour les erreurs de réseau (5xx, timeout, etc.)
      const shouldRetry = 
        !error.response || // Erreur réseau
        error.response.status >= 500 || // Erreur serveur
        error.code === 'ECONNABORTED' || // Timeout
        error.code === 'NETWORK_ERROR'; // Erreur réseau
      
      if (shouldRetry) {
        config._retry = true;
        config._retryCount = (config._retryCount || 0) + 1;
        
        // Délai exponentiel
        await delay(RETRY_DELAY * config._retryCount);
        
        return api(config);
      }
    }
    
    // Gestion du 401 (token expiré)
    if (error.response?.status === 401 && !isLoginRequest) {
      const refreshToken = localStorage.getItem('refreshToken');
      
      if (refreshToken) {
        try {
          // Tenter de rafraîchir le token
          const refreshResponse = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refreshToken
          });
          
          const { token } = refreshResponse.data;
          localStorage.setItem('token', token);
          
          // Réessayer la requête originale
          config.headers.Authorization = `Bearer ${token}`;
          return api(config);
        } catch (refreshError) {
          // Si le refresh échoue, déconnecter
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
          window.location.href = '/rh/login';
        }
      } else {
        // Pas de refresh token, déconnecter
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/rh/login';
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;