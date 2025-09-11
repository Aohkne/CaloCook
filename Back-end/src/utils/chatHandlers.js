// socket/chatHandlers.js
import { chatService } from '@/services/chatService'
import { getIO } from '@/config/socket'

// Map để lưu trữ user online và socket id
const userSocketMap = new Map()
const socketUserMap = new Map()

export const handleChatEvents = (io) => {
  io.on('connection', (socket) => {
    const user = socket.user
    console.log(`User ${user.username} connected with socket ${socket.id}`)

    // Lưu mapping user-socket
    userSocketMap.set(user._id.toString(), socket.id)
    socketUserMap.set(socket.id, user._id.toString())

    // Join user vào room riêng của họ (để nhận tin nhắn từ admin)
    socket.join(`user_${user._id}`)

    // Nếu là admin, join vào admin room
    if (user.role === 'admin') {
      socket.join('admin_room')
    }

    // Event: User join conversation
    socket.on('join_conversation', (conversationId) => {
      socket.join(`conversation_${conversationId}`)
      console.log(`User ${user.username} joined conversation ${conversationId}`)
    })

    // Event: User leave conversation
    socket.on('leave_conversation', (conversationId) => {
      socket.leave(`conversation_${conversationId}`)
      console.log(`User ${user.username} left conversation ${conversationId}`)
    })

    // Event: Send message
    socket.on('send_message', async (data) => {
      try {
        const { readerId, content, conversationId } = data
        const senderId = user._id.toString()

        // Gọi service để lưu message
        const result = await chatService.sendMessage(readerId, senderId, content)

        // Prepare message data for emit
        const messageData = {
          _id: result.messageId,
          conversationId: result.conversationId,
          senderId: senderId,
          content: content,
          status: 'delivered',
          isUpdated: false,
          createdAt: new Date(),
          sender: {
            _id: user._id,
            username: user.username,
            avatarUrl: user.avatarUrl
          }
        }

        // Emit to conversation room
        if (conversationId) {
          io.to(`conversation_${conversationId}`).emit('new_message', messageData)
        }

        // Emit to specific user (nếu có readerId)
        if (readerId && readerId !== senderId) {
          io.to(`user_${readerId}`).emit('new_message', messageData)
        }

        // Emit to admin room (nếu sender không phải admin)
        if (user.role !== 'admin') {
          io.to('admin_room').emit('new_message', messageData)
        }

        // Confirm message sent
        socket.emit('message_sent', {
          tempId: data.tempId, // Frontend có thể gửi tempId để track
          messageId: result.messageId,
          status: 'sent'
        })
      } catch (error) {
        console.error('Error sending message:', error)
        socket.emit('message_error', {
          tempId: data.tempId,
          error: error.message
        })
      }
    })

    // Event: Update message
    socket.on('update_message', async (data) => {
      try {
        const { messageId, content, conversationId } = data

        const result = await chatService.updateMessage(messageId, content)

        const updatedMessageData = {
          _id: messageId,
          content: content,
          isUpdated: true,
          updatedAt: new Date()
        }

        // Emit to conversation room
        io.to(`conversation_${conversationId}`).emit('message_updated', updatedMessageData)

        socket.emit('message_update_success', { messageId })
      } catch (error) {
        console.error('Error updating message:', error)
        socket.emit('message_error', {
          messageId: data.messageId,
          error: error.message
        })
      }
    })

    // Event: Delete message
    socket.on('delete_message', async (data) => {
      try {
        const { messageId, conversationId } = data

        await chatService.deleteMessage(messageId)

        // Emit to conversation room
        io.to(`conversation_${conversationId}`).emit('message_deleted', {
          messageId,
          deletedAt: new Date()
        })

        socket.emit('message_delete_success', { messageId })
      } catch (error) {
        console.error('Error deleting message:', error)
        socket.emit('message_error', {
          messageId: data.messageId,
          error: error.message
        })
      }
    })

    // Event: Mark messages as read
    socket.on('mark_as_read', async (data) => {
      try {
        const { conversationId } = data

        // Update conversation as read
        await chatService.getDetailsConversation(conversationId, user._id.toString(), true)

        // Emit to conversation room
        io.to(`conversation_${conversationId}`).emit('messages_read', {
          conversationId,
          readBy: user._id,
          readAt: new Date()
        })
      } catch (error) {
        console.error('Error marking as read:', error)
      }
    })

    // Event: User typing
    socket.on('typing', (data) => {
      const { conversationId, isTyping } = data

      socket.to(`conversation_${conversationId}`).emit('user_typing', {
        userId: user._id,
        username: user.username,
        isTyping: isTyping
      })
    })

    // Event: Get online users
    socket.on('get_online_users', () => {
      const onlineUsers = Array.from(userSocketMap.keys())
      socket.emit('online_users', onlineUsers)
    })

    // Event: Disconnect
    socket.on('disconnect', () => {
      console.log(`User ${user.username} disconnected`)

      const userId = socketUserMap.get(socket.id)
      if (userId) {
        userSocketMap.delete(userId)
        socketUserMap.delete(socket.id)
      }

      // Broadcast user offline
      socket.broadcast.emit('user_offline', {
        userId: user._id,
        offlineAt: new Date()
      })
    })

    // Broadcast user online
    socket.broadcast.emit('user_online', {
      userId: user._id,
      username: user.username,
      onlineAt: new Date()
    })
  })
}

// Utility functions
export const getOnlineUsers = () => {
  return Array.from(userSocketMap.keys())
}

export const isUserOnline = (userId) => {
  return userSocketMap.has(userId.toString())
}

export const sendToUser = (userId, event, data) => {
  const socketId = userSocketMap.get(userId.toString())
  if (socketId) {
    const io = getIO()
    io.to(socketId).emit(event, data)
    return true
  }
  return false
}
