import expesss from 'express'
import { authenticateUser, authorizeRole } from '@/middlewares/authMiddleware'
import { authController } from '@/controllers/authController'
const Router = expesss.Router()

// swagger: tags: ['Auth']
/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: User login
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               emailOrUsername:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful


 * /api/v1/auth/signup:
 *   post:
 *     tags: [Auth]
 *     summary: User signup
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Signup successful


 * /api/v1/auth/refresh-token:
 *   post:
 *     tags: [Auth]
 *     summary: Refresh access token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Token refreshed


 * /api/v1/auth/logout:
 *   post:
 *     tags: [Auth]
 *     summary: Logout user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Logout successful


 * /api/v1/auth/forgot-password:
 *   post:
 *     tags: [Auth]
 *     summary: Request password reset
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password reset email sent

 * /api/v1/auth/forgot-password/{token}:
 *   post:
 *     tags: [Auth]
 *     summary: Reset password with token
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password reset successful



 * /api/v1/auth/change-password:
 *   post:
 *     tags: [Auth]
 *     summary: Change password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               oldPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password changed successfully

 
 * /api/v1/auth/profile:
  *   get:
 *     tags: [Auth]
 *     summary: Get user profile
 *     responses:
 *       200:
 *         description: User profile data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: "6843b2dc410a1db97da1ad22"
 *                 username:
 *                   type: string
 *                   example: sa
 *                 email:
 *                   type: string
 *                   example: sa@gmail.com
 *                 role:
 *                   type: string
 *                   example: user
 *                 calorieLimit:
 *                   type: number
 *                   example: 2000
 *                 avatarUrl:
 *                   type: string
 *                   example: none
 *                 gender:
 *                   type: string
 *                   example: male
 *                 dob:
 *                   type: string
 *                   example: null
 *                 height:
 *                   type: number
 *                   example: null
 *                 weight:
 *                   type: number
 *                   example: null
 *                 isActive:
 *                   type: boolean
 *                   example: true
 *                 createdAt:
 *                   type: string
 *                   example: "2024-06-11T08:00:00.000Z"
 *  
 *
 *
 *   post:
 *     tags: [Auth]
 *     summary: Edit user profile
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: john_doe
 *               email:
 *                 type: string
 *                 example: 0R0tP@gmail.com
 *               calorieLimit:
 *                 type: number
 *                 example: 2000
 *               avatarUrl:
 *                 type: string
 *                 example: https://example.com/avatar.jpg
 *               gender:
 *                 type: string
 *                 enum: [male, female, other]
 *               dob:
 *                 type: string
 *                 format: date
 *                 example: "1990-05-01"
 *               height:
 *                 type: number
 *                 example: 175
 *               weight:
 *                 type: number
 *                 example: 70
 *     responses:
 *       200:
 *         description: Profile updated successfully
 */
Router.post('/login', authController.login)
Router.post('/signup', authController.signup)
Router.post('/refresh-token', authController.refreshToken)
Router.post('/logout', authenticateUser, authController.logout)
Router.post('/forgot-password', authController.forgotPassword)
Router.post('/forgot-password/:token', authController.resetPassword)
Router.post('/change-password', authenticateUser, authController.changePassword)
Router.get('/profile', authenticateUser, authController.getProfile)
Router.post('/profile', authenticateUser, authController.editProfile)

export const authRoute = Router
