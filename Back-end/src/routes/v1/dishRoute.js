import express from 'express'
import { StatusCodes } from 'http-status-codes'

import { dishController } from '@/controllers/dishController'
import { userValidation } from '@/validations/userValidation'
import { dishValidation } from '@/validations/dishValidation'

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
 *   post:
 *     summary: Create a new dish
 *     tags: [dish]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 50
 *                 example: "Grilled Chicken Breast"
 *               cookingTime:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 10080
 *                 default: 30
 *                 example: 30
 *               calorie:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 10000
 *                 default: 100
 *                 example: 400
 *               difficulty:
 *                 type: string
 *                 enum: [easy, medium, hard]
 *                 default: medium
 *                 example: "easy"
 *               description:
 *                 type: string
 *                 minLength: 10
 *                 maxLength: 1000
 *                 example: "Lean grilled chicken breast with herbs and spices, perfect for a healthy meal."
 *               imageUrl:
 *                 type: string
 *                 format: uri
 *                 example: "https://example.com/image.jpg"
 *               isActive:
 *                 type: boolean
 *                 default: true
 *                 example: true
 *     responses:
 *       201:
 *         description: Dish created successfully
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
 *                   example: "Create successful"
 *                 data:
 *                   $ref: '#/components/schemas/Dish'

 * /api/v1/dish/{id}:
 *   get:
 *     summary: Get dish by ID
 *     tags: [dish]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Dish Id
 *     responses:
 *       200:
 *         description: Return detail of dish
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
 *                   $ref: '#/components/schemas/Dish' 
 *   put:
 *     summary: Update dish by ID
 *     tags: [dish]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Dish ID to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 50
 *                 example: "Updated Grilled Chicken Breast"
 *               cookingTime:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 10080
 *                 example: 35
 *               calorie:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 10000
 *                 example: 450
 *               difficulty:
 *                 type: string
 *                 enum: [easy, medium, hard]
 *                 example: "medium"
 *               description:
 *                 type: string
 *                 minLength: 10
 *                 maxLength: 1000
 *                 example: "Updated description for grilled chicken breast."
 *               imageUrl:
 *                 type: string
 *                 format: uri
 *                 example: "https://example.com/updated-image.jpg"
 *               isActive:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Dish updated successfully
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
 *                   example: "Update successful"
 *                 data:
 *                   $ref: '#/components/schemas/Dish'

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

Router.route('/').get(dishController.getAll).post(dishValidation.createNew, dishController.createNew)
Router.route('/:id').get(dishController.getDetails).put(dishValidation.updateDish, dishController.updateDish)
Router.route('/:id/activate').patch(dishController.activateDish)
Router.route('/:id/deactivate').patch(dishController.deactivateDish)

export const dishRoute = Router
