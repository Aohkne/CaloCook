import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { historyController } from '@/controllers/historyController'
import { historyValidation } from '@/validations/historyValidation'

const Router = express.Router()

/**
 * @swagger
 * /api/v1/history/{userId}/history:
 *   get:
 *     summary: View all eating history of a user
 *     tags: [history]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID
 *     responses:
 *       200:
 *         description: History retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: number
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: "History retrieved successfully"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       userId:
 *                         type: string
 *                         example: "68306f4d4928f3fe108df627"
 *                       dishId:
 *                         type: string
 *                         example: "6841bd26594d6203e5e54c13"
 *                       consumedAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-06-06T22:15:00.000Z"
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-06-06T22:15:00.000Z"
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-06-06T22:15:00.000Z"
 *                       dish:
 *                         type: object
 *                         properties:
 *                           name:
 *                             type: string
 *                             example: "Grilled Chicken Breast"
 *                           cookingTime:
 *                             type: integer
 *                             example: 30
 *                           calorie:
 *                             type: integer
 *                             example: 400
 *                           difficulty:
 *                             type: string
 *                             enum: [easy, medium, hard]
 *                             example: "easy"
 *                           description:
 *                             type: string
 *                             example: "Lean grilled chicken breast with herbs and spices."
 *                           imageUrl:
 *                             type: string
 *                             example: ""
 *                           isActive:
 *                             type: boolean
 *                             example: true
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *                             example: "2025-06-06T00:00:00.000Z"
 *                           updatedAt:
 *                             type: string
 *                             format: date-time
 *                             example: "2025-06-06T00:00:00.000Z"
 *   post:
 *     summary: Add an eating record to user's history
 *     tags: [history]
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
 *                 description: ID of the dish
 *     responses:
 *       201:
 *         description: History added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: number
 *                   example: 201
 *                 message:
 *                   type: string
 *                   example: "History added successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     userId:
 *                       type: string
 *                       example: "68306f4d4928f3fe108df627"
 *                     dishId:
 *                       type: string
 *                       example: "6841bd26594d6203e5e54c13"
 *                     consumedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-06-06T22:15:00.000Z"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-06-06T22:15:00.000Z"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-06-06T22:15:00.000Z"
 * /api/v1/history/user/{userId}:
 *   get:
 *     summary: Search eating history by user ID
 *     tags: [history]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID
 *     responses:
 *       200:
 *         description: History retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: number
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: "History retrieved successfully"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       userId:
 *                         type: string
 *                         example: "68306f4d4928f3fe108df627"
 *                       dishId:
 *                         type: string
 *                         example: "6841bd26594d6203e5e54c13"
 *                       consumedAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-06-06T22:15:00.000Z"
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-06-06T22:15:00.000Z"
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-06-06T22:15:00.000Z"
 * /api/v1/history/dish/{dishId}:
 *   get:
 *     summary: Search eating history by dish ID
 *     tags: [history]
 *     parameters:
 *       - in: path
 *         name: dishId
 *         schema:
 *           type: string
 *         required: true
 *         description: Dish ID
 *     responses:
 *       200:
 *         description: History retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: number
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: "History retrieved successfully"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       userId:
 *                         type: string
 *                         example: "68306f4d4928f3fe108df627"
 *                       dishId:
 *                         type: string
 *                         example: "6841bd26594d6203e5e54c13"
 *                       consumedAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-06-06T22:15:00.000Z"
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-06-06T22:15:00.000Z"
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-06-06T22:15:00.000Z"
 * /api/v1/history/{historyId}:
 *   delete:
 *     summary: Delete an eating history record
 *     tags: [history]
 *     parameters:
 *       - in: path
 *         name: historyId
 *         schema:
 *           type: string
 *         required: true
 *         description: History record ID
 *     responses:
 *       200:
 *         description: History deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: number
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: "History deleted successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: "History deleted successfully"
 *   put:
 *     summary: Edit an eating history record
 *     tags: [history]
 *     parameters:
 *       - in: path
 *         name: historyId
 *         schema:
 *           type: string
 *         required: true
 *         description: History record ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - consumedAt
 *             properties:
 *               consumedAt:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-06-06T23:00:00.000Z"
 *                 description: Updated consumption time
 *     responses:
 *       200:
 *         description: History updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: number
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: "History updated successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     userId:
 *                       type: string
 *                       example: "68306f4d4928f3fe108df627"
 *                     dishId:
 *                       type: string
 *                       example: "6841bd26594d6203e5e54c13"
 *                     consumedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-06-06T23:00:00.000Z"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-06-06T22:15:00.000Z"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-06-06T23:00:00.000Z"
 */

Router.route('/:userId/history')
  .get(historyValidation.viewHistory, historyController.viewHistory)
  .post(historyValidation.addToHistory, historyController.addToHistory)

Router.route('/user/:userId')
  .get(historyValidation.searchByUserId, historyController.searchByUserId)

Router.route('/dish/:dishId')
  .get(historyValidation.searchByDishId, historyController.searchByDishId)

Router.route('/:historyId')
  .delete(historyValidation.deleteFromHistory, historyController.deleteFromHistory)
  .put(historyValidation.editHistory, historyController.editHistory)

export const historyRoute = Router