import { dishModel } from '@/models/dishModel'
import { StatusCodes } from 'http-status-codes'
import ApiError from '@/utils/ApiError'

const getAll = async (paginationParams) => {
  try {
    const result = await dishModel.getAll(paginationParams)

    return result
  } catch (error) {
    throw error
  }
}

const searchByName = async (name, paginationParams) => {
  try {
    const result = await dishModel.searchByName(name, paginationParams)
    if (!result.data || result.data.length === 0) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Dish not found!')
    }
    return result
  } catch (error) {
    throw error
  }
}

const searchByCookingTime = async (condition, paginationParams) => {
  try {
    if (condition.$gte !== undefined && condition.$lte !== undefined) {
      if (condition.$gte > condition.$lte) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Min Cooking Time must be less than or equal to Max Cooking Time')
      }
    }

    const result = await dishModel.searchByCookingTime(condition, paginationParams)

    if (!result.data || result.data.length === 0) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Dish not found!')
    }
    return result
  } catch (error) {
    throw error
  }
}

const searchByCalorie = async (condition, paginationParams) => {
  try {
    if (condition.$gte !== undefined && condition.$lte !== undefined) {
      if (condition.$gte > condition.$lte) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Min Calorie must be less than or equal to Max Calorie')
      }
    }

    const result = await dishModel.searchByCalorie(condition, paginationParams)

    if (!result.data || result.data.length === 0) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Dish not found!')
    }
    return result
  } catch (error) {
    throw error
  }
}

const searchByDifficulty = async (difficulty, paginationParams) => {
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

    const result = await dishModel.searchByDifficulty(difficultyQuery, paginationParams)
    if (!result.data || result.data.length === 0) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Dish not found!')
    }
    return result
  } catch (error) {
    throw error
  }
}

const searchByIsActive = async (isActive, paginationParams) => {
  try {
    if (!isActive) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'isActive is required!')
    }
    const result = await dishModel.searchByIsActive(isActive, paginationParams)
    if (!result.data || result.data.length === 0) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Dish not found!')
    }
    return result
  } catch (error) {
    throw error
  }
}

const getDetails = async (dishId) => {
  try {
    const dish = await dishModel.getDetails(dishId)

    if (!dish || dish.length === 0) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Dish not found!')
    }

    return dish
  } catch (error) {
    throw error
  }
}

const createNew = async (reqBody) => {
  try {
    const newDish = {
      ...reqBody,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const createdDish = await dishModel.createNew(newDish)

    const getNewDish = await dishModel.getDetails(createdDish.insertedId)

    return getNewDish
  } catch (error) {
    throw error
  }
}

const updateDish = async (dishId, updateData) => {
  try {
    const dataToUpdate = {
      ...updateData,
      updatedAt: new Date()
    }

    const updatedDish = await dishModel.updateDish(dishId, dataToUpdate)

    if (!updatedDish) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Dish not found!')
    }

    return updatedDish
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

// lay so luong dish

const getDishCount = async () => {
  try {
    const count = await dishModel.countDish()
    return count
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Error fetching user count')
  }
}

export const dishService = {
  getAll,
  searchByName,
  searchByCookingTime,
  searchByCalorie,
  searchByDifficulty,
  searchByIsActive,
  getDetails,
  createNew,
  updateDish,
  activateDish,
  deactivateDish,
  getDishCount
}
