import Joi from 'joi'
import { GET_DB } from '@/config/mongodb'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '@/utils/validators'
import { ObjectId } from 'mongodb'

// Define Collection (name & schema)
const _COLLECTION_NAME = 'user'
const _COLLECTION_SCHEMA = Joi.object({
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

// Sort object
const createSortObject = (sortBy, order) => {
  const sortOrder = order === 'asc' ? 1 : -1
  return { [sortBy]: sortOrder }
}

// Handle
const getAll = async (paginationParams) => {
  try {
    const { skip, limit, sortBy, order } = paginationParams
    const sortObject = createSortObject(sortBy, order)

    const [data, totalCount] = await Promise.all([
      GET_DB().collection(_COLLECTION_NAME).find().sort(sortObject).skip(skip).limit(limit).toArray(),
      GET_DB().collection(_COLLECTION_NAME).countDocuments()
    ])

    return { data, totalCount }
  } catch (error) {
    throw new Error(error)
  }
}

const searchByUsername = async (username, paginationParams) => {
  try {
    const { skip, limit, sortBy, order } = paginationParams
    const sortObject = createSortObject(sortBy, order)
    const filter = { username: { $regex: `^${username}`, $options: 'i' } } // ^: bắt đầu + i: ko phân biệt hoa thường

    const [data, totalCount] = await Promise.all([
      GET_DB().collection(_COLLECTION_NAME).find(filter).sort(sortObject).skip(skip).limit(limit).toArray(),
      GET_DB().collection(_COLLECTION_NAME).countDocuments(filter)
    ])

    return { data, totalCount }
  } catch (error) {
    throw new Error(error)
  }
}

const searchByEmail = async (email, paginationParams) => {
  try {
    const { skip, limit, sortBy, order } = paginationParams
    const sortObject = createSortObject(sortBy, order)
    const filter = { email: { $regex: `^${email}`, $options: 'i' } }

    const [data, totalCount] = await Promise.all([
      GET_DB().collection(_COLLECTION_NAME).find(filter).sort(sortObject).skip(skip).limit(limit).toArray(),
      GET_DB().collection(_COLLECTION_NAME).countDocuments(filter)
    ])

    return { data, totalCount }
  } catch (error) {
    throw new Error(error)
  }
}

const searchByIsActive = async (isActive, paginationParams) => {
  try {
    const { skip, limit, sortBy, order } = paginationParams
    const sortObject = createSortObject(sortBy, order)

    const filter = {}
    if (isActive !== undefined) {
      filter.isActive = isActive === 'true'
    }

    const [data, totalCount] = await Promise.all([
      GET_DB().collection(_COLLECTION_NAME).find(filter).sort(sortObject).skip(skip).limit(limit).toArray(),
      GET_DB().collection(_COLLECTION_NAME).countDocuments(filter)
    ])

    return { data, totalCount }
  } catch (error) {
    throw new Error(error)
  }
}

const getDetails = async (id) => {
  try {
    return await GET_DB()
      .collection(_COLLECTION_NAME)
      .findOne({ _id: new ObjectId(id) })
  } catch (error) {
    throw new Error(error)
  }
}

const updateIsActive = async (userId, isActive) => {
  try {
    const result = await GET_DB()
      .collection(_COLLECTION_NAME)
      .findOneAndUpdate({ _id: new ObjectId(userId) }, { $set: { isActive } }, { returnDocument: 'after' })

    return result
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

// dem so luong nguoi dung
const countUsers = async (role) => {
  return await GET_DB().collection(_COLLECTION_NAME).countDocuments({ role })
}

export const userModel = {
  _COLLECTION_NAME,
  _COLLECTION_SCHEMA,
  getAll,
  searchByUsername,
  searchByEmail,
  searchByIsActive,
  getDetails,
  updateIsActive,
  findOne,
  findById,
  create,
  updateOne,
  countUsers
}
