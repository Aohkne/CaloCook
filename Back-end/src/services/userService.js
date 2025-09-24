import { userModel } from '@/models/userModel'
import { emailServiceModel } from '@/models/emailServiceModel'
import { StatusCodes } from 'http-status-codes'
import ApiError from '@/utils/ApiError'
import { ObjectId } from 'mongodb'
import cloudinary from '@/config/cloudinary.js'
import sendEmail from '@/utils/sendEmail.js'
import crypto from 'crypto'
import { redis } from '@/config/redis.js'

const getAll = async (paginationParams) => {
  try {
    return await userModel.getAll(paginationParams)
  } catch (error) {
    throw error
  }
}
const getAllUsers = async (paginationParams) => {
  try {
    return await userModel.getAllUsers(paginationParams)
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

const getUserProfile = async (user) => {
  if (!user) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'User not found')
  }
  const emailService = await emailServiceModel.getByUserId(user._id)

  return {
    _id: user._id,
    username: user.username,
    email: user.email,
    role: user.role,
    calorieLimit: user.calorieLimit,
    avatar_url: user.avatar_url,
    gender: user.gender,
    dob: user.dob,
    height: user.height,
    weight: user.weight,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    isActive: user.isActive,
    emailVerified: emailService ? emailService.emailVerified : false,
    dateVerified: emailService ? emailService.updatedAt : null
  }
}
const editProfileService = async (userId, profileData) => {
  let cloudinaryResponse = null
  if (profileData.avatar_url) {
    cloudinaryResponse = await cloudinary.uploader.upload(profileData.avatar_url, {
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
        avatar_url: cloudinaryResponse?.secure_url ? cloudinaryResponse.secure_url : '',
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
const emailVerification = async (user) => {
  try {
    // tạo raw token
    const rawToken = crypto.randomBytes(32).toString('hex')

    // lưu raw token vào Redis dưới key mà verifyEmail hiện lookup (reset_token:<token>) — TTL 30 phút
    await redis.set(`reset_token:${rawToken}`, user._id.toString(), 'EX', 30 * 60)

    // build URL đúng format (token param, optional email)
    const verifyURL = `http://localhost:5173/verify-email?token=${rawToken}`

    const message = `
      <p>Click vào liên kết sau để xác thực email (hợp lệ 30 phút):</p>
      <a href="${verifyURL}" target="_blank" style="color: blue;">${verifyURL}</a>
    `
    await sendEmail(user.email, 'Verify your CaloCook email', message)

    return { message: 'Verification email sent' }
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Error sending verification email')
  }
}
const verifyEmail = async (token) => {
  try {
    if (!token) throw new ApiError(StatusCodes.BAD_REQUEST, 'Token is required')

    // tìm userId từ token
    const userId = await redis.get(`reset_token:${token}`)
    if (!userId) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Invalid or expired token' })
    }
    await emailServiceModel.createEmailService({
      userId: new ObjectId(userId),
      emailVerified: true,
      createdAt: new Date(),
      updatedAt: new Date()
    })
    await redis.del(`reset_token:${token}`)

    return { message: 'Email verified' }
  } catch (error) {
    console.log(error)
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Error verifying email')
  }
}

export const userService = {
  getAll,
  getAllUsers,
  searchByUsername,
  searchByEmail,
  searchByIsActive,
  emailVerification,
  getDetails,
  activateUser,
  deactivateUser,
  getUserProfile,
  getUserCount,
  editProfileService,
  verifyEmail
}
