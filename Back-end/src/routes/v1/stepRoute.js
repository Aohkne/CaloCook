import express from 'express'
import { StatusCodes } from 'http-status-codes'

import { stepController } from '@/controllers/stepController'
import { stepValidation } from '@/validations/stepValidation'
import { authMiddleware } from '@/middlewares/authMiddleware'

const Router = express.Router()

/**
 * @swagger
 * /api/v1/step:
 *   get:
 *     summary: Get all steps (with optional filters and sorting)
 *     tags: [step]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: isActive
 *         schema:
 *           type: boolean
 *         required: false
 *         description: Filter steps by active status (true or false)
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [stepNumber, createdAt]
 *         required: false
 *         description: Field to sort by (e.g. stepNumber, createdAt)
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         required: false
 *         description: asc for ascending, desc for descending
 *     responses:
 *       200:
 *         description: Return list of steps
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
 *                     $ref: '#/components/schemas/Step'
 *   post:
 *     summary: Create a new step
 *     tags: [step]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - dishId
 *               - stepNumber
 *               - description
 *             properties:
 *               dishId:
 *                 type: string
 *                 minLength: 24
 *                 maxLength: 24
 *                 pattern: '^[a-fA-F0-9]{24}$'
 *                 example: "66574e301a6d1f001e8a1c01"
 *               stepNumber:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 100
 *                 example: 1
 *               description:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 50
 *                 example: "Chop the vegetables finely"
 *               isActive:
 *                 type: boolean
 *                 default: true
 *                 example: true
 *     responses:
 *       201:
 *         description: Step created successfully
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
 *                   $ref: '#/components/schemas/Step'
 *
 * /api/v1/step/by-dish/{dishId}:
 *   get:
 *     summary: Get steps by dish ID
 *     tags: [step]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: dishId
 *         schema:
 *           type: string
 *           minLength: 24
 *           maxLength: 24
 *           pattern: '^[a-fA-F0-9]{24}$'
 *         required: true
 *         description: Dish Id
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [stepNumber, createdAt]
 *         required: false
 *         description: Field to sort by (e.g. stepNumber, createdAt)
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         required: false
 *         description: asc for ascending, desc for descending
 *     responses:
 *       200:
 *         description: Return list of steps for the dish
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
 *                     $ref: '#/components/schemas/Step'
 *
 * /api/v1/step/{id}:
 *   get:
 *     summary: Get step by ID
 *     tags: [step]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           minLength: 24
 *           maxLength: 24
 *           pattern: '^[a-fA-F0-9]{24}$'
 *         required: true
 *         description: Step Id
 *     responses:
 *       200:
 *         description: Return detail of step
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
 *                   $ref: '#/components/schemas/Step'
 *   put:
 *     summary: Update step by ID
 *     tags: [step]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           minLength: 24
 *           maxLength: 24
 *           pattern: '^[a-fA-F0-9]{24}$'
 *         required: true
 *         description: Step ID to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               dishId:
 *                 type: string
 *                 minLength: 24
 *                 maxLength: 24
 *                 pattern: '^[a-fA-F0-9]{24}$'
 *                 example: "66574e301a6d1f001e8a1c01"
 *               stepNumber:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 100
 *                 example: 2
 *               description:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 50
 *                 example: "Updated step description"
 *               isActive:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Step updated successfully
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
 *                   $ref: '#/components/schemas/Step'
 *
 * /api/v1/step/{id}/activate:
 *   patch:
 *     summary: Activate step by ID (set isActive to true)
 *     tags: [step]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           minLength: 24
 *           maxLength: 24
 *           pattern: '^[a-fA-F0-9]{24}$'
 *         required: true
 *         description: Step Id
 *     responses:
 *       200:
 *         description: Step activated successfully
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
 *                   example: "Step activated successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Step'
 *
 * /api/v1/step/{id}/deactivate:
 *   patch:
 *     summary: Deactivate step by ID (set isActive to false)
 *     tags: [step]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           minLength: 24
 *           maxLength: 24
 *           pattern: '^[a-fA-F0-9]{24}$'
 *         required: true
 *         description: Step ID to deactivate
 *     responses:
 *       200:
 *         description: Step deactivated successfully
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
 *                   example: "Step deactivated successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Step'
 *
 * components:
 *   schemas:
 *     Step:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "665758c71a6d1f001e8a1d01"
 *         dishId:
 *           type: string
 *           example: "66574e301a6d1f001e8a1c01"
 *         stepNumber:
 *           type: integer
 *           example: 1
 *         description:
 *           type: string
 *           example: "Chop the vegetables finely"
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
 */

Router.route('/')
  .get(authMiddleware.authenticateUser, authMiddleware.authorizeRole(['admin']), stepController.getAll)
  .post(
    authMiddleware.authenticateUser,
    authMiddleware.authorizeRole(['admin']),
    stepValidation.createNew,
    stepController.createNew
  )
Router.route('/by-dish/:dishId').get(
  authMiddleware.authenticateUser,
  authMiddleware.authorizeRole(['admin', 'user']),
  stepController.getDetailsByDishId
)
Router.route('/:id')
  .get(authMiddleware.authenticateUser, authMiddleware.authorizeRole(['admin']), stepController.getDetails)
  .put(
    authMiddleware.authenticateUser,
    authMiddleware.authorizeRole(['admin']),
    stepValidation.updateStep,
    stepController.updateStep
  )
Router.route('/:id/activate').patch(
  authMiddleware.authenticateUser,
  authMiddleware.authorizeRole(['admin']),
  stepController.activateStep
)
Router.route('/:id/deactivate').patch(
  authMiddleware.authenticateUser,
  authMiddleware.authorizeRole(['admin']),
  stepController.deactivateStep
)

export const stepRoute = Router
