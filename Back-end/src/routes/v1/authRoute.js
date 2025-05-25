import expesss from 'express'

import { authController } from '@/controllers/authController'
const Router = expesss.Router()

Router.post('/login', authController.login)
Router.post('/signup', authController.signup)

export const authRoute = Router
