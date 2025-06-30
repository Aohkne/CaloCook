import jwt from 'jsonwebtoken'
import { userModel as User } from '@/models/userModel'
import { StatusCodes } from 'http-status-codes'
import { env } from '@/config/environment'

const authenticateUser = async (req, res, next) => {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: 'Unauthorized: Authorization header missing or malformed' })
  }
  const token = authHeader.split(' ')[1]
  try {
    const decoded = jwt.verify(token, env.ACCESS_TOKEN_SECRET)
    const userId = decoded.userId

    if (!userId) {
      return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Unauthorized: Invalid token or user not found' })
    }

    const user = await User.findById(userId)
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: 'User not found' })
    }
    delete user.password_hash
    req.user = user
    next()
  } catch (err) {
    console.error('JWT verify error:', err)
    return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Unauthorized: Invalid token' })
  }
}

const authorizeRole = (roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(StatusCodes.FORBIDDEN).json({ message: 'Forbidden: Insufficient permissions' })
    }
    next()
  }
}
export const authMiddleware = {
  authenticateUser,
  authorizeRole
}
