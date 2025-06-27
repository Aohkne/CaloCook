import { StatusCodes } from 'http-status-codes'
import { favoriteService } from '@/services/favoriteService'
import { paginationHelper } from '@/utils/pagination'
const addToFavorites = async (req, res, next) => {
  try {
    const userId = req.body.userId
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
    const { userId } = req.params
    const paginationParams = req.pagination
    console.log('Controller: viewFavorites', { userId, paginationParams })

    const result = await favoriteService.viewFavorites(userId, paginationParams)
    const response = paginationHelper.formatPaginatedResponse(
      'Get successful',
      result.totalCount,
      paginationParams,
      result.data
    )

    res.status(StatusCodes.OK).json(response)
  } catch (error) {
    next(error)
  }
}
const deleteFromFavorites = async (req, res, next) => {
  try {
    const userId = req.body.userId
    const dishId = req.body.dishId

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