import api from '@services/api';

export const getUserAchievement = async (userId) => {
  try {
    const response = await api.get(`/achievements/user/${userId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Get user achievement failed' };
  }
};

export const addAchievementPoints = async (userId, difficulty) => {
  try {
    const response = await api.post('/achievements/add-points', {
      userId,
      difficulty
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Add achievement points failed' };
  }
};

export const getLevelConfiguration = async () => {
  try {
    const response = await api.get('/achievements/levels');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Get level configuration failed' };
  }
};

export const getLeaderboard = async (page = 1, limit = 50, sortBy = 'totalPoints', order = 'desc') => {
  try {
    const response = await api.get('/achievements/leaderboard', {
      params: { page, limit, sortBy, order }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Get leaderboard failed' };
  }
};