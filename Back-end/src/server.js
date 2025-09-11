/* eslint-disable no-console*/

import express from 'express'
import cors from 'cors'
import exitHook from 'async-exit-hook'
import { createServer } from 'http'

import swaggerJSDoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'
import { swaggerOptions } from '@/config/swagger'

import { initSocketIO } from '@/config/socket'
import { CONNECT_DB, CLOSE_DB } from '@/config/mongodb'
import { env } from '@/config/environment'

import { socketAuthMiddleware } from '@/middlewares/socketAuthMiddleware'
import { errorHandlingMiddleware } from '@/middlewares/errorHandlingMiddleware'
import { APIs_V1 } from '@/routes/v1'

const START_SERVER = () => {
  const app = express()
  const server = createServer(app)
  const swaggerSpec = swaggerJSDoc(swaggerOptions)

  // Socket.IO
  const io = initSocketIO(server)

  // Middleware -  Socket.IO
  io.use(socketAuthMiddleware)

  // CORS
  app.use(cors())

  // Enable req.body json data
  app.use(express.json({ limit: '10mb' }))

  // API V1
  app.use('/api/v1', APIs_V1)

  // Swagger
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

  // Socket.IO status endpoint
  app.get('/socket-status', (req, res) => {
    res.json({
      status: 'Socket.IO is running',
      connectedClients: io.engine.clientsCount,
      timestamp: new Date()
    })
  })

  // Middleware - xử lý lỗi tập trung
  app.use(errorHandlingMiddleware)

  if (env.NODE_ENV === 'production') {
    // PRODUCTION
    const port = process.env.PORT || env.PORT || 8080
    app.listen(port, () => {
      console.log(`Hello ${env.AUTHOR}, Server is running at: https://calocook.onrender.com`)
      console.log(`Swagger is running at https://calocook.onrender.com/api-docs`)
      console.log(`Socket status at https://calocook.onrender.com/socket-status`)
    })
  } else {
    // LOCAL
    app.listen(env.PORT, env.HOST, () => {
      console.log(`Hello ${env.AUTHOR}, Server is running at http://${env.DISPLAY_HOST}:${env.PORT}/`)
      console.log(`Swagger is running at http://${env.DISPLAY_HOST}:${env.PORT}/api-docs`)
      console.log(`Socket status at http://${env.DISPLAY_HOST}:${env.PORT}/socket-status`)
    })
  }

  // CLEAN UP
  exitHook(() => {
    console.log('Server is shutting down...')
    CLOSE_DB()
    console.log('Disconnected from MONGODB')
  })
}

;(async () => {
  try {
    console.log('Connecting to MONGODB...')
    await CONNECT_DB()

    console.log('Connected to MONGODB')

    START_SERVER()
  } catch (error) {
    console.error(error)
    process.exit(0)
  }
})()
