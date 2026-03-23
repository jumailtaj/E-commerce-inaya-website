import axios from "axios";

// Debug (remove later)
console.log("ENV:", import.meta.env);
console.log("API URL:", import.meta.env.VITE_API_URL);

const API_URL = import.meta.env.VITE_API_URL;

// Safety check
if (!API_URL) {
  throw new Error("❌ VITE_API_URL is not defined. Check Vercel env variables.");
}

const api = axios.create({
  baseURL: `${API_URL}/api`,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach token if exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;