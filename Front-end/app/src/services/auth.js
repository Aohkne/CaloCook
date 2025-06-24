import api from '@services/api';

// LOGIN
export const loginService = async (credentials) => {
  try {
    const response = await api.post('/auth/login', credentials);

    if (response.data?.user?.role === 'admin') {
      const error = new Error('Your account does not have permission to log in to this platform.');
      error.code = 'ADMIN_LOGIN_FORBIDDEN';
      throw error;
    }

    return response.data;
  } catch (error) {
    console.log('service: ', error);

    throw error.response?.data || { message: 'Login failed' };
  }
};

// REGISTER
export const registerService = async (userData) => {
  try {
    const response = await api.post('/auth/signup', userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Registration failed' };
  }
};

// FORGOT
export const forgotPasswordService = async (email) => {
  try {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Forgot password failed' };
  }
};

// RESET
export const resetPasswordService = async (token, newPassword) => {
  try {
    const response = await api.post('/auth/reset-password', { token, newPassword });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Reset password failed' };
  }
};

// PROFILE
export const getProfileService = async () => {
  try {
    const response = await api.get('/auth/profile');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Get profile failed' };
  }
};

// LOGOUT
export const logoutService = async () => {
  try {
    const response = await api.post('/auth/logout');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Logout failed' };
  }
};

// Làm mới token
export const refreshTokenService = async () => {
  try {
    const response = await api.post('/auth/refresh');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Token refresh failed' };
  }
};
