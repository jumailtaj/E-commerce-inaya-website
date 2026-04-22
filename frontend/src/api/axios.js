import axios from "axios";

// Ensure baseURL always points to the backend API endpoint
const rawBaseURL = import.meta.env.VITE_API_URL || 'https://e-commerce-inaya-website-production.up.railway.app/api';
// Normalize to root domain to prevent leading slashes in calls from bypassing the path
const baseURL = rawBaseURL.replace(/\/api\/?$/, '');

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json'
  },
});

api.interceptors.request.use(
  (config) => {
    // Ensure every relative request is prefixed with /api
    if (config.url && !config.url.startsWith('http') && !config.url.startsWith('/api')) {
      config.url = `/api${config.url.startsWith('/') ? '' : '/'}${config.url}`;
    }
    
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
