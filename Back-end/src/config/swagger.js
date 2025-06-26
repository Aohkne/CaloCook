import { env } from '@/config/environment'

export const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API',
      version: '1.0.0',
      description: 'Management'
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    servers: [
      {
        url: `http://localhost:${env.PORT || 8080}`,
        description: 'Development server'
      }
    ]
  },
  apis: ['./src/routes/v1/*.js']
}
