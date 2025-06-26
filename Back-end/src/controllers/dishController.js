import { StatusCodes } from 'http-status-codes'
import { dishService } from '@/services/dishService'
import { paginationHelper } from '@/utils/pagination'

const getAll = async (req, res, next) => {
  try {
    const { name, minCookingTime, maxCookingTime, minCalorie, maxCalorie, difficulty, isActive } = req.query

    const paginationParams = req.pagination

    // NAVIGATION TO SERVICE
    let result
    if (name) {
      result = await dishService.searchByName(name, paginationParams)
    } else if (minCookingTime || maxCookingTime) {
      const condition = {}
      if (minCookingTime) condition.$gte = parseInt(minCookingTime)
      if (maxCookingTime) condition.$lte = parseInt(maxCookingTime)

      result = await dishService.searchByCookingTime(condition, paginationParams)
    } else if (minCalorie || maxCalorie) {
      const condition = {}
      if (minCalorie) condition.$gte = parseInt(minCalorie)
      if (maxCalorie) condition.$lte = parseInt(maxCalorie)

      result = await dishService.searchByCalorie(condition, paginationParams)
    } else if (difficulty) {
      result = await dishService.searchByDifficulty(difficulty, paginationParams)
    } else if (isActive) {
      result = await dishService.searchByIsActive(isActive, paginationParams)
    } else {
      result = await dishService.getAll(paginationParams)
    }

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

const getDetails = async (req, res, next) => {
  try {
    const dishId = req.params.id

    const dish = await dishService.getDetails(dishId)

    res.status(StatusCodes.OK).json({
      code: StatusCodes.OK,
      message: 'Get successfull',
      data: dish
    })
  } catch (error) {
    next(error)
  }
}

const getRandomUnfavoritedDishes = async (req, res, next) => {
  try {
    const { id } = req.params
    const { limit } = req.query

    const dish = await dishService.getRandomUnfavoritedDishes(id, limit)

    res.status(StatusCodes.OK).json({
      code: StatusCodes.OK,
      message: 'Get successfull',
      data: dish
    })
  } catch (error) {
    next(error)
  }
}

const createNew = async (req, res, next) => {
  try {
    const createdDish = await dishService.createNew(req.body)

    res.status(StatusCodes.CREATED).json({
      code: StatusCodes.CREATED,
      message: 'Create successfull',
      data: createdDish
    })
  } catch (error) {
    next(error)
  }
}

const updateDish = async (req, res, next) => {
  try {
    const dishId = req.params.id
    const updateData = req.body

    const updatedDish = await dishService.updateDish(dishId, updateData)

    res.status(StatusCodes.OK).json({
      code: StatusCodes.OK,
      message: 'Update successful',
      data: updatedDish
    })
  } catch (error) {
    next(error)
  }
}

const activateDish = async (req, res, next) => {
  try {
    const dishId = req.params.id

    const updatedDish = await dishService.activateDish(dishId)

    res.status(StatusCodes.OK).json({
      code: StatusCodes.OK,
      message: 'Dish activated successfully',
      data: updatedDish
    })
  } catch (error) {
    next(error)
  }
}

const deactivateDish = async (req, res, next) => {
  try {
    const dishId = req.params.id

    const updatedDish = await dishService.deactivateDish(dishId)

    res.status(StatusCodes.OK).json({
      code: StatusCodes.OK,
      message: 'Dish deactivated successfully',
      data: updatedDish
    })
  } catch (error) {
    next(error)
  }
}

// lay so luong dish
const getDishCount = async (req, res, next) => {
  try {
    const dishCount = await dishService.getDishCount()

    res.status(StatusCodes.OK).json({
      code: StatusCodes.OK,
      message: 'Dish count retrieved successfully',
      data: dishCount
    })
  } catch (error) {
    next(error)
  }
}

export const dishController = {
  getAll,
  getDetails,
  getRandomUnfavoritedDishes,
  createNew,
  updateDish,
  activateDish,
  deactivateDish,
  getDishCount
}
