import { userModel } from '@/models/userModel'
import { StatusCodes } from 'http-status-codes'
import ApiError from '@/utils/ApiError'
import { ObjectId } from 'mongodb'
import cloudinary from '@/config/cloudinary.js'
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

//lay so luong có role bang user
const getUserCount = async () => {
  try {
    const count = await userModel.countUsers('user')
    return count
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Error fetching user count')
  }
}

const getUserProfile = async (userId) => {
  const user = await userModel.findById(userId)
  if (!user) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'User not found')
  }

  return {
    _id: user._id,
    username: user.username,
    email: user.email,
    role: user.role,
    calorieLimit: user.calorieLimit,
    avatarUrl: user.avatarUrl,
    gender: user.gender,
    dob: user.dob,
    height: user.height,
    weight: user.weight,
    createdAt: user.created_at,
    isActive: user.is_active
  }
}
const editProfileService = async (userId, profileData) => {
  if (profileData.avatarUrl) {
    cloudinaryResponse = await cloudinary.uploader.upload(profileData.avatarUrl, {
      folder: 'avatars'
    })
  }
  const result = await userModel.updateOne(
    { _id: new ObjectId(userId) },
    {
      $set: {
        username: profileData.username,
        email: profileData.email,
        calorieLimit: profileData.calorieLimit,
        avatarUrl: cloudinaryResponse?.secure_url ? cloudinaryResponse.secure_url : '',
        gender: profileData.gender,
        dob: profileData.dob,
        height: profileData.height,
        weight: profileData.weight,
        updatedAt: new Date()
      }
    }
  )

  if (result.modifiedCount === 0) throw new ApiError(StatusCodes.NOT_FOUND, 'User not found or no changes made')
  return true
}
export const userService = {
  getAll,
  searchByUsername,
  searchByEmail,
  searchByIsActive,
  getDetails,
  activateUser,
  deactivateUser,
  getUserProfile,
  getUserCount,
  editProfileService
}
