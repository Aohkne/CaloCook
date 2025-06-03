import Joi from 'joi'
import { GET_DB } from '@/config/mongodb'
import { ObjectId } from 'mongodb'

// Define Collection (name & schema)
const _COLLECTION_NAME = 'ingredient'
const _COLLECTION_SCHEMA = Joi.object({
  dishId: Joi.string().required().length(24).hex(),

  name: Joi.string().required().min(1).max(100).trim(),

  quantity: Joi.string().required().min(1).max(50).trim(),

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
      .find({ name: { $regex: `^${name}`, $options: 'i' } })
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

const createNew = async (data) => {
  try {
    const createdIngredient = await GET_DB().collection(_COLLECTION_NAME).insertOne(data)

    return createdIngredient
  } catch (error) {
    throw new Error(error)
  }
}

const updateIngredient = async (ingredientId, updateData) => {
  try {
    const result = await GET_DB()
      .collection(_COLLECTION_NAME)
      .findOneAndUpdate({ _id: new ObjectId(ingredientId) }, { $set: updateData }, { returnDocument: 'after' })

    return result
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

const getDetailsByDishId = async (dishId, sortBy = 'createdAt', order = 'asc') => {
  try {
    const sortOrder = order === 'asc' ? 1 : -1

    return await GET_DB()
      .collection(_COLLECTION_NAME)
      .find({ dishId: new ObjectId(dishId) })
      .sort({ [sortBy]: sortOrder })
      .toArray()
  } catch (error) {
    throw new Error(error)
  }
}

const updateIsActive = async (ingredientId, isActive) => {
  try {
    const result = await GET_DB()
      .collection(_COLLECTION_NAME)
      .findOneAndUpdate({ _id: new ObjectId(ingredientId) }, { $set: { isActive } }, { returnDocument: 'after' })

    return result
  } catch (error) {
    throw new Error(error)
  }
}

export const ingredientModel = {
  _COLLECTION_NAME,
  _COLLECTION_SCHEMA,
  getAll,
  searchByName,
  searchByIsActive,
  getDetails,
  getDetailsByDishId,
  createNew,
  updateIngredient,
  updateIsActive
}
