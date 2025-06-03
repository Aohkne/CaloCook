import { userModel } from '@/models/userModel'
import { StatusCodes } from 'http-status-codes'
import ApiError from '@/utils/ApiError'

const getAll = async (sortBy, order) => {
  try {
    return await userModel.getAll(sortBy, order)
  } catch (error) {
    throw error
  }
}

const searchByUsername = async (username, sortBy, order) => {
  try {
    const user = await userModel.searchByUsername(username, sortBy, order)
    if (!user || user.length === 0) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'User not found!')
    }
    return user
  } catch (error) {
    throw error
  }
}

const searchByEmail = async (email, sortBy, order) => {
  try {
    const user = await userModel.searchByEmail(email, sortBy, order)
    if (!user || user.length === 0) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'User not found!')
    }
    return user
  } catch (error) {
    throw error
  }
}

const searchByIsActive = async (isActive, sortBy, order) => {
  try {
    const user = await userModel.searchByIsActive(isActive, sortBy, order)
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
  deactivateUser
}
