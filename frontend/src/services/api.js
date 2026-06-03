import axios from 'axios';

const rawApiUrl = import.meta.env.VITE_API_URL;

if (!rawApiUrl) {
  throw new Error('VITE_API_URL is not configured. Set it to your backend URL.');
}

const normalizedApiUrl = rawApiUrl.replace(/\/$/, '');

// Accept either a backend root URL or a direct /api URL from Vercel/Render env vars.
export const API_BASE_URL = normalizedApiUrl.endsWith('/api')
  ? normalizedApiUrl
  : `${normalizedApiUrl}/api`;

// Create instance of axios with the backend API URL
const API = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor to automatically add JWT token from localStorage to requests
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('vibeconnect_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default API;
