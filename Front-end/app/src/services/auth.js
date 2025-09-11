import api from '@services/api';

// LOGIN
export const loginService = async (credentials) => {
  try {
    const response = await api.post('/auth/login', credentials);

    if (response.data?.role === 'admin') {
      throw {
        code: 'ADMIN_LOGIN_FORBIDDEN',
        message: 'Your account does not have permission to log in to this platform.'
      };
    }

    return response.data;
  } catch (error) {
    // Axios
    if (error.response?.data) {
      throw error.response.data;
    }

    throw {
      message: error.message || 'Login failed',
      code: error.code || 'LOGIN_FAILED'
    };
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
    const response = await api.post('/auth/forgot-password-otp', { email });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Forgot password failed' };
  }
};

// RESET
export const resetPasswordService = async (otp, email, newPassword) => {
  try {
    const response = await api.post('/auth/reset-password-otp', { otp, email, newPassword });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Reset password failed' };
  }
};

// CHANGE PASSWORD - CLEAN VERSION
export const changePasswordService = async (passwordData) => {
  try {
    const response = await api.post('/auth/change-password', {
      oldPassword: passwordData.oldPassword,
      newPassword: passwordData.newPassword
    });

    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Change password failed' };
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
