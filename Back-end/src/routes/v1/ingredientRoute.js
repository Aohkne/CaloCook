import express from 'express'
import { StatusCodes } from 'http-status-codes'

import { ingredientController } from '@/controllers/ingredientController'
import { ingredientValidation } from '@/validations/ingredientValidation'

const Router = express.Router()

/**
 * @swagger
 * /api/v1/ingredient:
 *   get:
 *     summary: Get all ingredient (with optional filters and sorting)
 *     tags: [ingredient]
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         required: false
 *         description: Filter ingredients by name
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
 *           enum: [name, createdAt]
 *         required: false
 *         description: Field to sort by (e.g. name, createdAt)
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         required: false
 *         description: asc for ascending, desc for descending
 *     responses:
 *       200:
 *         description: Return list of ingredients
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
 *                     $ref: '#/components/schemas/Ingredient'
 *   post:
 *     summary: Create a new ingredient
 *     tags: [ingredient]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - dishId
 *               - name
 *               - quantity
 *             properties:
 *               dishId:
 *                 type: string
 *                 minLength: 24
 *                 maxLength: 24
 *                 pattern: '^[a-fA-F0-9]{24}$'
 *                 example: "66574e301a6d1f001e8a1c01"
 *               name:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 100
 *                 example: "Garlic powder"
 *               quantity:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 50
 *                 example: "1 tsp"
 *               isActive:
 *                 type: boolean
 *                 default: true
 *                 example: true
 *     responses:
 *       201:
 *         description: Ingredient created successfully
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
 *                   $ref: '#/components/schemas/Ingredient'

 * /api/v1/ingredient/by-dish/{dishId}:
 *   get:
 *     summary: Get ingredient by dish ID
 *     tags: [ingredient]
 *     parameters:
 *       - in: path
 *         name: dishId
 *         schema:
 *           type: string
 *         required: true
 *         description: Dish Id
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [createdAt]
 *         required: false
 *         description: Field to sort by (e.g. createdAt)
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         required: false
 *         description: asc for ascending, desc for descending
 *     responses:
 *       200:
 *         description: Return detail of ingredient
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
 *                   $ref: '#/components/schemas/Ingredient' 

 * /api/v1/ingredient/{id}:
 *   get:
 *     summary: Get ingredient by ID
 *     tags: [ingredient]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Ingredient Id
 *     responses:
 *       200:
 *         description: Return detail of ingredient
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
 *                   $ref: '#/components/schemas/Ingredient' 
 *   put:
 *    summary: Update ingredient by ID
 *    tags: [ingredient]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: Ingredient ID to update
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              dishId:
 *                type: string
 *                minLength: 24
 *                maxLength: 24
 *                pattern: '^[a-fA-F0-9]{24}$'
 *                example: "66574e301a6d1f001e8a1c01"
 *              name:
 *                type: string
 *                minLength: 1
 *                maxLength: 100
 *                example: "Updated Garlic powder"
 *              quantity:
 *                type: string
 *                minLength: 1
 *                maxLength: 50
 *                example: "2 tsp"
 *              isActive:
 *                type: boolean
 *                example: true
 *    responses:
 *      200:
 *        description: Ingredient updated successfully
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                code:
 *                  type: number
 *                  example: 200
 *                message:
 *                  type: string
 *                  example: "Update successful"
 *                data:
 *                  $ref: '#/components/schemas/Ingredient'

 * /api/v1/ingredient/{id}/activate:
 *   patch:
 *     summary: Activate ingredient by ID (set isActive to true)
 *     tags: [ingredient]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description:  Ingredient Id
 *     responses:
 *       200:
 *         description: Ingredient Activated successfully
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
 *                   example: "Ingredient Activated successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Ingredient'
 
 * /api/v1/ingredient/{id}/deactivate:
 *   patch:
 *     summary: Deactivate ingredient by ID (set isActive to false)
 *     tags: [ingredient]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Ingredient ID to deactivate
 *     responses:
 *       200:
 *         description: Ingredient deactivated successfully
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
 *                   example: "Ingredient deactivated successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Ingredient' 

 * components:
 *   schemas:
 *     Ingredient:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "665758c71a6d1f001e8a1d01"
 *         dishId:
 *           type: string
 *           example: "66574e301a6d1f001e8a1c01"
 *         name:
 *           type: string
 *           example: "Chicken breast"
 *         quantity:
 *           type: string
 *           example: "200g"
 *         isActive:
 *           type: boolean
 *           example: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2025-05-31T00:00:00Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: "2025-05-31T00:00:00Z"
 * 
 */

Router.route('/').get(ingredientController.getAll).post(ingredientValidation.createNew, ingredientController.createNew)
Router.route('/by-dish/:dishId').get(ingredientController.getDetailsByDishId)
Router.route('/:id')
  .get(ingredientController.getDetails)
  .put(ingredientValidation.updateIngredient, ingredientController.updateIngredient)
Router.route('/:id/activate').patch(ingredientController.activateIngredient)
Router.route('/:id/deactivate').patch(ingredientController.deactivateIngredient)

export const ingredientRoute = Router
