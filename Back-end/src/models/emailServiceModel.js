import Joi from 'joi'
import { GET_DB } from '@/config/mongodb'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '@/utils/validators'
import { ObjectId } from 'mongodb'

const _COLLECTION_NAME = 'emailService'
const _COLLECTION_SCHEMA = Joi.object({
  userId: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE).required(),
  emailVerified: Joi.boolean().default(true),
  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(Date.now)
})

// getByUserId
const getByUserId = async (userId) => {
  try {
    const db = await GET_DB()
    const emailService = db.collection(_COLLECTION_NAME)
    const result = await emailService.findOne({ userId: new ObjectId(userId) })
    return result
  } catch (error) {
    throw new Error('Error fetching email service by user ID')
  }
}

// create 
const createEmailService = async (data) => {
    try {
        const db = await GET_DB()
        const emailService = db.collection(_COLLECTION_NAME)
        const result = await emailService.insertOne(data)
        return result
    } catch (error) {
        throw new Error('Error creating email service')
    }
}

export const emailServiceModel = {
    getByUserId,
    createEmailService,
}