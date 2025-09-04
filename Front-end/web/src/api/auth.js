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
