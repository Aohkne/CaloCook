import Joi from 'joi'
import { GET_DB } from '@/config/mongodb'
import { ObjectId } from 'mongodb'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '@/utils/validators'
const _COLLECTION_NAME = 'achievements'
const _CONFIG_COLLECTION = 'achievement_config'
const _COLLECTION_SCHEMA = Joi.object({
  userId: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE).required(), // THAY ĐỔI: Dùng string pattern như các model khác
  totalPoints: Joi.number().integer().default(0),
  currentLevel: Joi.string().valid('bronze', 'silver', 'gold', 'none').default('none'),
  easyDishCount: Joi.number().integer().default(0),
  mediumDishCount: Joi.number().integer().default(0),
  hardDishCount: Joi.number().integer().default(0),
  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(Date.now)
})

// Điểm cần thiết cho mỗi cấp
const LEVEL_THRESHOLDS = {
  bronze: 100,   // 100 điểm
  silver: 500,   // 500 điểm
  gold: 1000     // 1000 điểm
}

const DIFFICULTY_POINTS = {
  easy: 10,
  medium: 50,
  hard: 100
}

const getByUserId = async (userId) => {
  try {
    // Convert userId sang ObjectId nếu là string
    const userObjectId = typeof userId === 'string' ? new ObjectId(userId) : userId
    
    let achievement = await GET_DB()
      .collection(_COLLECTION_NAME)
      .findOne({ userId: userObjectId })
    
    if (!achievement) {
      const newAchievement = {
        userId: userObjectId, // LƯU DẠNG ObjectId
        totalPoints: 0,
        currentLevel: 'none',
        easyDishCount: 0,
        mediumDishCount: 0,
        hardDishCount: 0,
        createdAt: Date.now(),
        updatedAt: Date.now()
      }
      await GET_DB().collection(_COLLECTION_NAME).insertOne(newAchievement)
      achievement = newAchievement
    }
    
    return achievement
  } catch (error) {
    throw new Error(error)
  }
}


const addPoints = async (userId, difficulty) => {
  try {
    const points = DIFFICULTY_POINTS[difficulty] || 0
    
    // Convert userId sang ObjectId
    const userObjectId = typeof userId === 'string' ? new ObjectId(userId) : userId
    
    // Lấy achievement hiện tại
    const achievement = await getByUserId(userObjectId)
    
    
    
    const newTotalPoints = achievement.totalPoints + points
    
   
    
    // Xác định cấp độ mới
    let newLevel = 'none'
    if (newTotalPoints >= LEVEL_THRESHOLDS.gold) {
      newLevel = 'gold'
    } else if (newTotalPoints >= LEVEL_THRESHOLDS.silver) {
      newLevel = 'silver'
    } else if (newTotalPoints >= LEVEL_THRESHOLDS.bronze) {
      newLevel = 'bronze'
    }
    
    // Cập nhật số lượng món ăn theo độ khó
    const updateData = {
      totalPoints: newTotalPoints,
      currentLevel: newLevel,
      updatedAt: Date.now()
    }
    
    if (difficulty === 'easy') updateData.easyDishCount = achievement.easyDishCount + 1
    if (difficulty === 'medium') updateData.mediumDishCount = achievement.mediumDishCount + 1
    if (difficulty === 'hard') updateData.hardDishCount = achievement.hardDishCount + 1
    
    const oldLevel = achievement.currentLevel
    
    
    
    // THÊM ĐOẠN NÀY - CẬP NHẬT VÀO DATABASE
    const updateResult = await GET_DB()
      .collection(_COLLECTION_NAME)
      .updateOne(
        { userId: userObjectId }, // Tìm bằng ObjectId
        { $set: updateData }       // Cập nhật dữ liệu mới
      )
    
   
    
    // Nếu không update được, throw error
    if (updateResult.matchedCount === 0) {
      throw new Error('Achievement not found for user: ' + userId)
    }
    
    return {
      points,
      totalPoints: newTotalPoints,
      levelUp: oldLevel !== newLevel,
      newLevel,
      oldLevel
    }
  } catch (error) {
    console.error('Error in addPoints:', error);
    throw new Error(error)
  }
}
const getLeaderboard = async (paginationParams) => {
  try {
    const { skip, limit, sortBy, order } = paginationParams
    
    
    
    const sortOrder = order === 'desc' ? -1 : 1
    const sortField = sortBy === 'createdAt' ? 'createdAt' : 'totalPoints'
    
    const leaderboard = await GET_DB()
      .collection(_COLLECTION_NAME)
      .aggregate([
        // THAY ĐỔI: Convert userId STRING sang ObjectId để join
        {
          $addFields: {
            userObjectId: { $toObjectId: '$userId' } // userId là string, convert sang ObjectId
          }
        },
        
        // Join với collection user (KHÔNG CÓ chữ S)
        {
          $lookup: {
            from: 'user', // QUAN TRỌNG: Tên collection là 'user' không phải 'users'
            localField: 'userObjectId',
            foreignField: '_id',
            as: 'userInfo'
          }
        },
        
        // Chỉ lấy những record có user info
        {
          $match: {
            userInfo: { $ne: [] }
          }
        },
        
        { $unwind: '$userInfo' },
        { $sort: { [sortField]: sortOrder } },
        { $skip: skip },
        { $limit: limit },
        {
          $project: {
            userId: 1,
            totalPoints: 1,
            currentLevel: 1,
            easyDishCount: 1,
            mediumDishCount: 1,
            hardDishCount: 1,
            createdAt: 1,
            updatedAt: 1,
            'userInfo.username': 1,
            'userInfo.fullName': 1,
            'userInfo.avatarUrl': 1, // THAY ĐỔI: avatarUrl không phải avatar_url
            'userInfo.email': 1
          }
        }
      ])
      .toArray()
    
    
    // Đếm tổng số achievement có user hợp lệ
    const total = await GET_DB()
      .collection(_COLLECTION_NAME)
      .aggregate([
        {
          $addFields: {
            userObjectId: { $toObjectId: '$userId' }
          }
        },
        {
          $lookup: {
            from: 'user', // Tên collection là 'user'
            localField: 'userObjectId',
            foreignField: '_id',
            as: 'userInfo'
          }
        },
        {
          $match: {
            userInfo: { $ne: [] }
          }
        },
        {
          $count: 'total'
        }
      ])
      .toArray()
    
    const totalCount = total[0]?.total || 0
    
    
    return {
      leaderboard,
      total: totalCount
    }
  } catch (error) {
    
    throw new Error(error)
  }
}
const getLevelConfiguration = async () => {
  try {
    const config = await GET_DB()
      .collection(_CONFIG_COLLECTION)
      .findOne({ type: 'level_config' })
    
    if (!config) {
      // Nếu chưa có config, tạo mới với giá trị mặc định
      const defaultConfig = {
        type: 'level_config',
        levels: LEVEL_THRESHOLDS,
        difficulties: DIFFICULTY_POINTS,
        createdAt: Date.now(),
        updatedAt: Date.now()
      }
      await GET_DB().collection(_CONFIG_COLLECTION).insertOne(defaultConfig)
      return defaultConfig
    }
    
    return config
  } catch (error) {
    throw new Error(error)
  }
}

const updateLevelConfiguration = async (levels, difficulties) => {
  try {
    const updateData = {
      levels,
      difficulties,
      updatedAt: Date.now()
    }
    
    const result = await GET_DB()
      .collection(_CONFIG_COLLECTION)
      .updateOne(
        { type: 'level_config' },
        { 
          $set: updateData,
          $setOnInsert: { 
            type: 'level_config',
            createdAt: Date.now() 
          }
        },
        { upsert: true }
      )
    
    // Cập nhật biến constant trong memory (để các hàm khác dùng)
    Object.assign(LEVEL_THRESHOLDS, levels)
    Object.assign(DIFFICULTY_POINTS, difficulties)
    
    return { levels, difficulties }
  } catch (error) {
    throw new Error(error)
  }
}

// Export thêm 2 hàm mới
export const achievementModel = {
  _COLLECTION_NAME,
  _COLLECTION_SCHEMA,
  LEVEL_THRESHOLDS,
  DIFFICULTY_POINTS,
  getByUserId,
  addPoints,
  getLeaderboard,
  getLevelConfiguration, // THÊM
  updateLevelConfiguration // THÊM
}