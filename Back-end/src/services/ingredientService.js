import { ingredientModel } from '@/models/ingredientModel'
import { StatusCodes } from 'http-status-codes'
import ApiError from '@/utils/ApiError'

const getAll = async (sortBy, order) => {
  try {
    return await ingredientModel.getAll(sortBy, order)
  } catch (error) {
    throw error
  }
}

const searchByName = async (name, sortBy, order) => {
  try {
    const ingredient = await ingredientModel.searchByName(name, sortBy, order)
    if (!ingredient || ingredient.length === 0) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Ingredient not found!')
    }
    return ingredient
  } catch (error) {
    throw error
  }
}

const searchByIsActive = async (isActive, sortBy, order) => {
  try {
    if (!isActive) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Ingredient is required!')
    }
    const ingredient = await ingredientModel.searchByIsActive(isActive, sortBy, order)
    if (!ingredient || ingredient.length === 0) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Ingredient not found!')
    }
    return ingredient
  } catch (error) {
    throw error
  }
}

const getDetails = async (ingredientId) => {
  try {
    const ingredient = await ingredientModel.getDetails(ingredientId)

    if (!ingredient || ingredient.length === 0) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Ingredient not found!')
    }

    return ingredient
  } catch (error) {
    throw error
  }
}

const getDetailsByDishId = async (dishId) => {
  try {
    const ingredient = await ingredientModel.getDetailsByDishId(dishId)

    if (!ingredient || ingredient.length === 0) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Ingredient not found!')
    }

    return ingredient
  } catch (error) {
    throw error
  }
}

const createNew = async (reqBody) => {
  try {
    const dishId = await ingredientModel.getDetailsByDishId(reqBody.dishId)

    if (!dishId) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Dish not found!')
    }

    const newIngredient = {
      ...reqBody,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const createdIngredient = await ingredientModel.createNew(newIngredient)

    const getNewIngredient = await ingredientModel.getDetails(createdIngredient.insertedId)

    return getNewIngredient
  } catch (error) {
    throw error
  }
}

const updateIngredient = async (ingredientId, updateData) => {
  try {
    const dataToUpdate = {
      ...updateData,
      updatedAt: new Date()
    }

    const updatedIngredient = await ingredientModel.updateIngredient(ingredientId, dataToUpdate)

    if (!updatedIngredient) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Ingredient not found!')
    }

    return updatedIngredient
  } catch (error) {
    throw error
  }
}

const activateIngredient = async (ingredientId) => {
  try {
    const ingredient = await ingredientModel.updateIsActive(ingredientId, true)
    if (!ingredient) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Ingredient not found!')
    }
    return ingredient
  } catch (error) {
    throw error
  }
}

const deactivateIngredient = async (ingredientId) => {
  try {
    const ingredient = await ingredientModel.updateIsActive(ingredientId, false)
    if (!ingredient) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Ingredient not found!')
    }
    return ingredient
  } catch (error) {
    throw error
  }
}

export const ingredientService = {
  getAll,
  searchByName,
  searchByIsActive,
  getDetails,
  getDetailsByDishId,
  createNew,
  updateIngredient,
  activateIngredient,
  deactivateIngredient
}
