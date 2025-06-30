import expesss from 'express'

import { authMiddleware } from '@/middlewares/authMiddleware'

import { userController } from '@/controllers/userController'
import { dishController } from '@/controllers/dishController'
const Router = expesss.Router()

/**
 * @swagger
 * /api/v1/dashboard/user-count:
 *   get:
 *     summary: Get all users count
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     description: Get the total number of users in the system
 *     responses:
 *       200:
 *         description: Successfully retrieved user count
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: number
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: "Get successful"
 *                 data:
 *                   type: number
 *                   example: 10
 *

 * /api/v1/dashboard/dish-count:
 *   get:
 *     summary: Get all dishes count
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     description: Get the total number of dishes in the system
 *     responses:
 *       200:
 *         description: Successfully retrieved dish count
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: number
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: "Get successful"
 *                 data:
 *                   type: number
 *                   example: 10
 */
Router.route('/user-count').get(
  authMiddleware.authenticateUser,
  authMiddleware.authorizeRole(['admin']),
  userController.getUserCount
)

Router.route('/dish-count').get(
  authMiddleware.authenticateUser,
  authMiddleware.authorizeRole(['admin']),
  dishController.getDishCount
)

export const dashboardRoute = Router
