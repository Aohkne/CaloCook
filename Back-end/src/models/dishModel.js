import Joi from 'joi'
import { GET_DB } from '@/config/mongodb'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '@/utils/validators'
import { ObjectId } from 'mongodb'

// Define Collection (name & schema)
const _COLLECTION_NAME = 'dish'
const _COLLECTION_SCHEMA = Joi.object({
  name: Joi.string().required().min(3).max(50).trim().strict(),

  cookingTime: Joi.number().integer().min(1).max(10080).default(30),

  calorie: Joi.number().integer().min(1).max(10000).default(100),

  difficulty: Joi.string().valid('easy', 'medium', 'hard').default('medium'),

  description: Joi.string().required().min(10).max(1000).trim().strict(),

  imageUrl: Joi.string().uri().allow('').default(''),

  isActive: Joi.boolean().default(true),

  createdAt: Joi.date().timestamp('javascript').default(Date.now),

  updatedAt: Joi.date().timestamp('javascript').default(Date.now)
})

// Handle
const getAll = async (sortBy = 'createdAt', order = 'asc') => {
  try {
    const sortOrder = order === 'asc' ? 1 : -1
    return await GET_DB()
      .collection(_COLLECTION_NAME)
      .find()
      .sort({ [sortBy]: sortOrder })
      .toArray()
  } catch (error) {
    throw new Error(error)
  }
}

const searchByName = async (name, sortBy = 'createdAt', order = 'asc') => {
  try {
    const sortOrder = order === 'asc' ? 1 : -1
    return await GET_DB()
      .collection(_COLLECTION_NAME)
      .find({ name: { $regex: `^${name}`, $options: 'i' } }) // ^: bắt đầu + i: ko phân biệt hoa thường
      .sort({ [sortBy]: sortOrder })
      .toArray()
  } catch (error) {
    throw new Error(error)
  }
}

const searchByCookingTime = async (condition = {}, sortBy = 'createdAt', order = 'asc') => {
  try {
    const sortOrder = order === 'asc' ? 1 : -1

    return await GET_DB()
      .collection(_COLLECTION_NAME)
      .find({ cookingTime: condition })
      .sort({ [sortBy]: sortOrder })
      .toArray()
  } catch (error) {
    throw new Error(error)
  }
}

const searchByCalorie = async (condition = {}, sortBy = 'createdAt', order = 'asc') => {
  try {
    const sortOrder = order === 'asc' ? 1 : -1

    return await GET_DB()
      .collection(_COLLECTION_NAME)
      .find({ calorie: condition })
      .sort({ [sortBy]: sortOrder })
      .toArray()
  } catch (error) {
    throw new Error(error)
  }
}

const searchByDifficulty = async (difficultyQuery, sortBy = 'createdAt', order = 'asc') => {
  try {
    const sortOrder = order === 'asc' ? 1 : -1

    return await GET_DB()
      .collection(_COLLECTION_NAME)
      .find({ difficulty: difficultyQuery })
      .sort({ [sortBy]: sortOrder })
      .toArray()
  } catch (error) {
    throw new Error(error)
  }
}

const searchByIsActive = async (isActive, sortBy = 'createdAt', order = 'asc') => {
  try {
    const sortOrder = order === 'asc' ? 1 : -1

    const filter = {}
    if (isActive !== undefined) {
      filter.isActive = isActive === 'true'
    }

    return await GET_DB()
      .collection(_COLLECTION_NAME)
      .find(filter)
      .sort({ [sortBy]: sortOrder })
      .toArray()
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

const createNew = async (data) => {
  try {
    const createdDish = await GET_DB().collection(_COLLECTION_NAME).insertOne(data)

    return createdDish
  } catch (error) {
    throw new Error(error)
  }
}

const updateDish = async (dishId, updateData) => {
  try {
    const result = await GET_DB()
      .collection(_COLLECTION_NAME)
      .findOneAndUpdate({ _id: new ObjectId(dishId) }, { $set: updateData }, { returnDocument: 'after' })

    return result
  } catch (error) {
    throw new Error(error)
  }
}

const updateIsActive = async (dishId, isActive) => {
  try {
    const result = await GET_DB()
      .collection(_COLLECTION_NAME)
      .findOneAndUpdate({ _id: new ObjectId(dishId) }, { $set: { isActive } }, { returnDocument: 'after' })

    return result
  } catch (error) {
    throw new Error(error)
  }
}

export const dishModel = {
  _COLLECTION_NAME,
  _COLLECTION_SCHEMA,
  getAll,
  searchByName,
  searchByCookingTime,
  searchByCalorie,
  searchByDifficulty,
  searchByIsActive,
  getDetails,
  createNew,
  updateDish,
  updateIsActive
}
