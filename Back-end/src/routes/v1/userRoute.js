import expesss from 'express'
import { StatusCodes } from 'http-status-codes'

import { userController } from '@/controllers/userController'
import { userValidation } from '@/validations/userValidation'

const Router = expesss.Router()

/**
 * @swagger
 * /api/v1/user:
 *   get:
 *     summary: Get All Users
 *     tags: [user]
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
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: "68306f4d4928f3fe108df627"
 *                       name:
 *                         type: string
 *                         example: "Nguyễn Văn A"
 *                       email:
 *                         type: string
 *                         example: "nguyenvana@example.com"
 *                       password_hash:
 *                         type: string
 *                         example: "$2b$10$abcdefghij1234567890mnopqrstuv"
 *                       role:
 *                         type: string
 *                         enum: [admin, user]
 *                         example: "admin"
 *                       calorie_limit:
 *                         type: number
 *                         example: 2200
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-05-23T07:00:00.000Z"
 *                       updated_at:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-05-23T07:00:00.000Z"
 */

Router.route('/').get(userController.getAll)

// Data -> Validation(Check lỗi) -> Controller(Điều hướng)
// .post(userValidation.createNew, _Controller.createNew)

export const userRoute = Router
