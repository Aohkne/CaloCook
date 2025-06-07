import { ObjectId } from 'mongodb'
import { GET_DB } from '@/config/mongodb'


const _COLLECTION_NAME = 'history'

const viewHistory = async (userId) => {
  try {
    console.log('Model: viewHistory', { userId })
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
    return result
  } catch (error) {
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

    console.log('Update result:', result);

    if (!result) {
      throw new Error('History not found');
    }

    return result.value;
  } catch (error) {
    console.error('Error in editHistory:', error);
    throw error;
  }
}


export const historyModel = {
  viewHistory,
  addToHistory,
  searchByUserId,
  searchByDishId,
  deleteFromHistory,
  editHistory
}