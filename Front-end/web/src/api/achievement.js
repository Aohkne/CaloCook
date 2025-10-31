import api from '@/configs/axios';

export const getUserAchievement = async (userId) => {
  return await api.get(`/achievements/user/${userId}`);
};

export const addAchievementPoints = async (userId, difficulty) => {
  return await api.post('/achievements/add-points', { userId, difficulty });
};
export const getLevelConfiguration = async () => {
  return await api.get('/achievements/levels');
};

export const updateLevelConfiguration = async (levelData) => {
  return await api.put('/achievements/levels', levelData);
};
// THÊM API MỚI
export const getLeaderboard = async (page = 1, limit = 50, sortBy = 'totalPoints', order = 'desc') => {
  return await api.get(`/achievements/leaderboard`, {
    params: { page, limit, sortBy, order }
  });
};