import axios from 'axios';
import { getCookie, deleteCookie } from '@/utils/cookies';

const apiURL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: apiURL,
  // withCredentials: true,
  credentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to add access token from cookie
api.interceptors.request.use((config) => {
  const token = getCookie('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle unauthorized requests
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      // Clear access token cookie and redirect to login
      deleteCookie('accessToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
