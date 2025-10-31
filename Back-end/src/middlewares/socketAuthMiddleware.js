import jwt from 'jsonwebtoken'
import { env } from '@/config/environment'
import { GET_DB } from '@/config/mongodb'
import { ObjectId } from 'mongodb'

export const socketAuthMiddleware = async (socket, next) => {
  try {
    // Lấy token từ handshake auth hoặc query
    const token = socket.handshake.auth.token || socket.handshake.query.token

    if (!token) {
      return next(new Error('Authentication error: No token provided'))
    }

    // CHECK ACCESS TOKEN
    if (!env.ACCESS_TOKEN_SECRET) {
      console.error('ACCESS_TOKEN_SECRET is not defined in environment')
      return next(new Error('Authentication error: Server configuration error'))
    }

    // Verify token
    const decoded = jwt.verify(token, env.ACCESS_TOKEN_SECRET)

    // Lấy user info từ database
    const user = await GET_DB()
      .collection('user')
      .findOne({ _id: new ObjectId(decoded.userId) }, { projection: { password: 0 } })

    if (!user) {
      return next(new Error('Authentication error: User not found'))
    }

    // Attach user to socket
    socket.user = user

    next()
  } catch (error) {
    console.error('Socket auth error:', error.message)
    next(new Error('Authentication error: Invalid token'))
  }
}
