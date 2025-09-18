import axios from 'axios';

// IMPORTANT: use relative so Vite proxy kicks in
const API = axios.create({
  baseURL: 'http://localhost:9000',   
});

API.interceptors.request.use((config) => {
  const t = sessionStorage.getItem('access_token');
  if (t) {
    const raw = String(t).trim().replace(/^"|"$/g, '');
    config.headers = config.headers || {};
    config.headers.Authorization = /^Bearer\s/i.test(raw) ? raw : `Bearer ${raw}`;
    if (!config.headers.Accept) config.headers.Accept = 'application/json';
  }
  return config;
});

export default API;


