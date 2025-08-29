import bcrypt from 'bcryptjs'
import { userModel as User } from '@/models/userModel.js'
import { ObjectId } from 'mongodb'
import { StatusCodes } from 'http-status-codes'
import ApiError from '@/utils/ApiError'
import sendEmail from '@/utils/sendEmail.js'
import { redis } from '@/config/redis.js'
import crypto from 'crypto'

// hardcoded OTP settings
const OTP_LENGTH = 6
const OTP_EXPIRATION_SECONDS = 5 * 60
const OTP_MAX_ATTEMPTS = 5

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

const forgotPasswordOtp = async (user) => {
  try {
    const otp = Math.floor(100000 + Math.random() * 900000).toString()

    // hash OTP before storing
    const hashedOtp = crypto.createHash('sha256').update(otp).digest('hex')

    // tạo tên key để lưu OTP đã hash vào Redis, key phân biệt theo user_id
    const { otpKey, attemptsKey } = otpKeysFor(user._id)

    // store hashed OTP and reset attempts counter with TTL
    await redis.set(otpKey, hashedOtp, 'EX', OTP_EXPIRATION_SECONDS) // lưu OTP đã hash vào Redis
    await redis.set(attemptsKey, 0, 'EX', OTP_EXPIRATION_SECONDS) // reset số lần nhập sai OTP

    // send OTP via email
    const subject = 'Mã OTP đặt lại mật khẩu'
    const html = `
      <p>Mã xác thực (OTP) của bạn: <strong style="font-size:20px;">${otp}</strong></p>
      <p>Mã có hiệu lực trong ${OTP_EXPIRATION_SECONDS / 60} phút.</p>
    `
    await sendEmail(user.email, subject, html)
    return { message: 'OTP sent' }
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Failed to generate OTP')
  }
}

const verifyOtpAndResetPassword = async (otp, email, newPassword) => {
  try {
    const user = (await User.findByEmail) ? await User.findByEmail(email) : await User.findOne({ email })
    if (!user) throw new ApiError(StatusCodes.NOT_FOUND, 'User not found')

    //tạo tên key để lưu OTP đã hash vào Redis, key phân biệt theo user_id
    const { otpKey, attemptsKey } = otpKeysFor(user._id)

    // Lấy giá trị OTP đã hash từ Redis
    const storedHashed = await redis.get(otpKey)
    if (!storedHashed) throw new ApiError(StatusCodes.BAD_REQUEST, 'OTP invalid or expired')

    const hashedInput = crypto.createHash('sha256').update(otp).digest('hex')
    if (hashedInput !== storedHashed) {
      const attempts = Number(await redis.incr(attemptsKey)) // tăng số lần nhập sai OTP
      // ensure attempts TTL present
      const ttl = await redis.ttl(attemptsKey)
      if (ttl === -1) await redis.expire(attemptsKey, OTP_EXPIRATION_SECONDS)

      // nếu số lần nhập sai OTP đã đạt giới hạn tối đa thì sẽ hủy OTP khỏi Redis
      if (attempts >= OTP_MAX_ATTEMPTS) {
        await redis.del(otpKey)
        await redis.del(attemptsKey)
        throw new ApiError(StatusCodes.TOO_MANY_REQUESTS, 'Too many attempts, OTP cancelled')
      }
      throw new ApiError(StatusCodes.BAD_REQUEST, 'OTP is incorrect')
    }

    // OTP correct -> update password
    const hashedPassword = await bcrypt.hash(newPassword, 10)
    await User.updateOne(
      { _id: new ObjectId(user._id) },
      { $set: { password_hash: hashedPassword, updatedAt: new Date() } }
    )

    // cleanup
    await redis.del(otpKey)
    await redis.del(attemptsKey)

    return { message: 'Password reset successful' }
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Failed to reset password')
  }
}

/**
 * Tạo tên key cho OTP và số lần nhập sai OTP
 * thao tác đọc/ghi cùng một bản ghi trong Redis mỗi lần use
 * @param {string} userId
 * @returns {{otpKey: string, attemptsKey: string}}
 */
const otpKeysFor = (userId) => ({
  otpKey: `otp:${userId}`,
  attemptsKey: `otp_attempts:${userId}`
})

export const authService = {
  changePasswordService,
  forgotPasswordOtp,
  verifyOtpAndResetPassword
}
