import axios from "axios";

const api = axios.create({
  baseURL: "https://e-commerce-inaya-website-production.up.railway.app/api",
  headers: {
    "Content-Type": "application/json",
  },
});

console.log("AXIOS BASE URL:", api.defaults.baseURL);

export default api;
