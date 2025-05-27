import expesss from 'express'

import { authController } from '@/controllers/authController'
const Router = expesss.Router()

Router.post('/login', authController.login)
Router.post('/signup', authController.signup)
Router.post('/refresh-token', authController.refreshToken)
Router.post('/logout', authController.logout)
Router.post('/forgot-password', authController.forgotPassword)
Router.post('/forgot-password/:token', authController.resetPassword)

export const authRoute = Router
