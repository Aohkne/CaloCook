import express from 'express'

import { favoriteController } from '@/controllers/favoriteController'
import { favoriteValidation } from '@/validations/favoriteValidation'
import { paginationHelper } from '@/utils/pagination'
import { authMiddleware } from '@/middlewares/authMiddleware'

const Router = express.Router()

/**
 * @swagger
 * /api/v1/favorite:
 *    post:
 *     summary: Add a dish to user's favorites
 *     tags: [favorite]
 *     security:
 *       - bearerAuth: []
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - dishId
 *             properties:
 *               userId:
 *                 type: string
 *                 example: "68306f4d4928f3fe108df627"
 *                 description: ID of the user
 *               dishId:
 *                 type: string
 *                 example: "6841bd26594d6203e5e54c13"
 *                 description: ID of the dish
 *     responses:
 *       201:
 *         description: Favorite added successfully
 *    delete:
 *     summary: Remove a dish from user's favorites
 *     tags: [favorite]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - dishId
 *             properties:
 *               userId:
 *                 type: string
 *                 example: "68306f4d4928f3fe108df627"
 *                 description: ID of the user
 *               dishId:
 *                 type: string
 *                 example: "6841bd26594d6203e5e54c13"
 *                 description: ID of the dish
 *     responses:
 *       200:
 *         description: Favorite removed successfully
 *
 * /api/v1/favorite/{userId}:
 *   get:
 *     summary: View all favorite dishes of a user
 *     tags: [favorite]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [createdAt, name, cookingTime, calorie, difficulty]
 *           default: createdAt
 *         description: Sort by field
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: asc
 *         description: Sort order
 *     responses:
 *       200:
 *         description: Favorites retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Get successful
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     currentPage:
 *                       type: number
 *                       example: 1
 *                     totalPages:
 *                       type: number
 *                       example: 5
 *                     totalItems:
 *                       type: number
 *                       example: 50
 *                     itemsPerPage:
 *                       type: number
 *                       example: 10
 *                     hasNextPage:
 *                       type: boolean
 *                       example: true
 *                     hasPrevPage:
 *                       type: boolean
 *                       example: false
 *                     nextPage:
 *                       type: number
 *                       example: 2
 *                     prevPage:
 *                       type: number
 *                       example: null
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       userId:
 *                         type: string
 *                       dishId:
 *                         type: string
 *                       createdAt:
 *                         type: string
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

Router.route('/')
  .post(
    authMiddleware.authenticateUser,
    authMiddleware.authorizeRole(['user']),
    favoriteValidation.addToFavorites,
    favoriteController.addToFavorites
  )
  .delete(
    authMiddleware.authenticateUser,
    authMiddleware.authorizeRole(['user']),
    favoriteValidation.deleteFromFavorites,
    favoriteController.deleteFromFavorites
  )

Router.route('/:userId').get(
  authMiddleware.authenticateUser,
  authMiddleware.authorizeRole(['user']),
  paginationHelper.validatePaginationMiddleware,
  favoriteValidation.viewFavorites,
  favoriteController.viewFavorites
)

export const favoriteRoute = Router
