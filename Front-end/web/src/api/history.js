import api from '@/configs/axios';


export const getUserHistory = async (userId) => {
  const response = await api.get(`/history/${userId}/history`);
  return response.data;
};

export const addToHistory = async (userId, dishId) => {
  const response = await api.post(`/history/${userId}/history`, { dishId });
  return response.data;
};

export const searchHistoryByUserId = async (userId) => {
  const response = await api.get(`/history/user/${userId}`);
  return response.data;
};

export const searchHistoryByDishId = async (dishId) => {
  const response = await api.get(`/history/dish/${dishId}`);
  return response.data;
};


export const deleteHistory = async (historyId) => {
  const response = await api.delete(`/history/${historyId}`);
  return response.data;
};


export const updateHistory = async (historyId, consumedAt) => {
  const response = await api.put(`/history/${historyId}`, { consumedAt });
  return response.data;
};


export const getHistoryDetail = async (historyId) => {
  const response = await api.get(`/history/${historyId}/detail`);
  return response.data;
};


export const getTotalCalories = async (userId, date) => {
  const response = await api.get(`/history/${userId}/total-calories`, {
    params: { date },
  });
  return response.data;
};
