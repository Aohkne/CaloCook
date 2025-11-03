import Joi from 'joi'
import { GET_DB } from '@/config/mongodb'
import { ObjectId } from 'mongodb'

const _COLLECTION_NAME = 'rating'

const _COLLECTION_SCHEMA = Joi.object({
  userId: Joi.string().required(),
  dishId: Joi.string().required(),
  star: Joi.number().min(1).max(5).required(),
  description: Joi.string().max(500).allow('').optional(),
  createdAt: Joi.date().default(Date.now),
  updatedAt: Joi.date().default(Date.now)
})

const _UPDATE_SCHEMA = Joi.object({
  star: Joi.number().min(1).max(5).required(),
  description: Joi.string().max(500).allow('').optional()
})

const addRating = async (data) => {
  try {
    const validData = await _COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
    validData.userId = new ObjectId(validData.userId)
    validData.dishId = new ObjectId(validData.dishId)
    validData.createdAt = new Date()
    validData.updatedAt = new Date()
    const result = await GET_DB().collection(_COLLECTION_NAME).insertOne(validData)
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const updateRating = async (ratingId, updateData) => {
  try {
    const validData = await _UPDATE_SCHEMA.validateAsync(updateData, { abortEarly: false })
    const dataToUpdate = {
      star: validData.star,
      description: validData.description || '',
      updatedAt: new Date()
    }
    const result = await GET_DB()
      .collection(_COLLECTION_NAME)
      .findOneAndUpdate({ _id: new ObjectId(ratingId) }, { $set: dataToUpdate }, { returnDocument: 'after' })
    if (!result) {
      throw new Error('Rating not found')
    }
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const getDetails = async (ratingId) => {
  try {
    const result = await GET_DB()
      .collection(_COLLECTION_NAME)
      .findOne({ _id: new ObjectId(ratingId) })
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const viewRatings = async (dishId, sortBy = 'createdAt', order = 'desc') => {
  try {
    const sortOrder = order === 'asc' ? 1 : -1

    const ratings = await GET_DB()
      .collection(_COLLECTION_NAME)
      .aggregate([
        {
          $match: { dishId: new ObjectId(dishId) }
        },

        {
          $lookup: {
            from: 'user',
            localField: 'userId',
            foreignField: '_id',
            as: 'userInfo'
          }
        },

        {
          $unwind: {
            path: '$userInfo',
            preserveNullAndEmptyArrays: true
          }
        },

        {
          $project: {
            _id: 1,
            userId: 1,
            fullName: '$userInfo.fullName',
            dishId: 1,
            star: 1,
            description: 1,
            createdAt: 1,
            updatedAt: 1
          }
        },

        {
          $sort: { [sortBy]: sortOrder }
        }
      ])
      .toArray()

    return ratings
  } catch (error) {
    throw new Error(error)
  }
}

const getAverageRating = async (dishId) => {
  try {
    const result = await GET_DB()
      .collection(_COLLECTION_NAME)
      .aggregate([
        { $match: { dishId: new ObjectId(dishId) } },
        {
          $group: {
            _id: null,
            averageRating: { $avg: '$star' },
            totalRatings: { $sum: 1 }
          }
        },
        {
          $project: {
            _id: 0,
            averageRating: { $round: ['$averageRating', 2] },
            totalRatings: 1
          }
        }
      ])
      .toArray()
    return result.length > 0 ? result[0] : { averageRating: 0, totalRatings: 0 }
  } catch (error) {
    throw new Error(error)
  }
}

const getTopRatings = async (limit = 10) => {
  try {
    const ratings = await GET_DB()
      .collection(_COLLECTION_NAME)
      .aggregate([
        {
          $group: {
            _id: '$dishId',
            averageRating: { $avg: '$star' },
            totalRatings: { $sum: 1 }
          }
        },
        {
          $sort: {
            averageRating: -1,
            totalRatings: -1
          }
        },
        {
          $limit: limit
        },
        {
          $lookup: {
            from: 'dish',
            localField: '_id',
            foreignField: '_id',
            as: 'dish'
          }
        },
        { $unwind: '$dish' },
        {
          $project: {
            dishId: { $toString: '$_id' },
            averageRating: { $round: ['$averageRating', 1] },
            totalRatings: 1,
            dish: {
              name: '$dish.name',
              cookingTime: '$dish.cookingTime',
              calorie: '$dish.calorie',
              difficulty: '$dish.difficulty',
              description: '$dish.description',
              imageUrl: '$dish.imageUrl',
              isActive: '$dish.isActive',
              createdAt: { $toString: '$dish.createdAt' },
              updatedAt: { $toString: '$dish.updatedAt' }
            }
          }
        }
      ])
      .toArray()
    return ratings
  } catch (error) {
    throw new Error(error)
  }
}

export const ratingModel = {
  _COLLECTION_NAME,
  _COLLECTION_SCHEMA,
  addRating,
  updateRating,
  getDetails,
  viewRatings,
  getAverageRating,
  getTopRatings
}
