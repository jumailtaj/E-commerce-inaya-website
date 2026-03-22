import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Ideally use process.env.VITE_API_URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Optional: Add auth token if available
    // const token = localStorage.getItem('token');
    // if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    // Return the response data directly
    return response.data;
  },
  (error) => {
    // Log error or show a global toast/notification
    console.error('API Error:', error.response?.data?.message || error.message);
    return Promise.reject(error);
  }
);

export default api;
