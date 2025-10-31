import api from '@/configs/axios';

export const getStepsByDish = async (dishId, params) => {
  const response = await api.get(`/step/by-dish/${dishId}`, { params });
  return response.data;
};

export const createStep = async (payload) => {
  const response = await api.post('/step', payload);
  return response.data;
};

export const updateStep = async (stepId, payload) => {
  const response = await api.put(`/step/${stepId}`, payload);
  return response.data;
};

export const deactivateStep = async (stepId) => {
  const response = await api.patch(`/step/${stepId}/deactivate`);
  return response.data;
};

export const activateStep = async (stepId) => {
  const response = await api.patch(`/step/${stepId}/activate`);
  return response.data;
};

export default {
  getStepsByDish,
  createStep,
  updateStep,
  deactivateStep,
  activateStep
};
