import api from '@/configs/axios';

export const getStepsByDish = async (dishId, params = {}) => {
  const response = await api.get(`/step/by-dish/${dishId}`, { params });
  return response.data;
};

export const createStep = async (payload) => {
  const response = await api.post('/step', payload);
  return response.data;
};

export default {
  getStepsByDish,
  createStep
};
