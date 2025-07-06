import { ObjectId } from 'mongodb'
import { GET_DB } from '@/config/mongodb'


const _COLLECTION_NAME = 'history'

const viewHistory = async (userId) => {
  try {
    //console.log('Model: viewHistory', { userId })
    const histories = await GET_DB()
      .collection(_COLLECTION_NAME)
      .aggregate([
        { $match: { userId: new ObjectId(userId) } },
        {
          $lookup: {
            from: 'dish',
            localField: 'dishId',
            foreignField: '_id',
            as: 'dish'
          }
        },
        { $unwind: '$dish' },
        {
          $project: {
            userId: { $toString: '$userId' },
            dishId: { $toString: '$dishId' },
            consumedAt: { $toString: '$consumedAt' },
            createdAt: { $toString: '$createdAt' },
            updatedAt: { $toString: '$updatedAt' },
            dish: {
              name: 1,
              cookingTime: 1,
              calorie: 1,
              difficulty: 1,
              description: 1,
              imageUrl: 1,
              isActive: 1,
              createdAt: { $toString: '$dish.createdAt' },
              updatedAt: { $toString: '$dish.updatedAt' }
            }
          }
        }
      ])
      .toArray()

    return histories
  } catch (error) {
    throw error
  }
}

const addToHistory = async ({ userId, dishId }) => {
  try {
    //console.log('addToHistory called with:', { userId, dishId })
    const newHistory = {
      userId: new ObjectId(userId),
      dishId: new ObjectId(dishId),
      consumedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    }
    const result = await GET_DB()
      .collection(_COLLECTION_NAME)
      .insertOne(newHistory)
    //console.log('addToHistory result:', result)
    return result
  } catch (error) {
    console.error('Error in addToHistory:', error)
    throw error
  }
}
const viewHistoryDetail = async (historyId) => {
  try {
    //console.log('Model: viewHistoryDetail', { historyId })
    const history = await GET_DB()
      .collection(_COLLECTION_NAME)
      .aggregate([
        { $match: { _id: new ObjectId(historyId) } },
        {
          $lookup: {
            from: 'dish',
            localField: 'dishId',
            foreignField: '_id',
            as: 'dish'
          }
           },
        { $unwind: { path: '$dish', preserveNullAndEmptyArrays: true } },
        {
          $project: {
            userId: { $toString: '$userId' },
            dishId: { $toString: '$dishId' },
            consumedAt: { $toString: '$consumedAt' },
            createdAt: { $toString: '$createdAt' },
            updatedAt: { $toString: '$updatedAt' },
            dish: {
               name: 1,
              cookingTime: 1,
              calorie: 1,
              difficulty: 1,
              description: 1,
              imageUrl: 1,
              isActive: 1,
              createdAt: { $toString: '$dish.createdAt' },
              updatedAt: { $toString: '$dish.updatedAt' }
            }
          }
        }
      ])
      .toArray()
       //console.log('viewHistoryDetail result:', history)
    return history.length > 0 ? history[0] : null
  } catch (error) {
    console.error('Error in viewHistoryDetail:', error)
    throw error
  }
}
const searchByUserId = async (userId) => {
  try {
    const histories = await GET_DB()
      .collection(_COLLECTION_NAME)
      .find({ userId: new ObjectId(userId) })
      .toArray()
    return histories
  } catch (error) {
    throw error
  }
}

const searchByDishId = async (dishId) => {
  try {
    const histories = await GET_DB()
      .collection(_COLLECTION_NAME)
      .find({ dishId: new ObjectId(dishId) })
      .toArray()
    return histories
  } catch (error) {
    throw error
  }
}

const deleteFromHistory = async (historyId) => {
  try {
    const result = await GET_DB()
      .collection(_COLLECTION_NAME)
      .deleteOne({ _id: new ObjectId(historyId) })
    if (result.deletedCount === 0) {
      throw new Error('History not found')
    }
    return { message: 'History deleted successfully' }
  } catch (error) {
    throw error
  }
}

const editHistory = async ({ historyId, consumedAt }) => {
  try {
    const result = await GET_DB()
      .collection(_COLLECTION_NAME)
      .findOneAndUpdate(
        { _id: new ObjectId(historyId) },
        { $set: { consumedAt: new Date(consumedAt), updatedAt: new Date() } },
        { returnDocument: 'after' }
      );

    //console.log('Update result:', result);

    if (!result) {
      throw new Error('History not found');
    }

    return result.value;
  } catch (error) {
    console.error('Error in editHistory:', error);
    throw error;
  }
}
const getTotalCaloriesByDate = async (userId, date) => {
  try {
    //console.log('Model: getTotalCaloriesByDate', { userId, date })
    const startOfDay = new Date(date)
    startOfDay.setHours(0, 0, 0, 0)
    const endOfDay = new Date(date)
    endOfDay.setHours(23, 59, 59, 999)
const result = await GET_DB()
      .collection(_COLLECTION_NAME)
      .aggregate([
        {
          $match: {
            userId: new ObjectId(userId),
            consumedAt: {
              $gte: startOfDay,
              $lte: endOfDay
            }
          }
        },
        {
          $lookup: {
            from: 'dish',
            localField: 'dishId',
            foreignField: '_id',
            as: 'dish'
          }
        },
        { $unwind: '$dish' },
        {
           $group: {
            _id: null,
            totalCalories: { $sum: '$dish.calorie' },
            dishes: {
              $push: {
                dishId: { $toString: '$dishId' },
                name: '$dish.name',
                calorie: '$dish.calorie',
                eatenAt: { $toString: '$consumedAt' }
              }
            }
          }
        },
        {
          $project: {
            _id: 0,
            totalCalories: 1,
            dishes: 1
          }
        }
      ])
      .toArray()

    //console.log('getTotalCaloriesByDate result:', result)
    return result.length > 0 ? result[0] : { totalCalories: 0, dishes: [] }
    } catch (error) {
    //console.error('Error in getTotalCaloriesByDate:', error)
    throw error
  }
}
export const historyModel = {
  viewHistory,
  addToHistory,
  searchByUserId,
  searchByDishId,
  deleteFromHistory,
  editHistory,
  viewHistoryDetail,
  getTotalCaloriesByDate
}