import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { ratingController } from '@/controllers/ratingController'
import { authMiddleware } from '@/middlewares/authMiddleware'

const Router = express.Router()

/**
 * @swagger
 * /api/v1/rating:
 *   post:
 *     summary: Add a new rating for a dish
 *     tags: [Rating]
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
 *               - star
 *             properties:
 *               userId:
 *                 type: string
 *                 example: "68306f4d4928f3fe108df627"
 *               dishId:
 *                 type: string
 *                 example: "6841bd26594d6203e5e54c13"
 *               star:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 5
 *                 example: 4
 *               description:
 *                 type: string
 *                 maxLength: 500
 *                 example: "Delicious dish!"
 *     responses:
 *       201:
 *         description: Rating added successfully
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
 *                   example: "Rating created successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Rating'
 *   get:
 *     summary: View ratings for a dish
 *     tags: [Rating]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: dishId
 *         schema:
 *           type: string
 *         required: true
 *         description: Dish ID
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [createdAt, star]
 *         required: false
 *         description: Field to sort by
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         required: false
 *         description: Sort order
 *     responses:
 *       200:
 *         description: Ratings retrieved successfully
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
 *                     $ref: '#/components/schemas/Rating'
 * /api/v1/rating/average:
 *   get:
 *     summary: Get average rating for a dish
 *     tags: [Rating]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: dishId
 *         schema:
 *           type: string
 *         required: true
 *         description: Dish ID
 *     responses:
 *       200:
 *         description: Average rating retrieved successfully
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
 *                   type: object
 *                   properties:
 *                     averageRating:
 *                       type: number
 *                       example: 4.25
 *                     totalRatings:
 *                       type: number
 *                       example: 10
 * /api/v1/rating/{id}:
 *   put:
 *     summary: Update a rating
 *     tags: [Rating]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Rating ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - star
 *             properties:
 *               star:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 5
 *                 example: 5
 *               description:
 *                 type: string
 *                 maxLength: 500
 *                 example: "Really enjoyed it!"
 *     responses:
 *       200:
 *         description: Rating updated successfully
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
 *                   example: "Rating updated successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Rating'
 * components:
 *   schemas:
 *     Rating:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "665758c71a6d1f001e8a1d01"
 *         userId:
 *           type: string
 *           example: "68306f4d4928f3fe108df627"
 *         dishId:
 *           type: string
 *           example: "6841bd26594d6203e5e54c13"
 *         star:
 *           type: number
 *           example: 4
 *         description:
 *           type: string
 *           example: "Delicious dish!"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2025-08-29T12:00:00Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: "2025-08-29T12:00:00Z"
 */

Router.route('/')
  .post(authMiddleware.authenticateUser, authMiddleware.authorizeRole(['user']), ratingController.addRating)
  .get(authMiddleware.authenticateUser, authMiddleware.authorizeRole(['user', 'admin']), ratingController.viewRatings)

Router.route('/average')
  .get(authMiddleware.authenticateUser, authMiddleware.authorizeRole(['user', 'admin']), ratingController.getAverageRating)

Router.route('/:id')
  .put(authMiddleware.authenticateUser, authMiddleware.authorizeRole(['user']), ratingController.updateRating)

export const ratingRoute = Router