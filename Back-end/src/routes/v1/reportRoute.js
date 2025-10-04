import express from 'express'
import { authMiddleware } from '@/middlewares/authMiddleware'
import { reportController } from '@/controllers/reportController'
import { reportValidation } from '@/validations/reportValidation'
import { paginationHelper } from '@/utils/pagination'

const Router = express.Router()

/**
 * @swagger
 * /api/v1/report:
 *   get:
 *     summary: Get all reports with pagination and search
 *     tags: [report]
 *     security:
 *       - bearerAuth: []
 *     description: Retrieve a paginated list of reports with optional search by dish name. Accessible by users with 'admin' or 'user' roles.
 *     parameters:
 *       - in: query
 *         name: page
 *         required: false
 *         description: Page number for pagination (default is 1)
 *         schema:
 *           type: integer
 *           minimum: 1
 *           example: 1
 *       - in: query
 *         name: limit
 *         required: false
 *         description: Number of reports per page (default is 10, max is 100)
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           example: 10
 *       - in: query
 *         name: dishName
 *         required: false
 *         description: Search reports by dish name (case-insensitive partial match)
 *         schema:
 *           type: string
 *           example: "pizza"
 *     responses:
 *       200:
 *         description: A paginated list of reports with metadata.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
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
 *                         example: "This dish contains inappropriate content"
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2023-06-15T12:34:56.789Z"
 *                       userEmail:
 *                         type: string
 *                         nullable: true
 *                         example: "user@example.com"
 *                       dishName:
 *                         type: string
 *                         nullable: true
 *                         example: "Margherita Pizza"
 *                 totalCount:
 *                   type: integer
 *                   example: 100
 *       400:
 *         description: Bad request - invalid query parameters
 *       401:
 *         description: Unauthorized - missing or invalid token
 *       500:
 *         description: Internal server error
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
 *
 *   patch:
 *     summary: Update a report's checked status
 *     tags: [report]
 *     security:
 *       - bearerAuth: []
 *     description: Update a report's checked status by its ID. Accessible only by users with the 'admin' role.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the report to update.
 *         schema:
 *           type: string
 *           example: 64a7b2f5e4b0c8a1d2f3e4b5
 *
 *     responses:
 *       200:
 *         description: Report updated successfully
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               code:
 *                 type: integer
 *                 example: 200
 *               message:
 *                 type: string
 *                 example: Report updated successfully
 *               data:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: 64a7b2f5e4b0c8a1d2f3e4b5
 *                   dishId:
 *                     type: string
 *                     example: 64a3b2dc410a1db97da1ad22
 *                   userId:
 *                     type: string
 *                     example: 6843b2dc410a1db97da1ad22
 *                   description:
 *                     type: string
 *                     example: "This is a report description"
 *                   checked:
 *                     type: boolean
 *                     example: true
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     example: "2023-06-15T12:34:56.789Z"
 */
Router.route('/').get(
  authMiddleware.authenticateUser,
  authMiddleware.authorizeRole(['admin', 'user']),
  paginationHelper.validatePaginationMiddleware,
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
Router.route('/:id').patch(
  authMiddleware.authenticateUser,
  authMiddleware.authorizeRole(['admin']),
  reportController.updateReport
)

export const reportRoute = Router
