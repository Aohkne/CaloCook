import { StatusCodes } from 'http-status-codes'
import { chatService } from '@/services/chatService'

const getAllConversation = async (req, res, next) => {
  try {
    const result = await chatService.getAllConversation()

    // Socket.IO instance
    const io = req.app.get('socketio')

    // Emit to admin room for real-time conversation list updates
    if (io) {
      io.to('admin_room').emit('conversations_fetched', {
        type: 'all_conversations',
        count: result.length,
        timestamp: new Date()
      })
    }

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

    // Socket.IO instance
    const io = req.app.get('socketio')

    // Emit user activity and conversation access
    if (io && result) {
      const seenData = {
        messageId: result.lastMessageId,
        status: 'seen',
        updatedAt: new Date()
      }

      // Emit to conversation participants
      if (result._id) {
        io.to(`conversation_${result._id}`).emit('messages_seen', seenData)
      }

      // Also emit to admin room and user room
      io.to('admin_room').emit('messages_seen', seenData)
      io.to(`user_${result?.user._id}`).emit('messages_seen', seenData)
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

    // Socket.IO instance
    const io = req.app.get('socketio')

    const result = await chatService.sendMessage(readerId, senderId, content)

    // Socket handle
    if (io) {
      // Determine who should receive the message
      const receiverId = readerId || (result.conversation?.userId !== senderId ? result.conversation?.userId : null)

      // Message data: for real-time emission
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
      // Send to specific user if readerId exists (admin -> user)
      if (receiverId) {
        io.to(`user_${receiverId}`).emit('new_message', messageData)
      }

      // Send to admin room (assuming admin role monitoring)
      io.to('admin_room').emit('new_message', messageData)

      // Send back to sender for confirmation
      io.to(`user_${senderId}`).emit('message_sent', messageData)
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

    const currentUserId = req.user._id

    // Socket.IO instance
    const io = req.app.get('socketio')

    const result = await chatService.updateMessage(messageId, content)

    // Emit message update in real-time
    if (io && result) {
      const updateData = {
        messageId: messageId,
        content: content,
        isUpdated: true,
        updatedAt: result.updatedAt
      }

      io.to(`user_${currentUserId}`).emit('message_updated', updateData)

      // Also emit to admin room and user room
      io.to('admin_room').emit('message_updated', updateData)
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

    // Socket.IO instance
    const io = req.app.get('socketio')

    const result = await chatService.deleteMessage(messageId)

    // Emit message deletion in real-time
    if (io && result) {
      const deleteData = {
        messageId: messageId,
        isActive: false,
        updatedAt: new Date()
      }

      // Emit to conversation participants
      if (result.conversationId) {
        io.to(`conversation_${result.conversationId}`).emit('message_deleted', deleteData)
      }

      // Also emit to admin room and user room
      io.to('admin_room').emit('message_deleted', deleteData)
      io.to(`user_${result.senderId}`).emit('message_deleted', deleteData)
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
