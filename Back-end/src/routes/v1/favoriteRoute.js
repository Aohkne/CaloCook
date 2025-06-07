import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { favoriteController } from '@/controllers/favoriteController'
import { favoriteValidation } from '@/validations/favoriteValidation'

const Router = express.Router()

/**
 * @swagger
 * /api/v1/favorite/{userId}:
 *   get:
 *     summary: Get favorite dishes of a user
 *     tags: [favorite]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [createdAt, name, cookingTime, calorie, difficulty]
 *         required: false
 *         description: Field to sort by (e.g., createdAt, name)
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         required: false
 *         description: asc for ascending, desc for descending
 *     responses:
 *       200:
 *         description: Return list of favorite dishes
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
 *                   example: "Favorites retrieved successfully"
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Favorite'
 *   post:
 *     summary: Add a dish to user's favorites
 *     tags: [favorite]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - dishId
 *             properties:
 *               dishId:
 *                 type: string
 *                 example: "6841bd26594d6203e5e54c13"
 *                 description: ID of the dish to add to favorites
 *     responses:
 *       201:
 *         description: Favorite created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: number
 *                   example: 201
 *                 message:
 *                   type: string
 *                   example: "Favorite created successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Favorite'
 * /api/v1/favorite/{userId}/{dishId}:
 *   delete:
 *     summary: Remove a dish from user's favorites
 *     tags: [favorite]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID
 *       - in: path
 *         name: dishId
 *         schema:
 *           type: string
 *         required: true
 *         description: Dish ID to remove from favorites
 *     responses:
 *       200:
 *         description: Favorite deleted successfully
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
 *                   example: "Favorite deleted successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: "Dish removed from favorites"
 * components:
 *   schemas:
 *     Favorite:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "507f1f77bcf86cd799439013"
 *         userId:
 *           type: string
 *           example: "507f1f77bcf86cd799439011"
 *         dishId:
 *           type: string
 *           example: "507f1f77bcf86cd799439012"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2025-06-05T16:40:00.000Z"
 *         dish:
 *           type: object
 *           properties:
 *             _id:
 *               type: string
 *               example: "507f1f77bcf86cd799439012"
 *             name:
 *               type: string
 *               example: "Grilled Chicken Breast"
 *             cookingTime:
 *               type: integer
 *               example: 30
 *             calorie:
 *               type: integer
 *               example: 400
 *             difficulty:
 *               type: string
 *               enum: [easy, medium, hard]
 *               example: "easy"
 *             description:
 *               type: string
 *               example: "Lean grilled chicken breast with herbs and spices."
 *             imageUrl:
 *               type: string
 *               example: ""
 *             isActive:
 *               type: boolean
 *               example: true
 *             createdAt:
 *               type: string
 *               format: date-time
 *               example: "2025-05-29T08:00:00.000Z"
 *             updatedAt:
 *               type: string
 *               format: date-time
 *               example: "2025-05-29T08:00:00.000Z"
 */

Router.route('/:userId')
  .get(favoriteValidation.viewFavorites, favoriteController.viewFavorites)
  .post(favoriteValidation.addToFavorites, favoriteController.addToFavorites)

Router.route('/:userId/:dishId').delete(
  favoriteValidation.deleteFromFavorites,
  favoriteController.deleteFromFavorites
)

export const favoriteRoute = Router