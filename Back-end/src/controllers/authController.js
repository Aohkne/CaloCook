import jwt from 'jsonwebtoken'
import { redis } from '@/config/redis.js'
import { ObjectId } from 'mongodb'
import { userModel as User } from '@/models/userModel.js'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import sendEmail from '@/utils/sendEmail.js'

// 1. Tạo access và refresh token
const generateTokens = (userId) => {
  const accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: '30m'
  })

  const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: '365d'
  })

  return { accessToken, refreshToken }
}

// 2. Lưu refresh token vào Redis với thời hạn 365 ngày
const storeRefreshToken = async (userId, refreshToken) => {
  const key = `refresh_token:${userId}`
  const expiresInSeconds = 365 * 24 * 60 * 60
  await redis.set(key, refreshToken, 'EX', expiresInSeconds)
}
const signup = async (req, res) => {
  const { username, email, password } = req.body

  try {
    // console.log('Signup request:', { name, email, password })
    if (!email || !password || !username) {
      return res.status(400).json({ message: 'Missing required fields' })
    }
    // Kiểm tra tồn tại
    const existingEmail = await User.findOne({ email })
    if (existingEmail) {
      return res.status(400).json({ message: 'Email was exists' })
    }

    const existingUsername = await User.findOne({ username })
    if (existingUsername) {
      return res.status(400).json({ message: 'Username was exists' })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Tạo user mới
    const user = await User.create({
      username,
      email,
      password_hash: hashedPassword,
      role: 'user', // default role
      calorie_limit: 2000,
      is_active: true,
      created_at: new Date(),
      updated_at: new Date()
    })

    // Tạo tokens
    const { accessToken, refreshToken } = generateTokens(user._id)

    // Lưu refresh token vào Redis
    await storeRefreshToken(user._id, refreshToken)

    // Trả về JSON response (không set cookie)
    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role
    })
  } catch (error) {
    console.error('Error in signup controller', error.message)
    res.status(500).json({ message: error.message })
  }
}
// 3. Đăng nhập – trả JSON cho mobile
const login = async (req, res) => {
  try {
    const { emailOrUsername, password } = req.body
    // console.log('Login request:', { email, password })

    const user = await User.findOne({
      $or: [{ email: emailOrUsername }, { username: emailOrUsername }]
    })

    if (!user) {
      return res.status(400).json({ message: 'Invalid email/username or password' })
    }

    const isMatch = await bcrypt.compare(password, user.password_hash)
    // console.log('Password match:', isMatch)

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email/username or password' })
    }
    const { accessToken, refreshToken } = generateTokens(user._id)
    // console.log('Generated tokens:', { accessToken, refreshToken })
    await storeRefreshToken(user._id, refreshToken)

    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      accessToken,
      refreshToken // Trả về refresh token cho mobile khi login thanh cong
    })
  } catch (error) {
    console.error('Login error:', error.message)
    res.status(500).json({ message: 'Internal server error' })
  }
}

// 4. Làm mới access token – dành cho mobile
const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body
    // console.log('Refresh token request:', { refreshToken })
    if (!refreshToken) {
      return res.status(401).json({ message: 'No refresh token provided' })
    }

    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)
    const storedToken = await redis.get(`refresh_token:${decoded.userId}`)

    if (!storedToken || storedToken !== refreshToken) {
      return res.status(403).json({ message: 'Invalid or expired refresh token' })
    }

    const newAccessToken = jwt.sign({ userId: decoded.userId }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: '30m'
    })

    res.json({ accessToken: newAccessToken })
  } catch (error) {
    console.error('Refresh token error:', error.message)
    res.status(403).json({ message: 'Invalid or expired refresh token' })
  }
}

// 5. Logout – xóa refresh token khỏi Redis
const logout = async (req, res) => {
  console.log('req.body:', req.body)
  console.log('req.headers:', req.headers)

  try {
    // Cố gắng lấy token từ body hoặc header
    const refreshToken = req.body.refreshToken

    // console.log('Refresh token request:', { refreshToken })
    if (!refreshToken) return res.status(400).json({ message: 'No refresh token provided' })

    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)
    await redis.del(`refresh_token:${decoded.userId}`)

    res.json({ message: 'Logged out successfully' })
  } catch (error) {
    console.error('Logout error:', error.message)
    res.status(500).json({ message: 'Logout failed', error: error.message })
  }
}

// 6. Forgot password - not implemented yet
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body
    // debug email
    console.log(email)
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    // Tạo token và hash
    const rawToken = crypto.randomBytes(32).toString('hex')
    const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex')
    const expire = Date.now() + 30 * 60 * 1000 // 30 phút

    // Lưu vào Redis: key = hashedToken, value = userId (hoặc email)
    await redis.set(`reset_token:${hashedToken}`, user._id.toString(), 'EX', 30 * 60) // 30 phút

    const resetURL = `http://localhost:5173/forgotPassword/${rawToken}`
    const message = `
			 <p>Click vào liên kết sau để đặt lại mật khẩu:</p>
  				<a href="${resetURL}" target="_blank" style="color: blue;">${resetURL}
 				 </a>`

    await sendEmail(user.email, 'Reset Password', message)

    res.json({ message: 'Email đặt lại mật khẩu đã được gửi' })
  } catch (err) {
    console.error('forgotPassword error:', err)
    res.status(500).json({ message: 'Server error', error: err.message })
  }
}
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params
    const { password } = req.body
    // debug token
    // console.log('token', token)
    // debug password
    // console.log('password', password)
    if (!token || !password) {
      return res.status(400).json({ message: 'Token và mật khẩu là bắt buộc' })
    }

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex')

    // debug hashedToken
    // console.log('hashedToken', hashedToken)

    const userId = await redis.get(`reset_token:${hashedToken}`)

    if (!userId) {
      return res.status(400).json({ message: 'Token không hợp lệ hoặc đã hết hạn' })
    }
    // ✅ Tìm user theo userId lấy từ Redis
    const user = await User.findById(userId)

    const hashedPassword = await bcrypt.hash(password, 10)
    await User.updateOne(
      { _id: new ObjectId(userId) },
      { $set: { password_hash: hashedPassword, updated_at: new Date() } }
    )

    // 🧹 Xóa token khỏi Redis
    await redis.del(`reset_token:${hashedToken}`)

    const { accessToken, refreshToken } = generateTokens(user._id)
    await storeRefreshToken(user._id, refreshToken)

    res.status(200).json({
      message: 'Đặt lại mật khẩu thành công',
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    })
  } catch (error) {
    console.error('resetPassword error:', error.message)
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

export const authController = {
  login,
  refreshToken,
  logout,
  signup,
  forgotPassword,
  resetPassword
}
