import { achievementService } from '@/services/achievementService'
import { achievementModel } from '@/models/achievementModel'
import { StatusCodes } from 'http-status-codes'
import { paginationHelper } from '@/utils/pagination'
const getUserAchievement = async (req, res, next) => {
  try {
    const { userId } = req.params
    const achievement = await achievementService.getUserAchievement(userId)
    
    res.status(StatusCodes.OK).json({
      code: StatusCodes.OK,
      message: 'Get achievement successfully',
      data: achievement
    })
  } catch (error) {
    next(error)
  }
}

const addPoints = async (req, res, next) => {
  try {
    const { userId, difficulty } = req.body
    const result = await achievementService.addPoints(userId, difficulty)
    
    res.status(StatusCodes.OK).json({
      code: StatusCodes.OK,
      message: 'Points added successfully',
      data: result
    })
  } catch (error) {
    next(error)
  }
}

const getLevelConfiguration = async (req, res, next) => {
  try {
    const config = await achievementService.getLevelConfiguration() // THAY ĐỔI: Lấy từ DB
    
    res.status(StatusCodes.OK).json({
      code: StatusCodes.OK,
      message: 'Get level configuration successfully',
      data: {
        levels: config.levels || achievementModel.LEVEL_THRESHOLDS,
        difficulties: config.difficulties || achievementModel.DIFFICULTY_POINTS
      }
    })
  } catch (error) {
    next(error)
  }
}

const getLeaderboard = async (req, res, next) => {
  try {
    
    const paginationParams = req.pagination
    
    const { leaderboard, total } = await achievementService.getLeaderboard(paginationParams)
    
    const response = paginationHelper.formatPaginatedResponse(
      'Get leaderboard successfully',
      total,
      paginationParams,
      leaderboard
    )
    
    res.status(StatusCodes.OK).json(response)
  } catch (error) {
    next(error)
  }
}
const updateLevelConfiguration = async (req, res, next) => {
  try {
    const { levels, difficulties } = req.body
    
    const result = await achievementService.updateLevelConfiguration(levels, difficulties)
    
    res.status(StatusCodes.OK).json({
      code: StatusCodes.OK,
      message: 'Update level configuration successfully',
      data: result
    })
  } catch (error) {
    next(error)
  }
}

export const achievementController = {
  getUserAchievement,
  addPoints,
  getLevelConfiguration,
  updateLevelConfiguration, // THÊM
  getLeaderboard
}