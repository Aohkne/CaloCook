import jwt from 'jsonwebtoken'
import { userModel as User } from '@/models/userModel'
import { env } from '@/config/environment'

export const authenticateUser = async (req, res, next) => {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authorization header missing or malformed' })
  }
  const token = authHeader.split(' ')[1]
  try {
    const decoded = jwt.verify(token, env.ACCESS_TOKEN_SECRET)
    const userId = decoded.userId
    // console.log('userId:', userId, typeof userId)
    if (!userId) {
      return res.status(401).json({ message: 'Invalid token payload' })
    }
    const user = await User.findById(userId)
    // console.log('user:', user)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    delete user.password_hash // hoặc password_hash nếu cần
    req.user = user
    next()
  } catch (err) {
    console.error('JWT verify error:', err)
    return res.status(401).json({ message: 'Invalid or expired token' })
  }
}

export const authorizeRole = (roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden: Insufficient permissions' })
    }
    next()
  }
}
