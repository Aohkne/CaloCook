import express from 'express'
import { StatusCodes } from 'http-status-codes'

import { dishController } from '@/controllers/dishController'
import { userValidation } from '@/validations/userValidation'

const Router = express.Router()

/**
 * @swagger
 * /api/v1/dish:
 *   get:
 *     summary: Get all dishes (with optional filters and sorting)
 *     tags: [dish]
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         required: false
 *         description: Filter dishes by name
 *       - in: query
 *         name: minCookingTime
 *         schema:
 *           type: integer
 *         required: false
 *         description: Minimum cooking time to filter dishes
 *       - in: query
 *         name: maxCookingTime
 *         schema:
 *           type: integer
 *         required: false
 *         description: Maximum cooking time to filter dishes
 *       - in: query
 *         name: minCalorie
 *         schema:
 *           type: integer
 *         required: false
 *         description: Minimum calorie to filter dishes
 *       - in: query
 *         name: maxCalorie
 *         schema:
 *           type: integer
 *         required: false
 *         description: Maximum calorie to filter dishes
 *       - in: query
 *         name: difficulty
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *             enum: [easy, medium, hard]
 *           collectionFormat: multi 
 *         required: false
 *         description: Filter dishes by difficulty level
 *       - in: query
 *         name: isActive
 *         schema:
 *           type: boolean
 *         required: false
 *         description: Filter dishes by active status (true or false)
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [name, cookingTime, calorie, createdAt]
 *         required: false
 *         description: Field to sort by (e.g. name, calorie, createdAt)
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         required: false
 *         description: asc for ascending, desc for descending
 *     responses:
 *       200:
 *         description: Return list of dishes
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
 *                     $ref: '#/components/schemas/Dish'

 * /api/v1/dish/{id}/activate:
 *   patch:
 *     summary: Activate dish by ID (set isActive to true)
 *     tags: [dish]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description:  Dish Id
 *     responses:
 *       200:
 *         description: Dish Activated successfully
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
 *                   example: "Dish Activated successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Dish'
 
 * /api/v1/dish/{id}/deactivate:
 *   patch:
 *     summary: Deactivate dish by ID (set isActive to false)
 *     tags: [dish]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Dish ID to deactivate
 *     responses:
 *       200:
 *         description: Dish deactivated successfully
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
 *                   example: "Dish deactivated successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Dish' 

 * components:
 *   schemas:
 *     Dish:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "68306f4d4928f3fe108df627"
 *         name:
 *           type: string
 *           example: "Grilled Chicken Breast"
 *         cookingTime:
 *           type: integer
 *           example: 30
 *         calorie:
 *           type: integer
 *           example: 400
 *         difficulty:
 *           type: string
 *           enum: [easy, medium, hard]
 *           example: "easy"
 *         description:
 *           type: string
 *           example: "Lean grilled chicken breast with herbs and spices."
 *         imageUrl:
 *           type: string
 *           example: ""
 *         isActive:
 *           type: boolean
 *           example: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2025-05-29T08:00:00.000Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: "2025-05-29T08:00:00.000Z"
 */

Router.route('/').get(dishController.getAll)
Router.route('/:id/activate').patch(dishController.activateDish)
Router.route('/:id/deactivate').patch(dishController.deactivateDish)

export const dishRoute = Router
