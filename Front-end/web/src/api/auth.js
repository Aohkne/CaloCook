import api from '@/configs/axios';

export const login = async (usernameOrEmail, password) => {
  const response = await api.post('/auth/login', {
    emailOrUsername: usernameOrEmail,
    password
  });
  return response.data;
};

export const register = async (username, email, password) => {
  const response = await api.post('/auth/signup', {
    username: username,
    email: email,
    password
  });
  return response.data;
};

export const logout = async (refreshToken) => {
  try {
    const response = await api.post('/auth/logout', {
      refreshToken: refreshToken
    });
    return response.data;
  } catch (error) {
    console.warn('Logout API failed, clearing client tokens anyway:', error);
    throw error;
  }
};

export const forgotPassword = async (email) => {
  try {
    const response = await api.post('/auth/forgot-password-otp', {
      email
    });
    return response.data;
  } catch (error) {
    console.warn('forgot password API failed: ', error);
    throw error;
  }
};

export const resetPassword = async (otp, email, newPassword) => {
  try {
    const response = await api.post('/auth/reset-password-otp', {
      otp,
      email,
      newPassword
    });
    return response.data;
  } catch (error) {
    console.warn('reset password API failed: ', error);
    throw error;
  }
};

export const changePassword = async (oldPassword, newPassword) => {
  try {
    const response = await api.post('/auth/change-password', {
      oldPassword,
      newPassword
    });
    return response.data;
  } catch (error) {
    console.error('Change password API failed:', error);
    throw error;
  }
};

export const googleLogin = async (credential) => {
  try {
    const response = await api.post('/auth/google-login', {
      credential: credential
    });
    return response.data;
  } catch (error) {
    console.error('Google login API failed:', error);
    throw error;
  }
};
