import api from '@/configs/axios';

// 🧾 Lấy toàn bộ lịch sử ăn uống của user
export const getUserHistory = async (userId) => {
  const response = await api.get(`/history/${userId}/history`);
  return response.data;
};

// 🍽️ Thêm món ăn vào lịch sử
export const addToHistory = async (userId, dishId) => {
  const response = await api.post(`/history/${userId}/history`, { dishId });
  return response.data;
};

// 🔍 Tìm lịch sử theo userId
export const searchHistoryByUserId = async (userId) => {
  const response = await api.get(`/history/user/${userId}`);
  return response.data;
};

// 🔍 Tìm lịch sử theo dishId
export const searchHistoryByDishId = async (dishId) => {
  const response = await api.get(`/history/dish/${dishId}`);
  return response.data;
};

// 🗑️ Xóa lịch sử ăn uống
export const deleteHistory = async (historyId) => {
  const response = await api.delete(`/history/${historyId}`);
  return response.data;
};

// ✏️ Sửa thời gian ăn uống
export const updateHistory = async (historyId, consumedAt) => {
  const response = await api.put(`/history/${historyId}`, { consumedAt });
  return response.data;
};

// 📋 Xem chi tiết 1 bản ghi lịch sử
export const getHistoryDetail = async (historyId) => {
  const response = await api.get(`/history/${historyId}/detail`);
  return response.data;
};

// 🔢 Tính tổng lượng calo trong ngày
export const getTotalCalories = async (userId, date) => {
  const response = await api.get(`/history/${userId}/total-calories`, {
    params: { date },
  });
  return response.data;
};
