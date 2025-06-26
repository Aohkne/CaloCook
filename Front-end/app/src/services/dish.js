import api from '@services/api';

// GET RANDOM DISHES
export const getRandomDishService = async (userId, limit = 10) => {
  try {
    const response = await api.get(`/dish/random/userId/${userId}?limit=${limit}`);
    return response.data.data;
  } catch (error) {
    throw error.response?.data || { message: 'Get random dish failed' };
  }
};
