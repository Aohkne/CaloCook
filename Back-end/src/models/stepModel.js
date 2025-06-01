import Joi from 'joi'
import { GET_DB } from '@/config/mongodb'
import { ObjectId } from 'mongodb'

// Define Collection (name & schema)
const _COLLECTION_NAME = 'step'
const _COLLECTION_SCHEMA = Joi.object({
  dishId: Joi.string().required().length(24).hex(),

  stepNumber: Joi.number().required().min(1).max(100),

  description: Joi.string().required().min(1).max(50).trim(),

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

const getDetails = async (id) => {
  try {
    return await GET_DB()
      .collection(_COLLECTION_NAME)
      .findOne({ _id: new ObjectId(id) })
  } catch (error) {
    throw new Error(error)
  }
}

const getDetailsByDishId = async (dishId, sortBy = 'stepNumber', order = 'asc') => {
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
    const createdStep = await GET_DB().collection(_COLLECTION_NAME).insertOne(data)

    return createdStep
  } catch (error) {
    throw new Error(error)
  }
}

const updateStep = async (stepId, updateData) => {
  try {
    const result = await GET_DB()
      .collection(_COLLECTION_NAME)
      .findOneAndUpdate({ _id: new ObjectId(stepId) }, { $set: updateData }, { returnDocument: 'after' })

    return result
  } catch (error) {
    throw new Error(error)
  }
}

const updateIsActive = async (stepId, isActive) => {
  try {
    const result = await GET_DB()
      .collection(_COLLECTION_NAME)
      .findOneAndUpdate({ _id: new ObjectId(stepId) }, { $set: { isActive } }, { returnDocument: 'after' })

    return result
  } catch (error) {
    throw new Error(error)
  }
}

export const stepModel = {
  _COLLECTION_NAME,
  _COLLECTION_SCHEMA,
  getAll,
  getDetails,
  getDetailsByDishId,
  searchByIsActive,
  createNew,
  updateStep,
  updateIsActive
}
