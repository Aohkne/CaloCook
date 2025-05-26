import expesss from 'express'

import { authController } from '@/controllers/authController'
const Router = expesss.Router()

Router.post('/login', authController.login)
Router.post('/signup', authController.signup)
Router.post('/refresh-token', authController.refreshToken)
Router.post('/logout', authController.logout)

export const authRoute = Router
