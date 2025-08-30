import { StatusCodes } from 'http-status-codes'
import ApiError from '@/utils/ApiError'
import { ratingService } from '@/services/ratingService'

const addRating = async (req, res, next) => {
  try {
    const { userId, dishId, star, description } = req.body
    // Removed req.user check for testing without authentication
    const result = await ratingService.addRating({ userId, dishId, star, description })
    return res.status(StatusCodes.CREATED).json({
      code: StatusCodes.CREATED,
      message: 'Rating created successfully',
      data: result
    })
  } catch (error) {
    next(error)
  }
}

const updateRating = async (req, res, next) => {
  try {
    const ratingId = req.params.id
    const { star, description } = req.body
    // Removed req.user check for testing without authentication
    const result = await ratingService.updateRating(ratingId, { star, description })
    return res.status(StatusCodes.OK).json({
      code: StatusCodes.OK,
      message: 'Rating updated successfully',
      data: result
    })
  } catch (error) {
    next(error)
  }
}

const viewRatings = async (req, res, next) => {
  try {
    const { dishId } = req.query
    const { sortBy, order } = req.query
    const ratings = await ratingService.viewRatings(dishId, sortBy, order)
    return res.status(StatusCodes.OK).json({
      code: StatusCodes.OK,
      message: 'Get successful',
      data: ratings
    })
  } catch (error) {
    next(error)
  }
}

const getAverageRating = async (req, res, next) => {
  try {
    const { dishId } = req.query
    const result = await ratingService.getAverageRating(dishId)
    return res.status(StatusCodes.OK).json({
      code: StatusCodes.OK,
      message: 'Get successful',
      data: result
    })
  } catch (error) {
    next(error)
  }
}

const getTopRatings = async (req, res, next) => {
  try {
    const { limit } = req.query
    const topRatings = await ratingService.getTopRatings(parseInt(limit) || 10)
    return res.status(StatusCodes.OK).json({
      code: StatusCodes.OK,
      message: 'Get successful',
      data: topRatings
    })
  } catch (error) {
    next(error)
  }
}

export const ratingController = {
  addRating,
  updateRating,
  viewRatings,
  getAverageRating,
  getTopRatings
}