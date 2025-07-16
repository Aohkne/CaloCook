/* eslint-disable no-console*/

import express from 'express'
import cors from 'cors'
import exitHook from 'async-exit-hook'

import swaggerJSDoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'
import { swaggerOptions } from '@/config/swagger'

import { CONNECT_DB, CLOSE_DB } from '@/config/mongodb'
import { env } from '@/config/environment'

import { APIs_V1 } from '@/routes/v1'
import { errorHandlingMiddleware } from '@/middlewares/errorHandlingMiddleware'

const START_SERVER = () => {
  const app = express()
  const swaggerSpec = swaggerJSDoc(swaggerOptions)

  // CORS
  app.use(
    cors({
      origin: ['https://calocook.onrender.com', 'http://localhost:8080', 'http://localhost:5173'],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization']
    })
  )

  // Enable req.body json data
  app.use(express.json({ limit: '10mb' }))

  // API V1
  app.use('/api/v1', APIs_V1)

  // Swagger
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

  // Middleware - xử lý lỗi tập trung
  app.use(errorHandlingMiddleware)

  console.log('NODE_ENV:', env.NODE_ENV)

  if (env.NODE_ENV === 'production') {
    // PRODUCTION
    const port = process.env.PORT || env.PORT || 8080
    app.listen(port, () => {
      console.log(`Hello ${env.AUTHOR}, Server is running at: https://calocook.onrender.com`)
      console.log(`Swagger is running at https://calocook.onrender.com/api-docs`)
    })
  } else {
    // LOCAL
    app.listen(env.PORT, env.HOST, () => {
      console.log(`Hello ${env.AUTHOR}, Server is running at http://${env.DISPLAY_HOST}:${env.PORT}/`)
      console.log(`Swagger is running at http://${env.DISPLAY_HOST}:${env.PORT}/api-docs`)
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
