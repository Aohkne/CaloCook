import express from 'express'
import { StatusCodes } from 'http-status-codes'

import { userController } from '@/controllers/userController'
import { userValidation } from '@/validations/userValidation'

const Router = express.Router()

/**
 * @swagger
 * /api/v1/user:
 *   get:
 *     summary: Get all users (with optional filters and sorting)
 *     tags: [user]
 *     parameters:
 *        - in: query
 *          name: username
 *          schema:
 *              type: string
 *          required: false
 *          description: Filter users by username 
 *        - in: query
 *          name: email
 *          schema:
 *              type: string
 *          required: false
 *          description: Filter users by email 
 *        - in: query
 *          name: isActive
 *          schema:
 *              type: boolean
 *          required: false
 *          description: Filter users by active status (true or false)
 *        - in: query
 *          name: sortBy
 *          schema:
 *              type: string
 *              enum: [username, email, createdAt]
 *          required: false
 *          description: Field to sort by (e.g. username, email, createdAt)
 *        - in: query
 *          name: order
 *          schema:
 *              type: string
 *              enum: [asc, desc]
 *          required: false
 *          description: asc for ascending, desc for descending
 *     responses:
 *       200:
 *         description: Return list of users
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
 *                     $ref: '#/components/schemas/User'

 * /api/v1/user/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags: [user]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: User Id
 *     responses:
 *       200:
 *         description: Return detail of user
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
 *                   $ref: '#/components/schemas/User'

 * /api/v1/user/{id}/activate:
 *   patch:
 *     summary: Activate user by ID (set isActive to true)
 *     tags: [user]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description:  User Id
 *     responses:
 *       200:
 *         description: User Activated successfully
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
 *                   example: "User Activated successfully"
 *                 data:
 *                   $ref: '#/components/schemas/User'
 
 * /api/v1/user/{id}/deactivate:
 *   patch:
 *     summary: Deactivate user by ID (set isActive to false)
 *     tags: [user]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID to deactivate
 *     responses:
 *       200:
 *         description: User deactivated successfully
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
 *                   example: "User deactivated successfully"
 *                 data:
 *                   $ref: '#/components/schemas/User'

 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "68306f4d4928f3fe108df627"
 *         username:
 *           type: string
 *           example: "Nguyễn Văn A"
 *         email:
 *           type: string
 *           example: "nguyenvana@example.com"
 *         password_hash:
 *           type: string
 *           example: "$2b$10$abcdefghij1234567890mnopqrstuv"
 *         role:
 *           type: string
 *           enum: [admin, user]
 *           example: "admin"
 *         calorieLimit:
 *           type: number
 *           example: 2200
 *         avatarUrl:
 *           type: string
 *           example: ""
 *         gender:
 *           type: string
 *           enum: [male, female, other]
 *           example: "male"
 *         dob:
 *           type: string
 *           format: date
 *           example: "1990-05-01"
 *         height:
 *           type: number
 *           example: 170
 *         weight:
 *           type: number
 *           example: 65
 *         isActive:
 *           type: boolean
 *           example: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2025-05-23T07:00:00.000Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: "2025-05-23T07:00:00.000Z"
 */

Router.route('/').get(userController.getAll)
Router.route('/:id').get(userController.getDetails)
Router.route('/:id/activate').patch(userController.activateUser)
Router.route('/:id/deactivate').patch(userController.deactivateUser)

export const userRoute = Router
