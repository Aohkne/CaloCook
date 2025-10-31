import axios from 'axios';

const apiURL = import.meta.env.VITE_AI_API_URL;

const api = axios.create({
  baseURL: apiURL,
  credentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

export default api;
