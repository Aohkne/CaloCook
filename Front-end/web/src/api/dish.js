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
