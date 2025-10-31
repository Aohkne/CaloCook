import { StatusCodes } from 'http-status-codes'
import ApiError from '@/utils/ApiError'
import { ratingModel } from '@/models/ratingModel'
import { dishModel } from '@/models/dishModel'
import { ObjectId } from 'mongodb'

const addRating = async (data) => {
  try {
    const dish = await dishModel.getDetails(data.dishId)
    if (!dish) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Dish not found!')
    }
    const existingRating = await ratingModel.viewRatings(data.dishId)
    if (existingRating.some(r => r.userId.toString() === data.userId)) {
      throw new ApiError(StatusCodes.CONFLICT, 'User has already rated this dish!')
    }
    const result = await ratingModel.addRating(data)
    return result
  } catch (error) {
    throw error
  }
}

const updateRating = async (ratingId, updateData) => {
  try {
    const existingRating = await ratingModel.getDetails(ratingId)
    if (!existingRating) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Rating not found!')
    }
    const result = await ratingModel.updateRating(ratingId, updateData)
    return result
  } catch (error) {
    throw error
  }
}

const viewRatings = async (dishId, sortBy, order) => {
  try {
    if (!ObjectId.isValid(dishId)) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid dishId!')
    }
    const ratings = await ratingModel.viewRatings(dishId, sortBy, order)
    return ratings
  } catch (error) {
    throw error
  }
}

const getAverageRating = async (dishId) => {
  try {
    if (!ObjectId.isValid(dishId)) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid dishId!')
    }
    const result = await ratingModel.getAverageRating(dishId)
    return result
  } catch (error) {
    throw error
  }
}

const getTopRatings = async (limit) => {
  try {
    const result = await ratingModel.getTopRatings(limit)
    return result
  } catch (error) {
    throw error
  }
}

export const ratingService = {
  addRating,
  updateRating,
  viewRatings,
  getAverageRating,
  getTopRatings
}