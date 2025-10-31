import Joi from 'joi'
import { GET_DB } from '@/config/mongodb'
import { ObjectId } from 'mongodb'

const _COLLECTION_NAME = 'conversation'

const _COLLECTION_SCHEMA = Joi.object({
  userId: Joi.string().required(),
  lastMessageId: Joi.string().allow(null),
  isRead: Joi.boolean().default(false),
  createdAt: Joi.date().default(Date.now),
  updatedAt: Joi.date().default(Date.now)
})

// Handle
const getAll = async () => {
  try {
    return await GET_DB()
      .collection(_COLLECTION_NAME)
      .aggregate([
        {
          $lookup: {
            from: 'message',
            localField: 'lastMessageId',
            foreignField: '_id',
            as: 'lastMessage'
          }
        },
        {
          $lookup: {
            from: 'user',
            localField: 'userId',
            foreignField: '_id',
            as: 'user'
          }
        },
        {
          $unwind: { path: '$user', preserveNullAndEmptyArrays: true }
        },
        {
          $sort: { updatedAt: -1 }
        },
        {
          $project: {
            _id: 1,
            userId: 1,
            updatedAt: 1,
            isRead: 1,
            'user.username': 1,
            'user.avatar_url': 1,
            lastMessage: { $arrayElemAt: ['$lastMessage', 0] }
          }
        }
      ])
      .toArray()
  } catch (error) {
    throw new Error(error)
  }
}

const getUserConversation = async (conversationId, currentUserId = null) => {
  try {
    const conversation = await GET_DB()
      .collection(_COLLECTION_NAME)
      .aggregate([
        {
          $match: { _id: new ObjectId(conversationId) }
        },
        {
          $lookup: {
            from: 'user',
            localField: 'userId',
            foreignField: '_id',
            as: 'user'
          }
        },
        {
          $unwind: { path: '$user', preserveNullAndEmptyArrays: true }
        },
        {
          $lookup: {
            from: 'message',
            localField: '_id',
            foreignField: 'conversationId',
            as: 'message'
          }
        },
        {
          $unwind: { path: '$lastMessage', preserveNullAndEmptyArrays: true }
        },
        {
          $sort: { createdAt: -1 }
        },
        {
          $project: {
            _id: 1,
            isRead: 1,
            updatedAt: 1,
            'user._id': 1,
            'user.username': 1,
            'user.avatar_url': 1,
            'message._id': 1,
            'message.senderId': 1,
            'message.content': 1,
            'message.status': 1,
            'message.isUpdated': 1,
            'message.isActive': 1,
            'message.createdAt': 1,
            'message.updatedAt': 1
          }
        }
      ])
      .toArray()

    if (!conversation) {
      return null
    }

    return conversation[0]
  } catch (error) {
    throw new Error(error)
  }
}

const getDetails = async (conversationId, currentUserId = null) => {
  try {
    const conversation = await GET_DB()
      .collection(_COLLECTION_NAME)
      .aggregate([
        {
          $match: { _id: new ObjectId(conversationId) }
        },
        {
          $lookup: {
            from: 'user',
            localField: 'userId',
            foreignField: '_id',
            as: 'user'
          }
        },
        {
          $unwind: { path: '$user', preserveNullAndEmptyArrays: true }
        },
        {
          $lookup: {
            from: 'message',
            localField: '_id',
            foreignField: 'conversationId',
            as: 'message'
          }
        },
        {
          $unwind: { path: '$lastMessage', preserveNullAndEmptyArrays: true }
        },
        {
          $sort: { updatedAt: -1 }
        },
        {
          $project: {
            _id: 1,
            isRead: 1,
            lastMessageId: 1,
            createdAt: 1,
            updatedAt: 1,
            'user._id': 1,
            'user.username': 1,
            'user.avatar_url': 1,
            'message._id': 1,
            'message.senderId': 1,
            'message.content': 1,
            'message.status': 1,
            'message.isUpdated': 1,
            'message.isActive': 1,
            'message.updatedAt': 1,
            'message.createdAt': 1
          }
        }
      ])
      .toArray()

    if (!conversation) {
      return null
    }

    return conversation[0]
  } catch (error) {
    throw new Error(error)
  }
}

const getDetailsByUserId = async (userId) => {
  try {
    return await GET_DB()
      .collection(_COLLECTION_NAME)
      .findOne({ userId: new ObjectId(userId) })
  } catch (error) {
    throw new Error(error)
  }
}

const createNew = async (data) => {
  try {
    const createdConversation = await GET_DB().collection(_COLLECTION_NAME).insertOne(data)

    return createdConversation
  } catch (error) {
    throw new Error(error)
  }
}

const update = async (conversationId, isRead) => {
  try {
    const result = await GET_DB()
      .collection(_COLLECTION_NAME)
      .findOneAndUpdate(
        { _id: new ObjectId(conversationId) },
        {
          $set: {
            isRead,
            updatedAt: new Date()
          }
        },
        { returnDocument: 'after' }
      )

    return result
  } catch (error) {
    throw new Error(error)
  }
}

const updateMessage = async (conversationId, lastMessageId, readerId) => {
  try {
    const result = await GET_DB()
      .collection(_COLLECTION_NAME)
      .findOneAndUpdate(
        { _id: new ObjectId(conversationId) },
        {
          $set: {
            lastMessageId: new ObjectId(lastMessageId),
            isRead: readerId ? true : false, //Check admin sent
            updatedAt: new Date()
          }
        },
        { returnDocument: 'after' }
      )

    return result
  } catch (error) {
    throw new Error(error)
  }
}

export const conversationModel = {
  _COLLECTION_NAME,
  _COLLECTION_SCHEMA,
  getAll,
  getUserConversation,
  getDetails,
  getDetailsByUserId,
  createNew,
  update,
  updateMessage
}
