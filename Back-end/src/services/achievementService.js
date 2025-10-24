import { achievementModel } from '@/models/achievementModel'

const getUserAchievement = async (userId) => {
  try {
    return await achievementModel.getByUserId(userId)
  } catch (error) {
    throw error
  }
}

const addPoints = async (userId, difficulty) => {
  try {
    return await achievementModel.addPoints(userId, difficulty)
  } catch (error) {
    throw error
  }
}

const getLeaderboard = async (paginationParams) => {
  try {
    return await achievementModel.getLeaderboard(paginationParams)
  } catch (error) {
    throw error
  }
}
const getLevelConfiguration = async () => {
  try {
    return await achievementModel.getLevelConfiguration()
  } catch (error) {
    throw error
  }
}

const updateLevelConfiguration = async (levels, difficulties) => {
  try {
    // Validation
    if (levels.bronze >= levels.silver || levels.silver >= levels.gold) {
      throw new Error('Level thresholds must be: Bronze < Silver < Gold')
    }
    
    if (difficulties.easy >= difficulties.medium || difficulties.medium >= difficulties.hard) {
      throw new Error('Difficulty points must be: Easy < Medium < Hard')
    }
    
    return await achievementModel.updateLevelConfiguration(levels, difficulties)
  } catch (error) {
    throw error
  }
}
export const achievementService = {
  getUserAchievement,
  addPoints,
  getLeaderboard,
  getLevelConfiguration,
  updateLevelConfiguration
}