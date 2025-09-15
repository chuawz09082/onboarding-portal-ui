import axios from 'axios';

const API_BASE =
  // Prefer a gateway for /application-service/... if you have one
  // eslint-disable-next-line no-undef
  (import.meta?.env?.VITE_API_BASE ||
    // fallback to auth base for dev
    // eslint-disable-next-line no-undef
    import.meta?.env?.VITE_AUTH_BASE ||
    'http://localhost:8080');

const API = axios.create({
  baseURL: API_BASE,
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

API.interceptors.response.use(
  (r) => r,
  (err) => {
    // Leave this quiet; uncomment for debugging
    // if (err?.response?.status === 401) console.warn('401 Unauthorized');
    return Promise.reject(err);
  }
);

export default API;







