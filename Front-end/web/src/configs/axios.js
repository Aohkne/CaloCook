import axios from 'axios';
import { getCookie, deleteCookie, setCookie } from '@/utils/cookies';

const apiURL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: apiURL,
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
    const originalRequest = error.config;

    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = getCookie('refreshToken');

      if (refreshToken) {
        try {
          // Gọi API refresh token
          const response = await axios.post(`${apiURL}/api/v1/auth/refresh-token`, {
            refreshToken: refreshToken
          });

          const { accessToken, refreshToken: newRefreshToken } = response.data;

          // Lưu token mới (chỉ có accessToken, refreshToken vẫn dùng cái cũ)
          setCookie('accessToken', accessToken, 7);
          if (newRefreshToken) {
            setCookie('refreshToken', newRefreshToken, 30);
          }

          // Retry request với token mới
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        } catch (refreshError) {
          console.error('Refresh token failed:', refreshError);
          // Refresh token hết hạn, clear tất cả và redirect login
          deleteCookie('accessToken');
          deleteCookie('refreshToken');
          deleteCookie('userRole');
          window.location.href = '/login';
        }
      } else {
        // Không có refresh token, clear và redirect
        deleteCookie('accessToken');
        deleteCookie('userRole');
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default api;
