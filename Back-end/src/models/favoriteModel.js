import Joi from 'joi'
import { GET_DB } from '@/config/mongodb'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '@/utils/validators'
import { ObjectId } from 'mongodb'

// Define Collection (name & schema)
const _COLLECTION_NAME = 'favorites'
const _COLLECTION_SCHEMA = Joi.object({
  userId: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE).required(),
  dishId: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE).required(),
  createdAt: Joi.date().timestamp('javascript').default(Date.now)
})

const createSortObject = (sortBy, order) => {
  const sortOrder = order === 'asc' ? 1 : -1
  return { [sortBy]: sortOrder }
}

const getfavoriteByUserId = async (userId) => {
  try {
    return await GET_DB()
      .collection(_COLLECTION_NAME)
      .find({ userId: new ObjectId(userId) })
      .toArray()
  } catch (error) {
    throw new Error(error)
  }
}

const addToFavorites = async (userId, dishId) => {
  try {
    const dish = await GET_DB()
      .collection('dish')
      .findOne({ _id: new ObjectId(dishId) })
    if (!dish) {
      throw new Error('Dish not found')
    }

    const user = await GET_DB()
      .collection('user')
      .findOne({ _id: new ObjectId(userId) })
    if (!user) {
      throw new Error('User not found')
    }

    const existingFavorite = await GET_DB()
      .collection(_COLLECTION_NAME)
      .findOne({ userId: new ObjectId(userId), dishId: new ObjectId(dishId) })
    if (existingFavorite) {
      throw new Error('Dish already in favorites')
    }
    const favoriteData = {
      userId: new ObjectId(userId),
      dishId: new ObjectId(dishId),
      createdAt: new Date()
    }
    await GET_DB().collection(_COLLECTION_NAME).insertOne(favoriteData)

    return {
      userId: favoriteData.userId.toString(),
      dishId: favoriteData.dishId.toString(),
      createdAt: favoriteData.createdAt.toISOString()
    }
  } catch (error) {
    throw error
  }
}

const viewFavorites = async (userId, paginationParams) => {
  try {
    //console.log('Model: viewFavorites', { userId, paginationParams })
    const { skip, limit, sortBy, order } = paginationParams
    const sortObject = createSortObject(sortBy, order)

    const [data, totalCount] = await Promise.all([
      GET_DB()
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
          { $unwind: { path: '$dish', preserveNullAndEmptyArrays: true } },
          { $sort: sortObject },
          { $skip: skip },
          { $limit: limit },
          {
            $project: {
              userId: { $toString: '$userId' },
              dishId: { $toString: '$dishId' },
              createdAt: { $toString: '$createdAt' },
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
        .toArray(),
      GET_DB()
        .collection(_COLLECTION_NAME)
        .countDocuments({ userId: new ObjectId(userId) })
    ])

    //console.log('viewFavorites result:', { data, totalCount })
    return { data, totalCount }
  } catch (error) {
    console.error('Error in viewFavorites:', error)
    throw error
  }
}

const deleteFromFavorites = async (userId, dishId) => {
  try {
    const favorite = await GET_DB()
      .collection(_COLLECTION_NAME)
      .findOne({ userId: new ObjectId(userId), dishId: new ObjectId(dishId) })
    if (!favorite) {
      throw new Error('Favorite not found')
    }

    await GET_DB()
      .collection(_COLLECTION_NAME)
      .deleteOne({ userId: new ObjectId(userId), dishId: new ObjectId(dishId) })

    return { message: 'Dish removed from favorites' }
  } catch (error) {
    throw new Error(error)
  }
}
const getTopFavorites = async (limit = 10) => {
  try {
    const topFavorites = await GET_DB()
      .collection(_COLLECTION_NAME)
      .aggregate([
        {
          $group: {
            _id: '$dishId',
            favoriteCount: { $sum: 1 }
          }
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
            favoriteCount: 1,
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
        },
        { $sort: { favoriteCount: -1 } },
        { $limit: limit }
      ])
      .toArray()
    return topFavorites
  } catch (error) {
    console.error('Error in getTopFavorites:', error)
    throw error
  }
}
export const favoriteModel = {
  _COLLECTION_NAME,
  _COLLECTION_SCHEMA,
  getfavoriteByUserId,
  addToFavorites,
  viewFavorites,
  deleteFromFavorites,
  getTopFavorites
}
