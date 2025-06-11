import { userModel } from '@/models/userModel'
import { StatusCodes } from 'http-status-codes'
import ApiError from '@/utils/ApiError'
const getAll = async (paginationParams) => {
  try {
    return await userModel.getAll(paginationParams)
  } catch (error) {
    throw error
  }
}

const searchByUsername = async (username, paginationParams) => {
  try {
    const user = await userModel.searchByUsername(username, paginationParams)
    if (!user || user.length === 0) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'User not found!')
    }
    return user
  } catch (error) {
    throw error
  }
}

const searchByEmail = async (email, paginationParams) => {
  try {
    const user = await userModel.searchByEmail(email, paginationParams)
    if (!user || user.length === 0) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'User not found!')
    }
    return user
  } catch (error) {
    throw error
  }
}

const searchByIsActive = async (isActive, paginationParams) => {
  try {
    const user = await userModel.searchByIsActive(isActive, paginationParams)
    if (!user || user.length === 0) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'User not found!')
    }
    return user
  } catch (error) {
    throw error
  }
}

const getDetails = async (userId) => {
  try {
    const user = await userModel.getDetails(userId)

    if (!user || user.length === 0) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'User not found!')
    }

    return user
  } catch (error) {
    throw error
  }
}

const activateUser = async (userId) => {
  try {
    const user = await userModel.updateIsActive(userId, true)
    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'User not found!')
    }
    return user
  } catch (error) {
    throw error
  }
}

const deactivateUser = async (userId) => {
  try {
    const user = await userModel.updateIsActive(userId, false)
    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'User not found!')
    }
    return user
  } catch (error) {
    throw error
  }
}

export const userService = {
  getAll,
  searchByUsername,
  searchByEmail,
  searchByIsActive,
  getDetails,
  activateUser,
  deactivateUser,
  
}
