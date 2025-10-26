import express from 'express'
import { achievementController } from '@/controllers/achievementController'
import { authMiddleware } from '@/middlewares/authMiddleware'
import { paginationHelper } from '@/utils/pagination'

const Router = express.Router()

/**
 * @swagger
 * /api/v1/achievements/user/{userId}:
 *   get:
 *     tags: [achievements]
 *     security:
 *       - bearerAuth: []
 *     summary: Get user achievement details
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *         example: "6843b2dc410a1db97da1ad22"
 *     responses:
 *       200:
 *         description: Achievement data retrieved successfully
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
 *                   example: Get achievement successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     userId:
 *                       type: string
 *                       example: "6843b2dc410a1db97da1ad22"
 *                     totalPoints:
 *                       type: number
 *                       example: 350
 *                     currentLevel:
 *                       type: string
 *                       enum: [none, bronze, silver, gold]
 *                       example: bronze
 *                     easyDishCount:
 *                       type: number
 *                       example: 10
 *                     mediumDishCount:
 *                       type: number
 *                       example: 5
 *                     hardDishCount:
 *                       type: number
 *                       example: 2
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-06-11T08:00:00.000Z"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-06-15T10:30:00.000Z"
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Achievement not found
 *       500:
 *         description: Internal server error
 *
 * /api/v1/achievements/add-points:
 *   post:
 *     tags: [achievements]
 *     security:
 *       - bearerAuth: []
 *     summary: Add achievement points for completing a dish
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - difficulty
 *             properties:
 *               userId:
 *                 type: string
 *                 example: "6843b2dc410a1db97da1ad22"
 *               difficulty:
 *                 type: string
 *                 enum: [easy, medium, hard]
 *                 example: medium
 *     responses:
 *       200:
 *         description: Points added successfully
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
 *                   example: Points added successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     points:
 *                       type: number
 *                       example: 50
 *                       description: Points earned from this dish
 *                     totalPoints:
 *                       type: number
 *                       example: 350
 *                       description: Total accumulated points
 *                     levelUp:
 *                       type: boolean
 *                       example: true
 *                       description: Whether user leveled up
 *                     newLevel:
 *                       type: string
 *                       enum: [none, bronze, silver, gold]
 *                       example: bronze
 *                       description: Current level after adding points
 *                     oldLevel:
 *                       type: string
 *                       enum: [none, bronze, silver, gold]
 *                       example: none
 *                       description: Previous level before adding points
 *       400:
 *         description: Bad request - Invalid difficulty or userId
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 *
 * /api/v1/achievements/levels:
 *   get:
 *     tags: [achievements]
 *     summary: Get achievement level thresholds and difficulty points
 *     responses:
 *       200:
 *         description: Level configuration retrieved successfully
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
 *                   example: Get level configuration successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     levelThresholds:
 *                       type: object
 *                       properties:
 *                         bronze:
 *                           type: number
 *                           example: 100
 *                         silver:
 *                           type: number
 *                           example: 500
 *                         gold:
 *                           type: number
 *                           example: 1000
 *                     difficultyPoints:
 *                       type: object
 *                       properties:
 *                         easy:
 *                           type: number
 *                           example: 10
 *                         medium:
 *                           type: number
 *                           example: 50
 *                         hard:
 *                           type: number
 *                           example: 100
 *       500:
 *         description: Internal server error
 */

Router.route('/user/:userId')
  .get(
    authMiddleware.authenticateUser,
    authMiddleware.authorizeRole(['admin', 'user']),
    achievementController.getUserAchievement
  )

Router.route('/add-points')
  .post(
    authMiddleware.authenticateUser,
    authMiddleware.authorizeRole(['admin', 'user']),
    achievementController.addPoints
  )

Router.route('/levels')
  .get(achievementController.getLevelConfiguration)
  .put( // THÊM DÒNG NÀY
    authMiddleware.authenticateUser,
    authMiddleware.authorizeRole(['admin']), 
    achievementController.updateLevelConfiguration
  )
Router.route('/leaderboard')
  .get(
    paginationHelper.validatePaginationMiddleware, 
    achievementController.getLeaderboard
  )
export const achievementRoute = Router