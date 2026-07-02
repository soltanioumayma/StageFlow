import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

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

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config;

    const isLoginRequest = config?.url?.includes('/auth/login');
    if (!config._retry && !isLoginRequest && config._retryCount < MAX_RETRIES) {
      const shouldRetry =
        !error.response ||
        error.response.status >= 500 ||
        error.code === 'ECONNABORTED' ||
        error.code === 'NETWORK_ERROR';

      if (shouldRetry) {
        config._retry = true;
        config._retryCount = (config._retryCount || 0) + 1;

        await delay(RETRY_DELAY * config._retryCount);

        return api(config);
      }
    }

    if (error.response?.status === 401 && !isLoginRequest) {
      const refreshToken = localStorage.getItem('refreshToken');

      if (refreshToken) {
        try {
          const refreshResponse = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refreshToken
          });

          const { token } = refreshResponse.data;
          localStorage.setItem('token', token);

          config.headers.Authorization = `Bearer ${token}`;
          return api(config);
        } catch (refreshError) {
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
          window.location.href = '/rh/login';
        }
      } else {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/rh/login';
      }
    }

    return Promise.reject(error);
  }
);

export default api;
