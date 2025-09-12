import { StatusCodes } from 'http-status-codes'
import { chatService } from '@/services/chatService'
import { socketHelper } from '@/utils/socketHelper'

const getAllConversation = async (req, res, next) => {
  try {
    const result = await chatService.getAllConversation()

    // SOCKET
    // EMIT: conversation updates to admin
    socketHelper.chat.emitConversationUpdate(result)

    res.status(StatusCodes.OK).json({
      code: StatusCodes.OK,
      message: 'Get conversations successfully',
      data: result
    })
  } catch (error) {
    next(error)
  }
}

const getUserConversation = async (req, res, next) => {
  try {
    const userId = req.user._id

    const result = await chatService.getUserConversation(userId)

    res.status(StatusCodes.OK).json({
      code: StatusCodes.OK,
      message: 'Get conversations successfully',
      data: result
    })
  } catch (error) {
    next(error)
  }
}

const getDetailsConversation = async (req, res, next) => {
  try {
    const { conversationId } = req.query
    const currentUserId = req.user._id

    const result = await chatService.getDetailsConversation(conversationId, currentUserId)

    // SOCKET
    if (result) {
      const seenData = {
        messageId: result.lastMessageId,
        status: 'seen',
        updatedAt: new Date()
      }
      // EMIT: messages seen status
      socketHelper.chat.emitMessagesSeen(seenData, result._id, result?.user._id)
    }

    res.status(StatusCodes.OK).json({
      code: StatusCodes.OK,
      message: 'Get conversation details successfully',
      data: result
    })
  } catch (error) {
    next(error)
  }
}

const sendMessage = async (req, res, next) => {
  try {
    const { readerId, content } = req.body

    const senderId = req.user._id

    const result = await chatService.sendMessage(readerId, senderId, content)

    // SOCKET
    const receiverId = readerId || (result?.userId !== senderId ? result?.userId.toString() : null)

    const messageData = {
      _id: result.messageId,
      conversationId: result.conversationId,
      senderId: senderId,
      content: content,
      status: result.status || 'delivered',
      isUpdated: false,
      isActive: true,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt
    }

    // EMIT: new message to relevant rooms
    socketHelper.chat.emitNewMessage(messageData, receiverId)

    // Update admin conversations
    if (result) {
      const updatedConversations = await chatService.getAllConversation()

      // EMIT: conversations list update to admin
      socketHelper.chat.emitConversationsUpdate(updatedConversations)
    }

    res.status(StatusCodes.CREATED).json({
      code: StatusCodes.CREATED,
      message: 'Send message successfully',
      data: result
    })
  } catch (error) {
    next(error)
  }
}

const updateMessage = async (req, res, next) => {
  try {
    const { messageId } = req.params
    const { content } = req.body

    // const currentUserId = req.user._id

    const result = await chatService.updateMessage(messageId, content)

    // SOCKET
    if (result) {
      const updateData = {
        messageId: messageId,
        content: content,
        isUpdated: true,
        updatedAt: result.updatedAt
      }
      // EMIT: message update
      socketHelper.chat.emitMessageUpdate(updateData, result?.userId.toString())

      // Update admin conversations
      if (result) {
        const updatedConversations = await chatService.getAllConversation()

        // EMIT: conversations list update to admin
        socketHelper.chat.emitConversationsUpdate(updatedConversations)
      }
    }

    res.status(StatusCodes.OK).json({
      code: StatusCodes.OK,
      message: 'Update message successfully',
      data: result
    })
  } catch (error) {
    next(error)
  }
}

const deleteMessage = async (req, res, next) => {
  try {
    const { messageId } = req.params

    const result = await chatService.deleteMessage(messageId)

    // SOCKET
    if (result) {
      const deleteData = {
        messageId: messageId,
        isActive: false,
        updatedAt: new Date()
      }
      // EMIT: message deletion
      socketHelper.chat.emitMessageDelete(deleteData, result.conversationId, result?.userId.toString())

      // Update admin conversations
      if (result) {
        const updatedConversations = await chatService.getAllConversation()

        // EMIT: conversations list update to admin
        socketHelper.chat.emitConversationsUpdate(updatedConversations)
      }
    }

    res.status(StatusCodes.OK).json({
      code: StatusCodes.OK,
      message: 'Delete message successfully',
      data: result
    })
  } catch (error) {
    next(error)
  }
}

export const chatController = {
  getAllConversation,
  getUserConversation,
  getDetailsConversation,
  sendMessage,
  updateMessage,
  deleteMessage
}
