import Joi from 'joi'
import { GET_DB } from '@/config/mongodb'
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

const getAllExistDish = async () => {
  try {
    return await GET_DB().collection(_COLLECTION_NAME).find({ isActive: true }).toArray()
  } catch (error) {
    throw new Error(error)
  }
}

const searchByName = async (name, paginationParams) => {
  try {
    const { skip, limit, sortBy, order } = paginationParams
    const sortObject = createSortObject(sortBy, order)
    const filter = { name: { $regex: name, $options: 'i' } } // ^: bắt đầu + i: ko phân biệt hoa thường

    const [data, totalCount] = await Promise.all([
      GET_DB().collection(_COLLECTION_NAME).find(filter).sort(sortObject).skip(skip).limit(limit).toArray(),
      GET_DB().collection(_COLLECTION_NAME).countDocuments(filter)
    ])

    return { data, totalCount }
  } catch (error) {
    throw new Error(error)
  }
}

const searchByCookingTime = async (condition, paginationParams) => {
  try {
    const { skip, limit, sortBy, order } = paginationParams
    const sortObject = createSortObject(sortBy, order)
    const filter = { cookingTime: condition }

    const [data, totalCount] = await Promise.all([
      GET_DB().collection(_COLLECTION_NAME).find(filter).sort(sortObject).skip(skip).limit(limit).toArray(),
      GET_DB().collection(_COLLECTION_NAME).countDocuments(filter)
    ])

    return { data, totalCount }
  } catch (error) {
    throw new Error(error)
  }
}

const searchByCalorie = async (condition, paginationParams) => {
  try {
    const { skip, limit, sortBy, order } = paginationParams
    const sortObject = createSortObject(sortBy, order)
    const filter = { calorie: condition }

    const [data, totalCount] = await Promise.all([
      GET_DB().collection(_COLLECTION_NAME).find(filter).sort(sortObject).skip(skip).limit(limit).toArray(),
      GET_DB().collection(_COLLECTION_NAME).countDocuments(filter)
    ])

    return { data, totalCount }
  } catch (error) {
    throw new Error(error)
  }
}

const searchByDifficulty = async (difficultyQuery, paginationParams) => {
  try {
    const { skip, limit, sortBy, order } = paginationParams
    const sortObject = createSortObject(sortBy, order)
    const filter = { difficulty: difficultyQuery }

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

const countDish = async () => {
  try {
    return await GET_DB().collection(_COLLECTION_NAME).countDocuments()
  } catch (error) {
    throw new Error(error)
  }
}

const getAllForExport = async (filter = {}, maxLimit = 10000) => {
  try {
    const queryFilter = {}

    if (filter.name) {
      queryFilter.name = { $regex: filter.name, $options: 'i' }
    }

    if (filter.cookingTime) {
      queryFilter.cookingTime = filter.cookingTime
    }

    if (filter.calorie) {
      queryFilter.calorie = filter.calorie
    }

    if (filter.difficulty) {
      queryFilter.difficulty = filter.difficulty
    }

    if (filter.isActive !== undefined) {
      queryFilter.isActive = filter.isActive
    }

    const dishes = await GET_DB()
      .collection(_COLLECTION_NAME)
      .find(queryFilter, { projection: { imageUrl: 0 } })
      .limit(maxLimit)
      .toArray()

    return dishes
  } catch (error) {
    throw new Error(error)
  }
}

export const dishModel = {
  _COLLECTION_NAME,
  _COLLECTION_SCHEMA,
  getAll,
  getAllExistDish,
  searchByName,
  searchByCookingTime,
  searchByCalorie,
  searchByDifficulty,
  searchByIsActive,
  getDetails,
  createNew,
  updateDish,
  updateIsActive,
  countDish,
  getAllForExport
}
