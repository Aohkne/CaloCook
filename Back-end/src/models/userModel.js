import Joi from 'joi'
import { GET_DB } from '@/config/mongodb'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '@/utils/validators'
import { ObjectId } from 'mongodb'

// Define Collection (name & schema)
const _COLLECTION_NAME = 'user'
const _COLLECTION_SCHEMA = Joi.object({
  _id: Joi.string().required(),

  username: Joi.string().required().min(3).max(50).trim().strict(),

  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .trim()
    .strict(),

  password_hash: Joi.string().required().min(10).max(256).trim().strict(),

  role: Joi.string().valid('admin', 'user').required(),

  calorieLimit: Joi.number().integer().min(0).default(2000),

  avatarUrl: Joi.string().uri().allow('').default(''),

  gender: Joi.string().valid('male', 'female').default('male'),

  dob: Joi.date().iso().allow(null).default(null),

  height: Joi.number().min(30).max(300).allow(null).default(null), // cm

  weight: Joi.number().min(1).max(500).allow(null).default(null), // kg

  isActive: Joi.boolean().default(true),

  createdAt: Joi.date().timestamp('javascript').default(Date.now),

  updatedAt: Joi.date().timestamp('javascript').default(Date.now)
})

// Handle
const getAll = async () => {
  try {
    return await GET_DB().collection(_COLLECTION_NAME).find().toArray()
  } catch (error) {
    throw new Error(error)
  }
}
const findOne = async (filter) => {
  return await GET_DB().collection(_COLLECTION_NAME).findOne(filter)
}
const findById = async (id) => {
  return await GET_DB()
    .collection(_COLLECTION_NAME)
    .findOne({ _id: new ObjectId(id) })
}
const create = async (data) => {
  return await GET_DB().collection(_COLLECTION_NAME).insertOne(data)
}

const updateOne = async (filter, updateDoc) => {
  return await GET_DB().collection(_COLLECTION_NAME).updateOne(filter, updateDoc)
}

export const userModel = {
  _COLLECTION_NAME,
  _COLLECTION_SCHEMA,
  getAll,
  findOne,
  create,
  findById,
  updateOne
}
