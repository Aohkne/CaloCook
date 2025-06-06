import { favoriteModel } from '@/models/favoriteModel'
import { StatusCodes } from 'http-status-codes'
import ApiError from '@/utils/ApiError'
import { ObjectId } from 'mongodb'
import { GET_DB } from '@/config/mongodb'

const addToFavorites = async (userId, dishId) => {
  try {

    const dish = await GET_DB().collection('dish').findOne({ _id: new ObjectId(dishId) })
    if (!dish) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Dish not found!')
    }


    const user = await GET_DB().collection('user').findOne({ _id: new ObjectId(userId) })
    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'User not found!')
    }

    const existingFavorite = await GET_DB()
      .collection(favoriteModel._COLLECTION_NAME)
      .findOne({ userId: new ObjectId(userId), dishId: new ObjectId(dishId) })
    if (existingFavorite) {
      throw new ApiError(StatusCodes.CONFLICT, 'Dish already in favorites!')
    }

    const favoriteData = {
      userId: new ObjectId(userId),
      dishId: new ObjectId(dishId),
      createdAt: new Date()
    }

    const createdFavorite = await favoriteModel.addToFavorites(userId, dishId)

    return createdFavorite
  } catch (error) {
    throw error
  }
}

const viewFavorites = async (userId, sortBy, order) => {
  try {
    const favorites = await favoriteModel.viewFavorites(userId, sortBy, order)

    return favorites
  } catch (error) {
    throw error
  }
}

const deleteFromFavorites = async (userId, dishId) => {
  try {
    const result = await favoriteModel.deleteFromFavorites(userId, dishId)

    return result
  } catch (error) {
    throw error
  }
}

export const favoriteService = {
  addToFavorites,
  viewFavorites,
  deleteFromFavorites
}