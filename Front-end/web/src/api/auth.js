import api from '@/configs/axios';

export const login = async (usernameOrEmail, password) => {
  const response = await api.post('/auth/login', {
    emailOrUsername: usernameOrEmail,
    password
  });
  return response.data;
};
