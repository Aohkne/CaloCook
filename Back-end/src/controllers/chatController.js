import { StatusCodes } from 'http-status-codes'
import { chatService } from '@/services/chatService'

const getAllConversation = async (req, res, next) => {
  try {
    const result = await chatService.getAllConversation()

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

    const result = await chatService.updateMessage(messageId, content)

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
