import { StatusCodes } from 'http-status-codes'
import { ObjectId } from 'mongodb'
import ApiError from '@/utils/ApiError'

import { conversationModel } from '@/models/conversationModel'
import { messageModel } from '@/models/messageModel'

const getAllConversation = async () => {
  try {
    const result = await conversationModel.getAll()

    if (!result || result.length === 0) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Conversation not found!')
    }
    return result
  } catch (error) {
    throw error
  }
}

const getUserConversation = async (userId, isRead = true) => {
  try {
    const conversation = await conversationModel.getDetailsByUserId(userId)

    if (!conversation || conversation.length === 0) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Conversation not found!')
    }

    const result = await conversationModel.getUserConversation(conversation._id, userId)

    if (result) {
      // 1. Update read conversation
      await conversationModel.update(conversation._id, isRead)

      // 2. Update seen message
      if (conversation.lastMessageId) {
        await messageModel.updateMessage(new ObjectId(conversation.lastMessageId), 'seen')
      }
    }

    return result
  } catch (error) {
    throw error
  }
}

const getDetailsConversation = async (conversationId, currentUserId, isRead = true) => {
  try {
    await conversationModel.update(conversationId, isRead)

    const conversation = await conversationModel.getDetails(conversationId, currentUserId)

    if (!conversation) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Conversation not found!')
    }

    if (conversation.lastMessageId) {
      await messageModel.updateMessage(new ObjectId(conversation.lastMessageId), 'seen')
    }

    return conversation
  } catch (error) {
    throw error
  }
}

const sendMessage = async (readerId, senderId, content) => {
  try {
    // If readerId -> senderId = admin
    const userId = readerId || senderId

    // 1. Find conversation theo userId
    let conversation = await conversationModel.getDetailsByUserId(userId)

    // 2. Create conversation
    if (!conversation) {
      const convData = {
        userId: new ObjectId(userId),
        lastMessageId: null,
        isRead: false,
        createdAt: new Date(),
        updatedAt: new Date()
      }
      const conv = await conversationModel.createNew(convData)
      conversation = { ...convData, _id: new ObjectId(conv.insertedId) }
    }

    // 3. Create message
    const messageData = {
      conversationId: new ObjectId(conversation._id),
      senderId, //  (admin hoặc user)
      content,
      status: 'sent',
      isUpdated: false,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    const mess = await messageModel.createNew(messageData)

    // 4. Update lastMessageId
    await conversationModel.updateMessage(new ObjectId(conversation._id), new ObjectId(mess.insertedId))

    // 5. Update status
    await messageModel.updateMessage(new ObjectId(mess.insertedId), 'delivered')

    return {
      conversationId: new ObjectId(conversation._id),
      messageId: mess.insertedId,
      ...messageData
    }
  } catch (error) {
    throw error
  }
}

const updateMessage = async (messageId, content, isUpdate = true) => {
  try {
    const mess = await messageModel.update(messageId, content, isUpdate)

    const messageData = await messageModel.getDetails(mess.insertedId)

    return {
      ...messageData
    }
  } catch (error) {
    throw error
  }
}

const deleteMessage = async (messageId) => {
  try {
    const result = await messageModel.updateIsActive(messageId, false)
    if (!result) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Message not found!')
    }
    return result
  } catch (error) {
    throw error
  }
}

export const chatService = {
  getAllConversation,
  getUserConversation,
  getDetailsConversation,
  sendMessage,
  updateMessage,
  deleteMessage
}
