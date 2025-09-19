import express from 'express'
import { authMiddleware } from '@/middlewares/authMiddleware'
import { userController } from '@/controllers/userController'
import { authController } from '@/controllers/authController'
import { paginationHelper } from '@/utils/pagination'

const Router = express.Router()

/**
 * @swagger
 * /api/v1/user:
 *   get:
 *     summary: Get all users (with optional filters and sorting)
 *     tags: [user]
 *     security:
 *       - bearerAuth: []
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
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     currentPage:
 *                       type: number
 *                       example: 1
 *                     totalPages:
 *                       type: number
 *                       example: 5
 *                     totalItems:
 *                       type: number
 *                       example: 50
 *                     itemsPerPage:
 *                       type: number
 *                       example: 10
 *                     hasNextPage:
 *                       type: boolean
 *                       example: true
 *                     hasPrevPage:
 *                       type: boolean
 *                       example: false
 *                     nextPage:
 *                       type: number
 *                       example: 2
 *                     prevPage:
 *                       type: number
 *                       example: null
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'

 * /api/v1/user/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags: [user]
 *     security:
 *       - bearerAuth: []
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
 *     security:
 *       - bearerAuth: []
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
 *     security:
 *       - bearerAuth: []
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
  
 * /api/v1/user/email-verification:
 *   post:
 *     summary: Send email verification link to user's email
 *     tags: [user]
 *     security:
 *       - bearerAuth: []
 *     description: Send email verification link to user's email. Accessible by users with 'admin' or 'user' roles.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "nguyenvana@example.com"
 *     responses:
 *      200:
 *        description: Email verification link sent successfully
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
 *                  example: "Email verification link sent successfully"
 
 * /api/v1/user/verify-email/{token}: 
 *   get:
 *     summary: Verify user's email using the token
 *     tags: [user]
 *     security:
 *       - bearerAuth: []
 *     description: Verify user's email using the token sent to their email. Accessible by users with 'admin' or 'user' roles.
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: The email verification token
 *     responses:
 *       200:
 *         description: Email verified successfully
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
 *                   example: "Email verified successfully"
 * 
 * 
 */

Router.route('/').get(
  authMiddleware.authenticateUser,
  authMiddleware.authorizeRole(['admin']),
  paginationHelper.validatePaginationMiddleware,
  userController.getAll
)
Router.route('/:id').get(
  authMiddleware.authenticateUser,
  authMiddleware.authorizeRole(['admin']),
  userController.getDetails
)
Router.route('/:id/activate').patch(
  authMiddleware.authenticateUser,
  authMiddleware.authorizeRole(['admin']),
  userController.activateUser
)
Router.route('/:id/deactivate').patch(
  authMiddleware.authenticateUser,
  authMiddleware.authorizeRole(['admin']),
  userController.deactivateUser
)
Router.route('/email-verification').post(
  authMiddleware.authenticateUser,
  authMiddleware.authorizeRole(['admin', 'user']),
  authController.emailVerification
)
Router.route('/verify-email/:token').get(
  authMiddleware.authenticateUser,
  authMiddleware.authorizeRole(['admin', 'user']),
  authController.verifyEmail
)

export const userRoute = Router
