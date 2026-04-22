import axios from "axios";

// Ensure baseURL always points to the backend API endpoint
const baseURL = import.meta.env.VITE_API_URL || 'https://e-commerce-inaya-website-production.up.railway.app/api';

const api = axios.create({
  baseURL: baseURL.endsWith('/api') ? baseURL : `${baseURL}/api`,
  headers: {
    'Content-Type': 'application/json'
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

console.log("AXIOS ACTIVE - Connecting to:", api.defaults.baseURL);

export default api;
