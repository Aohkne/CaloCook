import Joi from 'joi'
import { GET_DB } from '@/config/mongodb'
import { ObjectId } from 'mongodb'

const _COLLECTION_NAME = 'message'

const _COLLECTION_SCHEMA = Joi.object({
  conversationId: Joi.string().required(),
  senderId: Joi.string().required(),
  content: Joi.string().required().min(1).max(10000),
  status: Joi.string().valid('sent', 'delivered', 'seen').default('sent'),
  isUpdated: Joi.boolean().default(false),
  isActive: Joi.boolean().default(true),
  createdAt: Joi.date().default(Date.now),
  updatedAt: Joi.date().default(Date.now)
})

// Handle

const getDetails = async (messageId) => {
  try {
    return await GET_DB()
      .collection(_COLLECTION_NAME)
      .findOne({ _id: new ObjectId(messageId) })
  } catch (error) {
    throw new Error(error)
  }
}

const createNew = async (data) => {
  try {
    const createdMessage = await GET_DB().collection(_COLLECTION_NAME).insertOne(data)

    return createdMessage
  } catch (error) {
    throw new Error(error)
  }
}

const update = async (messageId, content, isUpdate = true) => {
  try {
    const result = await GET_DB()
      .collection(_COLLECTION_NAME)
      .findOneAndUpdate(
        { _id: new ObjectId(messageId) },
        {
          $set: {
            content,
            status: 'delivered',
            isUpdated: isUpdate,
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

const updateMessage = async (messageId, status) => {
  try {
    const result = await GET_DB()
      .collection(_COLLECTION_NAME)
      .findOneAndUpdate(
        { _id: new ObjectId(messageId) },
        {
          $set: {
            status,
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

const updateIsActive = async (messageId, isActive) => {
  try {
    const result = await GET_DB()
      .collection(_COLLECTION_NAME)
      .findOneAndUpdate(
        { _id: new ObjectId(messageId) },
        {
          $set: {
            isActive,
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

const updateStatusBulk = async (conversationId, status, excludeMessageId = null) => {
  try {
    const filter = {
      conversationId: conversationId.toString(),
      isActive: true
    }

    if (excludeMessageId) {
      filter._id = { $ne: new ObjectId(excludeMessageId) }
    }

    const result = await GET_DB()
      .collection(_COLLECTION_NAME)
      .updateMany(filter, {
        $set: {
          status,
          updatedAt: new Date()
        }
      })

    return result
  } catch (error) {
    throw new Error(error)
  }
}

export const messageModel = {
  _COLLECTION_NAME,
  _COLLECTION_SCHEMA,
  getDetails,
  createNew,
  update,
  updateMessage,
  updateIsActive,
  updateStatusBulk
}
