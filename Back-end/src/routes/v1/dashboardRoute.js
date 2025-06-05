import expesss from 'express'

import { userController } from '@/controllers/userController'
import { dishController } from '@/controllers/dishController'
const Router = expesss.Router()

Router.route('/user-count').get(userController.getUserCount)
Router.route('/dish-count').get(dishController.getDishCount)

export const dashboardRoute = Router
