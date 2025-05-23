import Joi from 'joi'
import { GET_DB } from '@/config/mongodb'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '@/utils/validators'

// Define Collection (name & schema)
const _COLLECTION_NAME = 'user'
const _COLLECTION_SCHEMA = Joi.object({
  _id: Joi.string().required(),

  name: Joi.string().required().min(3).max(50).trim().strict(),

  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .trim()
    .strict(),

  password_hash: Joi.string().required().min(10).max(256).trim().strict(),

  role: Joi.string().valid('admin', 'user').required(),

  calorie_limit: Joi.number().integer().min(0).default(2000),

  created_at: Joi.date().timestamp('javascript').default(Date.now),

  updated_at: Joi.date().timestamp('javascript').default(Date.now)
})

// Handle
const getAll = async () => {
  try {
    return await GET_DB().collection(_COLLECTION_NAME).find().toArray()
  } catch (error) {
    throw new Error(error)
  }
}

export const userModel = {
  _COLLECTION_NAME,
  _COLLECTION_SCHEMA,
  getAll
}
