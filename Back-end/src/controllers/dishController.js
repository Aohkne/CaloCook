import { StatusCodes } from 'http-status-codes'
import { dishService } from '@/services/dishService'

const getAll = async (req, res, next) => {
  try {
    const { name, minCookingTime, maxCookingTime, minCalorie, maxCalorie, difficulty, isActive, sortBy, order } =
      req.query

    // NAVIGATION TO SERVICE

    let dish
    if (name) {
      dish = await dishService.searchByName(name, sortBy, order)
    } else if (minCookingTime || maxCookingTime) {
      const condition = {}
      if (minCookingTime) condition.$gte = parseInt(minCookingTime)
      if (maxCookingTime) condition.$lte = parseInt(maxCookingTime)

      dish = await dishService.searchByCookingTime(condition, sortBy, order)
    } else if (minCalorie || maxCalorie) {
      const condition = {}
      if (minCalorie) condition.$gte = parseInt(minCalorie)
      if (maxCalorie) condition.$lte = parseInt(maxCalorie)

      dish = await dishService.searchByCalorie(condition, sortBy, order)
    } else if (difficulty) {
      dish = await dishService.searchByDifficulty(difficulty, sortBy, order)
    } else if (isActive) {
      dish = await dishService.searchByIsActive(isActive, sortBy, order)
    } else {
      dish = await dishService.getAll(sortBy, order)
    }

    // RETURN CLIENT
    res.status(StatusCodes.OK).json({
      code: StatusCodes.OK,
      message: 'Get successfull',
      data: dish
    })
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

export const dishController = {
  getAll,
  getDetails,
  createNew,
  updateDish,
  activateDish,
  deactivateDish
}
