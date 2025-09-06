import api from '@/configs/axios';

export const getUsers = async (params = {}) => {
  const { username = '', email = '', isActive = '', page = 1, limit = 10 } = params;

  const queryParams = {};
  if (username) queryParams.username = username;
  if (email) queryParams.email = email;
  if (isActive !== '') queryParams.isActive = isActive;
  queryParams.page = page;
  queryParams.limit = limit;

  const response = await api.get('/user', { params: queryParams });
  return response.data;
};

export const activateUser = async (userId) => {
  const response = await api.patch(`/user/${userId}/activate`);
  return response.data;
};

export const deactivateUser = async (userId) => {
  const response = await api.patch(`/user/${userId}/deactivate`);
  return response.data;
};
