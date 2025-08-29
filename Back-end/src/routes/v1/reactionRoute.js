import express from 'express'
import { authMiddleware } from '@/middlewares/authMiddleware'
import { reactionController } from '@/controllers/reactionController'
import { reactionValidation } from '@/validations/reactionValidation'

const Router = express.Router()

/**
 * @swagger
 * /api/v1/reaction:
 *   get:
 *     summary: Get all reactions
 *     tags:
 *       - reaction
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Successfully fetched all reactions
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
 *                   example: "Successfully fetched all reactions"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: "68af0d32a5a853cd6d3cc125"
 *                       commentId:
 *                         type: string
 *                         example: "68adc41072effd308d4ecfc5"
 *                       userId:
 *                         type: string
 *                         example: "68306f4d4928f3fe108df628"
 *                       reactionType:
 *                         type: string
 *                         example: "like"
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2023-03-15T12:00:00Z"
 *
 *   post:
 *     summary: Add a reaction
 *     tags:
 *       - reaction
 *     security:
 *       - bearerAuth: []
 *     description: Add a reaction to a comment. Each user can only react once per comment.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               commentId:
 *                 type: string
 *                 example: "68adc41072effd308d4ecfc5"
 *               reactionType:
 *                 type: string
 *                 example: "like"
 *     responses:
 *       '201':
 *         description: Successfully added a reaction
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 201
 *                 message:
 *                   type: string
 *                   example: "Successfully added a reaction"
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "68af0d32a5a853cd6d3cc125"
 *                     commentId:
 *                       type: string
 *                       example: "68adc41072effd308d4ecfc5"
 *                     userId:
 *                       type: string
 *                       example: "68306f4d4928f3fe108df628"
 *                     reactionType:
 *                       type: string
 *                       example: "like"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2023-03-15T12:00:00Z"
 *
 * /api/v1/reaction/{id}:
 *   patch:
 *     summary: Update a reaction
 *     tags:
 *       - reaction
 *     security:
 *       - bearerAuth: []
 *     description: Update the type of an existing reaction.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the reaction to update
 *         schema:
 *           type: string
 *           example: "68af2344df76d9c69b2c7d11"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reactionType:
 *                 type: string
 *                 example: "haha"
 *     responses:
 *       '200':
 *         description: Successfully updated a reaction
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
 *                   example: "Successfully updated a reaction"
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "68af2344df76d9c69b2c7d11"
 *                     commentId:
 *                       type: string
 *                       example: "68adc41072effd308d4ecfc5"
 *                     userId:
 *                       type: string
 *                       example: "68306f4d4928f3fe108df628"
 *                     reactionType:
 *                       type: string
 *                       example: "haha"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2023-03-15T12:00:00Z"
 *
 *   delete:
 *     summary: Delete a reaction
 *     tags:
 *       - reaction
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the reaction to delete
 *         schema:
 *           type: string
 *           example: "68af2344df76d9c69b2c7d11"
 *     responses:
 *       '200':
 *         description: Successfully deleted a reaction
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
 *                   example: "Successfully deleted a reaction"
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "68af2344df76d9c69b2c7d11"
 *                     commentId:
 *                       type: string
 *                       example: "68adc41072effd308d4ecfc5"
 *                     userId:
 *                       type: string
 *                       example: "68306f4d4928f3fe108df628"
 *                     reactionType:
 *                       type: string
 *                       example: "haha"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2023-03-15T12:00:00Z"
 *
 * /api/v1/reaction/{commentId}:
 *   get:
 *     summary: Get reactions by commentId
 *     tags: [reaction]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         description: The ID of the comment to get reactions for
 *         schema:
 *           type: string
 *           example: "68adc41072effd308d4ecfc5"
 *     responses:
 *       '200':
 *         description: Successfully fetched reactions
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
 *                   example: "Successfully fetched reactions"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: "68af2344df76d9c69b2c7d11"
 *                       commentId:
 *                         type: string
 *                         example: "68adc41072effd308d4ecfc5"
 *                       userId:
 *                         type: string
 *                         example: "68306f4d4928f3fe108df628"
 *                       reactionType:
 *                         type: string
 *                         example: "haha"
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2023-03-15T12:00:00Z"
 */

// Get all reactions
Router.route('/').get(
  authMiddleware.authenticateUser,
  authMiddleware.authorizeRole(['admin', 'user']),
  reactionController.getAllReactions
)

// Add a reaction
Router.route('/').post(
  authMiddleware.authenticateUser,
  authMiddleware.authorizeRole(['admin', 'user']),
  reactionValidation.addReaction,
  reactionController.addReaction
)

// Get reaction by commentId
Router.route('/:commentId').get(
  authMiddleware.authenticateUser,
  authMiddleware.authorizeRole(['admin', 'user']),
  reactionController.getReactionsByCommentId
)

// Update a reaction
Router.route('/:id').patch(
  authMiddleware.authenticateUser,
  authMiddleware.authorizeRole(['admin', 'user']),
  reactionValidation.updatedReaction,
  reactionController.updateReaction
)

// Delete a reaction
Router.route('/:id').delete(
  authMiddleware.authenticateUser,
  authMiddleware.authorizeRole(['admin', 'user']),
  reactionController.deleteReaction
)

export const reactionRoute = Router
