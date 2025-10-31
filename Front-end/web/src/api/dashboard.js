import api from '@/configs/axios';

export const getTotalUser = async () => {
  const response = await api.get('/dashboard/user-count');
  return response.data;
};

export const getTotalDish = async () => {
  const response = await api.get('/dashboard/dish-count');
  return response.data;
};

export const getTopFavorites = async (limit = 10) => {
  const response = await api.get(`/dashboard/top-favorites?limit=${limit}`);
  return response.data;
};

export const getTopRatings = async (limit = 10) => {
  const response = await api.get(`/dashboard/top-ratings?limit=${limit}`);
  return response.data;
};
