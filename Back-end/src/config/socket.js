import { env } from '@/config/environment'
import { Server } from 'socket.io'

let io = null

const initSocketIO = (server) => {
  io = new Server(server, {
    cors: {
      origin:
        env.NODE_ENV === 'production'
          ? ['https://calo-cook.vercel.app']
          : ['http://localhost:3000', 'http://localhost:5173'],
      methods: ['GET', 'POST'],
      credentials: true
    },
    transports: ['websocket', 'polling'],
    pingTimeout: 60000,
    pingInterval: 25000
  })

  return io
}

const getIO = () => {
  if (!io) {
    throw new Error('Socket.IO not initialized!')
  }
  return io
}

export { initSocketIO, getIO }
