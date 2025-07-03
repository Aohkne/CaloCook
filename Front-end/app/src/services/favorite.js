import api from '@services/api';

// Get favorites by userId
export const getFavoritesService = async (userId, params = {}) => {
  try {
    const { page = 1, limit = 10, sortBy = 'createdAt', order = 'desc' } = params;
    const response = await api.get(`/favorite/${userId}?page=${page}&limit=${limit}&sortBy=${sortBy}&order=${order}`);

    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Get favorites failed' };
  }
};

// Like DISHES
export const likeDishService = async (data) => {
  try {
    const response = await api.post('/favorite', data);
    return response.data.data;
  } catch (error) {
    throw error.response?.data || { message: 'Like dish failed' };
  }
};

// Dislike DISHES
export const disLikeDishService = async (data) => {
  try {
    const response = await api.delete('/favorite', { data });
    return response.data.data;
  } catch (error) {
    throw error.response?.data || { message: 'DisLike dish failed' };
  }
};
