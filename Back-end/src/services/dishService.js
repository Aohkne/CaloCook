import { dishModel } from '@/models/dishModel'
import { StatusCodes } from 'http-status-codes'
import ApiError from '@/utils/ApiError'

const getAll = async (sortBy, order) => {
  try {
    return await dishModel.getAll(sortBy, order)
  } catch (error) {
    throw error
  }
}

const searchByName = async (name, sortBy, order) => {
  try {
    const dish = await dishModel.searchByName(name, sortBy, order)
    if (!dish || dish.length === 0) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Dish not found!')
    }
    return dish
  } catch (error) {
    throw error
  }
}

const searchByCookingTime = async (condition, sortBy, order) => {
  try {
    if (condition.$gte !== undefined && condition.$lte !== undefined) {
      if (condition.$gte > condition.$lte) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Min Cooking Time must be less than or equal to Max Cooking Time')
      }
    }

    const dish = await dishModel.searchByCookingTime(condition, sortBy, order)

    if (!dish || dish.length === 0) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Dish not found!')
    }
    return dish
  } catch (error) {
    throw error
  }
}

const searchByCalorie = async (condition, sortBy, order) => {
  try {
    if (condition.$gte !== undefined && condition.$lte !== undefined) {
      if (condition.$gte > condition.$lte) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Min Calorie must be less than or equal to Max Calorie')
      }
    }

    const dish = await dishModel.searchByCalorie(condition, sortBy, order)

    if (!dish || dish.length === 0) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Dish not found!')
    }
    return dish
  } catch (error) {
    throw error
  }
}

const searchByDifficulty = async (difficulty, sortBy, order) => {
  try {
    let difficultyQuery

    if (!difficulty) {
      difficultyQuery = {}
    } else if (Array.isArray(difficulty)) {
      difficultyQuery = { $in: difficulty }
    } else if (typeof difficulty === 'string' && difficulty.includes(',')) {
      const difficultyArray = difficulty.split(',').map((d) => d.trim())
      difficultyQuery = { $in: difficultyArray }
    } else {
      difficultyQuery = { $regex: `^${difficulty}`, $options: 'i' }
    }

    const dish = await dishModel.searchByDifficulty(difficultyQuery, sortBy, order)
    if (!dish || dish.length === 0) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Dish not found!')
    }
    return dish
  } catch (error) {
    throw error
  }
}

const searchByIsActive = async (isActive, sortBy, order) => {
  try {
    if (!isActive) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Dish is required!')
    }
    const dish = await dishModel.searchByIsActive(isActive, sortBy, order)
    if (!dish || dish.length === 0) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Dish not found!')
    }
    return dish
  } catch (error) {
    throw error
  }
}

const activateDish = async (dishId) => {
  try {
    const dish = await dishModel.updateIsActive(dishId, true)
    if (!dish) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Dish not found!')
    }
    return dish
  } catch (error) {
    throw error
  }
}

const deactivateDish = async (dishId) => {
  try {
    const dish = await dishModel.updateIsActive(dishId, false)
    if (!dish) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Dish not found!')
    }
    return dish
  } catch (error) {
    throw error
  }
}

export const dishService = {
  getAll,
  searchByName,
  searchByCookingTime,
  searchByCalorie,
  searchByDifficulty,
  searchByIsActive,
  activateDish,
  deactivateDish
}
