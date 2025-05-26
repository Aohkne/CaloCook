import jwt from 'jsonwebtoken'
import { redis } from '@/config/redis.js'
import { userModel as User } from '@/models/userModel.js'
import bcrypt from 'bcryptjs'

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
  const { name, email, password } = req.body

  try {
    // console.log('Signup request:', { name, email, password })
    if (!email || !password || !name) {
      return res.status(400).json({ message: 'Missing required fields' })
    }
    // Kiểm tra tồn tại
    const userExists = await User.findOne({ email })
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Tạo user mới
    const user = await User.create({
      name,
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
      name: user.name,
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
    const { email, password } = req.body
    // console.log('Login request:', { email, password })

    const user = await User.findOne({ email })
    // console.log('User:', user)

    const isMatch = await bcrypt.compare(password, user.password_hash)
    // console.log('Password match:', isMatch)

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' })
    }
    const { accessToken, refreshToken } = generateTokens(user._id)
    // console.log('Generated tokens:', { accessToken, refreshToken })
    await storeRefreshToken(user._id, refreshToken)

    res.json({
      _id: user._id,
      name: user.name,
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

export const authController = {
  login,
  refreshToken,
  logout,
  signup
}
