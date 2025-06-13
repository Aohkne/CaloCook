import axios from 'axios';
import { API_URL } from '@env';

console.log('API:' + API_URL);
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

export default api;
