import express from 'express'
import { chatController } from '@/controllers/chatController'
import { authMiddleware } from '@/middlewares/authMiddleware'

const Router = express.Router()

/**
 * @swagger
 * tags:
 *   name: chat
 *   description: Chat APIs
 */

/**
 * @swagger
 * /api/v1/chat/conversations:
 *   get:
 *     summary: Get all conversations of admin
 *     tags: [chat]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of conversations
 */
Router.route('/conversations').get(
  authMiddleware.authenticateUser,
  authMiddleware.authorizeRole(['admin']),
  chatController.getAllConversation
)

/**
 * @swagger
 * /api/v1/chat/user-conversations:
 *   get:
 *     summary: Get all conversations of current user
 *     tags: [chat]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of conversations
 */
Router.route('/user-conversations').get(
  authMiddleware.authenticateUser,
  authMiddleware.authorizeRole(['user']),
  chatController.getUserConversation
)

/**
 * @swagger
 * /api/v1/chat/conversation:
 *   get:
 *     summary: Get conversation details
 *     tags: [chat]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: conversationId
 *         required: true
 *         schema:
 *           type: string
 *         description: Conversation ID
 *     responses:
 *       200:
 *         description: Conversation details
 */
Router.route('/conversation').get(
  authMiddleware.authenticateUser,
  authMiddleware.authorizeRole(['admin', 'user']),
  chatController.getDetailsConversation
)

/**
 * @swagger
 * /api/v1/chat/message:
 *   post:
 *     summary: Send a new message
 *     tags: [chat]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - readerId
 *               - content
 *             properties:
 *               readerId:
 *                 type: string
 *                 example: "6823456abcd123"
 *               content:
 *                 type: string
 *                 example: "Hello, how are you?"
 *     responses:
 *       201:
 *         description: Message sent successfully
 */
Router.route('/message').post(
  authMiddleware.authenticateUser,
  authMiddleware.authorizeRole(['admin', 'user']),
  chatController.sendMessage
)

/**
 * @swagger
 * /api/v1/chat/message/{messageId}:
 *   put:
 *     summary: Update a message
 *     tags: [chat]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: messageId
 *         required: true
 *         schema:
 *           type: string
 *         description: Message ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 example: "Updated message content"
 *     responses:
 *       200:
 *         description: Message updated successfully
 *   patch:
 *     summary: Delete a message
 *     tags: [chat]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: messageId
 *         required: true
 *         schema:
 *           type: string
 *         description: Message ID
 *     responses:
 *       200:
 *         description: Message deleted successfully
 */
Router.route('/message/:messageId')
  .put(authMiddleware.authenticateUser, authMiddleware.authorizeRole(['admin', 'user']), chatController.updateMessage)
  .patch(authMiddleware.authenticateUser, authMiddleware.authorizeRole(['admin', 'user']), chatController.deleteMessage)

export const chatRoute = Router
