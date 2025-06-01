import { StatusCodes } from 'http-status-codes'
import ApiError from '@/utils/ApiError'

import { dishModel } from '@/models/dishModel'
import { ingredientModel } from '@/models/ingredientModel'
import { ObjectId } from 'mongodb'

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
      throw new ApiError(StatusCodes.BAD_REQUEST, 'isActive is required!')
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

const getDetailsByDishId = async (dishId, sortBy, order) => {
  try {
    const ingredient = await ingredientModel.getDetailsByDishId(dishId, sortBy, order)

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
    const dishId = await dishModel.getDetails(reqBody.dishId)

    if (!dishId) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Dish ID not found!')
    }

    const newIngredient = {
      ...reqBody,
      dishId: new ObjectId(reqBody.dishId),
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
    console.log(ingredientId)
    console.log(updateData)

    const dataToUpdate = {
      ...updateData,
      dishId: new ObjectId(updateData.dishId),
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
