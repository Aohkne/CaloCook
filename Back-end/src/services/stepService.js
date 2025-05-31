import { StatusCodes } from 'http-status-codes'
import ApiError from '@/utils/ApiError'

import { stepModel } from '@/models/stepModel'
import { dishModel } from '@/models/dishModel'
import { ObjectId } from 'mongodb'

const getAll = async (sortBy, order) => {
  try {
    return await stepModel.getAll(sortBy, order)
  } catch (error) {
    throw error
  }
}

const getDetails = async (stepId) => {
  try {
    const step = await stepModel.getDetails(stepId)

    if (!step || step.length === 0) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Step not found!')
    }

    return step
  } catch (error) {
    throw error
  }
}

const getDetailsByDishId = async (dishId, sortBy, order) => {
  try {
    const step = await stepModel.getDetailsByDishId(dishId, sortBy, order)

    if (!step || step.length === 0) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Step not found!')
    }

    return step
  } catch (error) {
    throw error
  }
}

const searchByIsActive = async (isActive, sortBy, order) => {
  try {
    if (!isActive) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'isActive is required!')
    }
    const step = await stepModel.searchByIsActive(isActive, sortBy, order)
    if (!step || step.length === 0) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Step not found!')
    }
    return step
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

    const newStep = {
      ...reqBody,
      dishId: new ObjectId(reqBody.dishId),
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const createdStep = await stepModel.createNew(newStep)

    const getNewStep = await stepModel.getDetails(createdStep.insertedId)

    return getNewStep
  } catch (error) {
    throw error
  }
}

const updateStep = async (stepId, updateData) => {
  try {
    const dataToUpdate = {
      ...updateData,
      dishId: new ObjectId(updateData.dishId),
      updatedAt: new Date()
    }

    const updatedStep = await stepModel.updateStep(stepId, dataToUpdate)

    if (!updatedStep) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Step not found!')
    }

    return updatedStep
  } catch (error) {
    throw error
  }
}

const activateStep = async (stepId) => {
  try {
    const step = await stepModel.updateIsActive(stepId, true)
    if (!step) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Step not found!')
    }
    return step
  } catch (error) {
    throw error
  }
}

const deactivateStep = async (stepId) => {
  try {
    const step = await stepModel.updateIsActive(stepId, false)
    if (!step) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Step not found!')
    }
    return step
  } catch (error) {
    throw error
  }
}

export const stepService = {
  getAll,
  searchByIsActive,
  getDetails,
  getDetailsByDishId,
  createNew,
  updateStep,
  activateStep,
  deactivateStep
}
