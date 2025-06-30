import bcrypt from 'bcryptjs'
import { userModel as User } from '@/models/userModel.js'
import { ObjectId } from 'mongodb'
import { StatusCodes } from 'http-status-codes'
import ApiError from '@/utils/ApiError'

const changePasswordService = async (userId, oldPassword, newPassword) => {
  const user = await User.findById(userId)
  if (!user) throw new ApiError(StatusCodes.NOT_FOUND, 'User not found')

  const isMatch = await bcrypt.compare(oldPassword, user.password_hash)
  if (!isMatch) throw new Error('Old password is incorrect')

  if (oldPassword === newPassword)
    throw new ApiError(StatusCodes.BAD_REQUEST, 'New password must be different from old password')

  const hashedNewPassword = await bcrypt.hash(newPassword, 10)
  await User.updateOne(
    { _id: new ObjectId(userId) },
    { $set: { password_hash: hashedNewPassword, updatedAt: new Date() } }
  )
  return true
}
export const authService = {
  changePasswordService
}
