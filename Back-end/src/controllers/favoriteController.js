import { StatusCodes } from 'http-status-codes'
import { favoriteService } from '@/services/favoriteService'

const addToFavorites = async (req, res, next) => {
  try {
    const userId = req.params.userId
    const dishId = req.body.dishId

    const favorite = await favoriteService.addToFavorites(userId, dishId)

    res.status(StatusCodes.CREATED).json({
      code: StatusCodes.CREATED,
      message: 'Favorite created successfully',
      data: favorite
    })
  } catch (error) {
    next(error)
  }
}

const viewFavorites = async (req, res, next) => {
  try {
    const userId = req.params.userId
    const { sortBy, order } = req.query

    const favorites = await favoriteService.viewFavorites(userId, sortBy, order)

    res.status(StatusCodes.OK).json({
      code: StatusCodes.OK,
      message: 'Favorites retrieved successfully',
      data: favorites
    })
  } catch (error) {
    next(error)
  }
}

const deleteFromFavorites = async (req, res, next) => {
  try {
    const userId = req.params.userId
    const dishId = req.params.dishId

    const result = await favoriteService.deleteFromFavorites(userId, dishId)

    res.status(StatusCodes.OK).json({
      code: StatusCodes.OK,
      message: 'Favorite deleted successfully',
      data: result
    })
  } catch (error) {
    next(error)
  }
}

export const favoriteController = {
  addToFavorites,
  viewFavorites,
  deleteFromFavorites
}