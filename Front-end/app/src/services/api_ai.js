import axios from 'axios';
import { AI_API_URL } from '@env';

console.log('Fe get AI API at:' + AI_API_URL);
const api = axios.create({
  baseURL: AI_API_URL,
  timeout: 30000
});

export default api;
