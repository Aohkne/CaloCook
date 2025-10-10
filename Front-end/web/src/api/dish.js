import api from '@/configs/axios';

export const getDishes = async (params = {}) => {
  const {
    name = '',
    minCookingTime = '',
    maxCookingTime = '',
    minCalorie = '',
    maxCalorie = '',
    difficulty = '',
    isActive = '',
    page = 1,
    limit = 10
  } = params;

  const queryParams = {};
  if (name) queryParams.name = name;
  if (minCookingTime) queryParams.minCookingTime = minCookingTime;
  if (maxCookingTime) queryParams.maxCookingTime = maxCookingTime;
  if (minCalorie) queryParams.minCalorie = minCalorie;
  if (maxCalorie) queryParams.maxCalorie = maxCalorie;
  if (difficulty) queryParams.difficulty = difficulty;
  if (isActive !== '') queryParams.isActive = isActive;
  queryParams.page = page;
  queryParams.limit = limit;

  const response = await api.get('/dish', { params: queryParams });
  return response.data;
};

export const updateDish = async (dishId, payload) => {
  const response = await api.put(`/dish/${dishId}`, payload);
  return response.data;
};

export const activateDish = async (dishId) => {
  const response = await api.patch(`/dish/${dishId}/activate`);
  return response.data;
};

export const deactivateDish = async (dishId) => {
  const response = await api.patch(`/dish/${dishId}/deactivate`);
  return response.data;
};

export const createDish = async ({ name, description, cookingTime, calorie, difficulty, isActive, imageUrl }) => {
  const response = await api.post('/dish', {
    name,
    description,
    cookingTime,
    calorie,
    difficulty,
    isActive,
    imageUrl
  });
  return response.data;
};

export const exportDish = async (params = {}) => {
  const {
    name = '',
    minCookingTime = '',
    maxCookingTime = '',
    minCalorie = '',
    maxCalorie = '',
    difficulty = '',
    isActive = '',
    type = 'excel'
  } = params;

  const queryParams = {};
  if (name) queryParams.name = name;
  if (minCookingTime) queryParams.minCookingTime = minCookingTime;
  if (maxCookingTime) queryParams.maxCookingTime = maxCookingTime;
  if (minCalorie) queryParams.minCalorie = minCalorie;
  if (maxCalorie) queryParams.maxCalorie = maxCalorie;
  if (difficulty) queryParams.difficulty = difficulty;
  if (isActive !== '') queryParams.isActive = isActive;

  const response = await api.get(`/dish/export/${type}`, { params: queryParams, responseType: 'blob' });

  //  URL + trigger download
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute(
    'download',
    `dishes_${new Date().toISOString().split('T')[0]}.${type === 'excel' ? 'xlsx' : 'csv'}`
  );
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);

  return { message: 'Export successful' };
};

export const getDishById = async (dishId) => {
  const response = await api.get(`/dish/${dishId}`);
  return response.data;
};
