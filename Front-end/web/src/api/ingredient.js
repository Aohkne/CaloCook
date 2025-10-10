import api from '@/configs/axios';

export const getIngredientsByDish = async (dishId, params = {}) => {
  const response = await api.get(`/ingredient/by-dish/${dishId}`, { params });
  return response.data;
};

export const createIngredient = async (payload) => {
  const response = await api.post('/ingredient', payload);
  return response.data;
};

export const updateIngredient = async (ingredientId, payload) => {
  const response = await api.put(`/ingredient/${ingredientId}`, payload);
  return response.data;
};

export const deactivateIngredient = async (ingredientId) => {
  const response = await api.patch(`/ingredient/${ingredientId}/deactivate`);
  return response.data;
};

export const activateIngredient = async (ingredientId) => {
  const response = await api.patch(`/ingredient/${ingredientId}/activate`);
  return response.data;
};

export default {
  getIngredientsByDish,
  createIngredient
};
