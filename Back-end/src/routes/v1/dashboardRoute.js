import expesss from 'express'

import { authMiddleware } from '@/middlewares/authMiddleware'
import { favoriteController } from '@/controllers/favoriteController'
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
 * /api/v1/dashboard/top-favorites:
 *   get:
 *     summary: Get top 10 most favorited dishes
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     description: Get the top 10 dishes with the highest number of favorites
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of top dishes to return
 *     responses:
 *       200:
 *         description: Successfully retrieved top favorite dishes
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
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       dishId:
 *                         type: string
 *                       favoriteCount:
 *                         type: number
 *                       dish:
 *                         type: object
 *                         properties:
 *                           name:
 *                             type: string
 *                           cookingTime:
 *                             type: number
 *                           calorie:
 *                             type: number
 *                           difficulty:
 *                             type: string
 *                           description:
 *                             type: string
 *                           imageUrl:
 *                             type: string
 *                           isActive:
 *                             type: boolean
 *                           createdAt:
 *                             type: string
 *                           updatedAt:
 *                             type: string 
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
Router.route('/top-favorites').get(
  authMiddleware.authenticateUser,
  authMiddleware.authorizeRole(['admin']),
  favoriteController.getTopFavorites
)
export const dashboardRoute = Router
