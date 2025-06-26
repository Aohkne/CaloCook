import axios from 'axios';
import { API_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';

// STORE
let store;
export const setStore = (storeInstance) => {
  store = storeInstance;
};

console.log('Fe get API at:' + API_URL);
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// KEYS
const STORAGE_KEYS = {
  TOKEN: '@accessToken',
  REFRESH_TOKEN: '@refreshToken'
};

// Request interceptor - Tự động thêm token vào mọi request
api.interceptors.request.use(
  async (config) => {
    try {
      // Lấy token từ AsyncStorage
      const token = await AsyncStorage.getItem(STORAGE_KEYS.TOKEN);

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    } catch (error) {
      return config;
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Xử lý token hết hạn và refresh token
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 (Unauthorized)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // GET REFRESH TOKEN
        const refreshToken = await AsyncStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);

        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        // GET REFRESH TOKEN
        const refreshResponse = await axios.post(`${API_URL}/auth/refresh-token`, {
          refreshToken: refreshToken
        });

        // SAVE
        await AsyncStorage.multiSet([
          [STORAGE_KEYS.TOKEN, accessToken],
          [STORAGE_KEYS.REFRESH_TOKEN, newRefreshToken]
        ]);

        // UPDATE Redux store
        if (store) {
          const { setCredentials } = await import('@/redux/slices/authSlice');
          const currentUser = store.getState().auth.user;

          store.dispatch(
            setCredentials({
              user: currentUser,
              token: accessToken,
              refreshToken: newRefreshToken
            })
          );
        }

        // Retry new token
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);

        // Clear auth data
        await AsyncStorage.multiRemove([STORAGE_KEYS.TOKEN, STORAGE_KEYS.REFRESH_TOKEN, '@user']);

        // Dispatch logout action nếu có store
        if (store) {
          const { logoutLocal } = await import('@/redux/slices/authSlice');
          store.dispatch(logoutLocal());
        }

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
