import axios from 'axios';

// Use the Auth Server base for /api/login and /hr/registration-token
const AUTH_BASE = import.meta.env.VITE_AUTH_BASE || 'http://localhost:8080';

const API = axios.create({
  baseURL: AUTH_BASE
});

API.interceptors.request.use((config) => {
  const t = sessionStorage.getItem('access_token');
  if (t) config.headers.Authorization = `Bearer ${t}`;
  return config;
});

export default API;








