import axios from 'axios';

const baseUrl = 'http' + 's' + ':' + '/' + '/' + 'hirehub-server-tdgt.onrender.com' + '/api';

const api = axios.create({
  baseURL: baseUrl,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('hirehub' + String.fromCharCode(95) + 'token');

    if (token) {
      config.headers.Authorization = 'Bearer ' + token;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error('API ERROR:', error);

    const message = error.response?.data?.message || error.message || 'An unexpected network error occurred';

    return Promise.reject(new Error(message));
  }
);

export default api;
