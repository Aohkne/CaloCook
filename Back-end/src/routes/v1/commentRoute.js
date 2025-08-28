import express from 'express'
import { authMiddleware } from '@/middlewares/authMiddleware'
import { commentController } from '@/controllers/commentController'
import { paginationHelper } from '@/utils/pagination'
import { commentValidation } from '@/validations/commentValidation'

const Router = express.Router()

/**
 * @swagger
 * /api/v1/comment:
 *  get:
 *    summary: Get all comments
 *    tags: [Comment]
 *    security:
 *      - bearerAuth: []
 *    description: Retrieve a list of all comments
 *    responses:
 *      200:
 *        description: A list of comments
 *        content:
 *          application/json:
 *           schema:
 *             type: object
 *             properties:
 *               code:
 *                 type: integer
 *                 example: 200
 *               message:
 *                 type: string
 *                 example: "Comments retrieved successfully"
 *               data:
 *                 type: array
 *                 properties:
 *                   _id:
 *                      type: string
 *                      example: "68adc41072effd308d4ecfc5"
 *                   dishId:
 *                      type: string
 *                      example: "68adc41072effd308d4ecfc6"
 *                   userId:
 *                      type: string
 *                      example: "6843b2dc410a1db97da1ad22"
 *                   content:
 *                      type: string
 *                      example: "This is a comment"
 *                   parentId:
 *                      type: string
 *                      example: "68adc41072effd308d4ecfc5"
 *                   image:
 *                      type: string
 *                      example: "https://example.com/image.jpg"
 *                   createdAt:
 *                      type: string
 *                      format: date-time
 *                      example: "2023-06-15T12:34:56.789Z"
 *
 *  post:
 *    summary: Create a new comment
 *    tags: [Comment]
 *    security:
 *      - bearerAuth: []
 *    description: Create a new comment
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            # don't include optional props in `required`
 *            properties:
 *              dishId:
 *                type: string
 *                example: "64a3b2dc410a1db97da1ad22"
 *              content:
 *                type: string
 *                description: "Comment text; can be empty string or null"
 *                nullable: true
 *                example: "This is a comment"
 *              parentId:
 *                type: string
 *                description: "Optional parent comment id; empty string or null if none"
 *                nullable: true
 *                example: ""
 *              image:
 *               type: string
 *               description: "Optional image URL; empty string if none"
 *               nullable: true
 *               format: uri
 *               example: ""
 *    responses:
 *      201:
 *        description: Comment created successfully
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                code:
 *                  type: integer
 *                  example: 201
 *                message:
 *                  type: string
 *                  example: "Comment created successfully"
 *                data:
 *                  type: object
 *                  properties:
 *                    _id:
 *                      type: string
 *                      example: "68adc41072effd308d4ecfc5"
 *                    dishId:
 *                      type: string
 *                      example: "64a3b2dc410a1db97da1ad22"
 *                    userId:
 *                      type: string
 *                      example: "68306f4d4928f3fe108df628"
 *                    content:
 *                      type: string
 *                      example: "This is a comment"
 *                    parentId:
 *                      type: string
 *                      example: "68adc41072effd308d4ecfc5"
 *                    image:
 *                      type: string
 *                      example: "https://example.com/image.jpg"
 *                    createdAt:
 *                      type: string
 *                      format: date-time
 *                      example: "2023-06-15T12:34:56.789Z"
 

 * /api/v1/comment/{id}:
 *   get:
 *     summary: Get a comment by ID
 *     tags: [Comment]
 *     security:
 *       - bearerAuth: []
 *     description: Get a comment by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the comment to retrieve
 *         schema:
 *           type: string
 *           example: "68adc41072effd308d4ecfc5"
 *     responses:
 *       200:
 *         description: Comment retrieved successfully
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
 *                   example: "Comment retrieved successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "68adcc2d9b25248d3c9bb695"
 *                     dishId:
 *                       type: string
 *                       example: "64a3b2dc410a1db97da1ad22"
 *                     userId:
 *                       type: string
 *                       example: "68306f4d4928f3fe108df628"
 *                     content:
 *                       type: string
 *                       example: "This is a comment"
 *                     parentId:
 *                       type: string
 *                       example: "68adc41072effd308d4ecfc5"
 *                     image:
 *                       type: string
 *                       example: ""
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2023-06-15T12:34:56.789Z"
 * 
 *   patch:
 *    summary: Update a comment by ID
 *    tags: [Comment]
 *    security:
 *      - bearerAuth: []
 *    description: Update content of comment by ID
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        description: The ID of the comment to update
 *        schema:
 *          type: string
 *          example: "68adc41072effd308d4ecfc5"
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              content:
 *                type: string
 *                example: "This is an updated comment"
 *    responses:
 *      200:
 *        description: Comment updated successfully
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                code:
 *                  type: integer
 *                  example: 200
 *                message:
 *                  type: string
 *                  example: "Comment updated successfully"
 *                data:
 *                  type: object
 *                  properties:
 *                    _id:
 *                      type: string
 *                      example: "68adcc2d9b25248d3c9bb695"
 *                    dishId:
 *                      type: string
 *                      example: "64a3b2dc410a1db97da1ad22"
 *                    userId:
 *                      type: string
 *                      example: "68306f4d4928f3fe108df628"
 *                    content:
 *                      type: string
 *                      example: "This is an updated comment"
 *                    parentId:
 *                      type: string
 *                      example: "68adc41072effd308d4ecfc5"
 *                    image:
 *                      type: string
 *                      example: "https://example.com/image.jpg"
 *                    createdAt:
 *                      type: string
 *                      format: date-time
 *                      example: "2023-06-15T12:34:56.789Z"
 *
 *   delete:
 *    summary: Delete comment by ID
 *    tags: [Comment]
 *    security:
 *      - bearerAuth: []
 *    description: Delete comment by ID
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        description: The ID of the comment to delete
 *        schema:
 *          type: string
 *          example: "68adcc2d9b25248d3c9bb695"
 *    responses:
 *      200:
 *        description: Comment deleted successfully
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                code:
 *                  type: integer
 *                  example: 200
 *                message:
 *                  type: string
 *                  example: "Comment deleted successfully"
 *                data:
 *                  type: object
 *                  properties:
 *                    _id:
 *                      type: string
 *                      example: "68adcc2d9b25248d3c9bb695"
 *                    dishId:
 *                      type: string
 *                      example: "64a3b2dc410a1db97da1ad22"
 *                    userId:
 *                      type: string
 *                      example: "68306f4d4928f3fe108df628"
 *                    content:
 *                      type: string
 *                      example: "This is a comment"
 *                    parentId:
 *                      type: string
 *                      example: "68adc41072effd308d4ecfc5"
 *                    image:
 *                      type: string
 *                      example: "https://example.com/image.jpg"
 *                    createdAt:
 *                      type: string
 *                      format: date-time
 *                      example: "2023-06-15T12:34:56.789Z"
 *
 * /api/v1/comment/{id}/comments:
 *   get:
 *     summary: Get all comments for a specific comment
 *     tags: [Comment]
 *     security:
 *       - bearerAuth: []
 *     description: Get all comments for a specific comment
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the comment to retrieve replies for
 *         schema:
 *           type: string
 *           example: "68adc41072effd308d4ecfc5"
 *     responses:
 *       200:
 *         description: Comments retrieved successfully
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
 *                   example: "Comments retrieved successfully"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: "68adcc2d9b25248d3c9bb695"
 *                       dishId:
 *                         type: string
 *                         example: "64a3b2dc410a1db97da1ad22"
 *                       userId:
 *                         type: string
 *                         example: "68306f4d4928f3fe108df628"
 *                       content:
 *                         type: string
 *                         example: "This is a comment"
 *                       parentId:
 *                         type: string
 *                         example: "68adc41072effd308d4ecfc5"
 *                       image:
 *                         type: string
 *                         example: ""
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2023-06-15T12:34:56.789Z"
 * 
 * /api/v1/comment/{dishId}/dish:
 *  get:
 *    summary: Get all comments for a specific dish
 *    tags: [Comment]
 *    security:
 *      - bearerAuth: []
 *    description: Get all comments for a specific dish
 *    parameters:
 *      - in: path
 *        name: dishId
 *        required: true
 *        description: The ID of the dish to retrieve comments for
 *        schema:
 *          type: string
 *          example: "64a3b2dc410a1db97da1ad22"
 *    responses:
 *      200:
 *        description: Comments retrieved successfully
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                code:
 *                  type: integer
 *                  example: 200
 *                message:
 *                  type: string
 *                  example: "Comments retrieved successfully"
 *                data:
 *                  type: array
 *                  items:
 *                    type: object
 *                    properties:
 *                      _id:
 *                        type: string
 *                        example: "68adcc2d9b25248d3c9bb695"
 *                      dishId:
 *                        type: string
 *                        example: "64a3b2dc410a1db97da1ad22"
 *                      userId:
 *                        type: string
 *                        example: "68306f4d4928f3fe108df628"
 *                      content:
 *                        type: string
 *                        example: "This is a comment"
 *                      parentId:
 *                        type: string
 *                        example: "68adc41072effd308d4ecfc5"
 *                      image:
 *                        type: string
 *                        example: "https://example.com/image.jpg"
 *                      createdAt:
 *                        type: string
 *                        format: date-time
 *                        example: "2023-06-15T12:34:56.789Z"
 */

// Get all comments
Router.route('/').get(
  authMiddleware.authenticateUser,
  authMiddleware.authorizeRole(['admin', 'user']),
  commentController.getAllComments
)

// Create a new comment
Router.route('/').post(
  authMiddleware.authenticateUser,
  authMiddleware.authorizeRole(['admin', 'user']),
  commentValidation.createComment,
  commentController.createComment
)

// Get a comment by ID
Router.route('/:id').get(
  authMiddleware.authenticateUser,
  authMiddleware.authorizeRole(['admin', 'user']),
  commentController.getCommentById
)

// lấy những thằng đã comment, comment này
Router.route('/:id/comments').get(
  authMiddleware.authenticateUser,
  authMiddleware.authorizeRole(['admin', 'user']),
  commentController.getCommentsByParentId
)

// Get a comment by dishId
Router.route('/:dishId/dish').get(
  authMiddleware.authenticateUser,
  authMiddleware.authorizeRole(['admin', 'user']),
  commentController.getCommentsByDishId
)

// Update a comment by ID
Router.route('/:id').patch(
  authMiddleware.authenticateUser,
  authMiddleware.authorizeRole(['admin', 'user']),
  commentValidation.updateComment,
  commentController.updateCommentById
)

// Delete a comment by ID
Router.route('/:id').delete(
  authMiddleware.authenticateUser,
  authMiddleware.authorizeRole(['admin', 'user']),
  commentController.deleteCommentById
)

export const commentRoute = Router
