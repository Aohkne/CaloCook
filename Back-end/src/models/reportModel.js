import Joi from 'joi'
import { GET_DB } from '@/config/mongodb'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '@/utils/validators'
import { ObjectId } from 'mongodb'

const _COLLECTION_NAME = 'report'
const _COLLECTION_SCHEMA = Joi.object({
  dishId: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE).required(),
  userId: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE).required(),
  description: Joi.string().max(10000).min(10).required(),
  createdAt: Joi.date().timestamp('javascript').default(Date.now)
})

// Enhanced sort object with validation
const createSortObject = (sortBy = 'createdAt', order = 'desc') => {
  const sortOrder = order === 'asc' ? 1 : -1

  // Validate sortBy field for reports
  const allowedSortFields = ['createdAt', 'updatedAt', 'description']
  const validSortBy = allowedSortFields.includes(sortBy) ? sortBy : 'createdAt'

  return { [validSortBy]: sortOrder }
}

// getAll với sort hoàn thiện
const getAllReports = async (params = {}) => {
  try {
    const db = await GET_DB()

    const page = Math.max(1, Number(params.page) || 1)
    const limit = Math.max(1, Math.min(100, Number(params.limit) || 10))
    const skip = (page - 1) * limit
    const sortBy = params.sortBy || 'createdAt'
    const order = params.order || 'desc'
    const sortObject = createSortObject(sortBy, order)

    const { dishName } = params
    let data, totalCount

    if (dishName && dishName.trim()) {
      // Use aggregation pipeline for dish name search with proper sort
      const pipeline = [
        {
          $lookup: {
            from: 'dish',
            localField: 'dishId',
            foreignField: '_id',
            as: 'dish'
          }
        },
        {
          $unwind: '$dish'
        },
        {
          $match: {
            'dish.name': { $regex: dishName.trim(), $options: 'i' }
          }
        },
        { $sort: sortObject },
        { $skip: skip },
        { $limit: limit }
      ]

      // Execute aggregation
      data = await db.collection(_COLLECTION_NAME).aggregate(pipeline).toArray()

      // Count total documents with same filter
      const countPipeline = [
        {
          $lookup: {
            from: 'dish',
            localField: 'dishId',
            foreignField: '_id',
            as: 'dish'
          }
        },
        {
          $unwind: '$dish'
        },
        {
          $match: {
            'dish.name': { $regex: dishName.trim(), $options: 'i' }
          }
        },
        { $count: 'total' }
      ]

      const countResult = await db.collection(_COLLECTION_NAME).aggregate(countPipeline).toArray()
      totalCount = countResult.length > 0 ? countResult[0].total : 0
    } else {
      // Normal query without search with proper sort
      const [dataResult, totalCountResult] = await Promise.all([
        db.collection(_COLLECTION_NAME).find().sort(sortObject).skip(skip).limit(limit).toArray(),
        db.collection(_COLLECTION_NAME).countDocuments()
      ])
      data = dataResult
      totalCount = totalCountResult
    }

    return { data, totalCount }
  } catch (error) {
    throw new Error('Failed to retrieve reports')
  }
}

// createReport
const createReport = async (data) => {
  try {
    const result = await GET_DB().collection(_COLLECTION_NAME).insertOne(data)
    return result
  } catch (error) {
    throw new Error('Failed to create report')
  }
}

// deleteReport
const deleteReport = async (id) => {
  try {
    const result = await GET_DB()
      .collection(_COLLECTION_NAME)
      .findOneAndDelete({ _id: new ObjectId(id) })
    return result
  } catch (error) {
    throw new Error('Failed to delete report')
  }
}

export const reportModel = {
  getAllReports,
  createReport,
  deleteReport
}
