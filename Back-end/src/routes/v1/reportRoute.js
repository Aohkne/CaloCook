import express from 'express'
import { authMiddleware } from '@/middlewares/authMiddleware'
import { reportController } from '@/controllers/reportController'
import { reportValidation } from '@/validations/reportValidation'

const Router = express.Router()

/**
 * @swagger
 * /api/v1/report:
 *   get:
 *     summary: Get all reports
 *     tags: [report]
 *     security:
 *       - bearerAuth: []
 *     description: Retrieve a list of all reports. Accessible by users with 'admin' or 'user' roles.
 *     responses:
 *       200:
 *         description: A list of reports and metadata.
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
 *                   example: Reports retrieved successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: 64a7b2f5e4b0c8a1d2f3e4b5
 *                       dishId:
 *                         type: string
 *                         example: 68adc41072effd308d4ecfc6
 *                       userId:
 *                         type: string
 *                         example: 6843b2dc410a1db97da1ad22
 *                       description:
 *                         type: string
 *                         example: "This is a report description"
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2023-06-15T12:34:56.789Z"
 *                 totalCount:
 *                   type: integer
 *                   example: 100
 *
 *   post:
 *     summary: Create a new report
 *     tags: [report]
 *     security:
 *       - bearerAuth: []
 *     description: Create a new report. Accessible by users with 'admin' or 'user' roles.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               dishId:
 *                 type: string
 *                 example: 66574e301a6d1f001e8a1c02
 *               userId:
 *                 type: string
 *                 example: 68b19543d85de3cac690a1b5
 *               description:
 *                 type: string
 *                 example: "This is a report description"
 *     responses:
 *       201:
 *         description: Report created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 dishId:
 *                   type: string
 *                   example: 64a3b2dc410a1db97da1ad22
 *                 userId:
 *                   type: string
 *                   example: 6843b2dc410a1db97da1ad22
 *                 description:
 *                   type: string
 *                   example: "This is a report description"
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2023-06-15T12:34:56.789Z"
 *
 * /api/v1/report/{id}:
 *   delete:
 *     summary: Delete a report
 *     tags: [report]
 *     security:
 *       - bearerAuth: []
 *     description: Delete a report by its ID. Accessible only by users with the 'admin' role.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the report to delete.
 *         schema:
 *           type: string
 *           example: 64a7b2f5e4b0c8a1d2f3e4b5
 *     responses:
 *       200:
 *         description: Report deleted successfully
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
 *                   example: Report deleted successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 64a7b2f5e4b0c8a1d2f3e4b5
 *                     dishId:
 *                       type: string
 *                       example: 64a3b2dc410a1db97da1ad22
 *                     userId:
 *                       type: string
 *                       example: 6843b2dc410a1db97da1ad22
 *                     description:
 *                       type: string
 *                       example: "This is a report description"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2023-06-15T12:34:56.789Z"
 */
Router.route('/').get(
  authMiddleware.authenticateUser,
  authMiddleware.authorizeRole(['admin', 'user']),
  reportController.getAllReport
)
Router.route('/').post(
  authMiddleware.authenticateUser,
  authMiddleware.authorizeRole(['admin', 'user']),
  reportValidation.createReport,
  reportController.createReport
)
Router.route('/:id').delete(
  authMiddleware.authenticateUser,
  authMiddleware.authorizeRole(['admin']),
  reportController.deleteReport
)

export const reportRoute = Router
