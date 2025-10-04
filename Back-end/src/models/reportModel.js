import Joi from 'joi'
import { GET_DB } from '@/config/mongodb'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '@/utils/validators'
import { ObjectId } from 'mongodb'

const _COLLECTION_NAME = 'report'
const _COLLECTION_SCHEMA = Joi.object({
  dishId: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE).required(),
  userId: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE).required(),
  description: Joi.string().max(10000).min(10).required(),
  checked: Joi.boolean().default(false),
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

const getAllReports = async (params = {}) => {
  try {
    const db = await GET_DB()
    const { dishName, page = 1, limit = 10, sortBy = 'createdAt', order = 'desc' } = params

    const pageNum = Math.max(1, Number(page))
    const limitNum = Math.max(1, Math.min(100, Number(limit)))
    const skip = (pageNum - 1) * limitNum
    const sortObject = createSortObject(sortBy, order)
    const searchTerm = dishName?.trim()

    if (searchTerm) {
      // Create base pipeline for search
      const basePipeline = [
        { $lookup: { from: 'dish', localField: 'dishId', foreignField: '_id', as: 'dish' } },
        { $unwind: '$dish' },
        { $match: { 'dish.name': { $regex: searchTerm, $options: 'i' } } }
      ]

      // Execute data and count queries in parallel
      const [data, countResult] = await Promise.all([
        db
          .collection(_COLLECTION_NAME)
          .aggregate([...basePipeline, { $sort: sortObject }, { $skip: skip }, { $limit: limitNum }])
          .toArray(),
        db
          .collection(_COLLECTION_NAME)
          .aggregate([...basePipeline, { $count: 'total' }])
          .toArray()
      ])

      return { data, totalCount: countResult[0]?.total ?? 0 }
    }

    // Normal query without search
    const [data, totalCount] = await Promise.all([
      db.collection(_COLLECTION_NAME).find().sort(sortObject).skip(skip).limit(limitNum).toArray(),
      db.collection(_COLLECTION_NAME).countDocuments()
    ])

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

// Update report - toggle checked status
const updateReport = async (id) => {
  try {
    // First get current document to check current status
    const currentDoc = await GET_DB()
      .collection(_COLLECTION_NAME)
      .findOne({ _id: new ObjectId(id) })
    
    if (!currentDoc) {
      throw new Error('Report not found')
    }
    
    // Toggle the checked status
    const newCheckedStatus = !currentDoc.checked
    
    const result = await GET_DB()
      .collection(_COLLECTION_NAME)
      .findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: { checked: newCheckedStatus } },
        { returnDocument: 'after' } // Return the updated document
      )
    return result
  } catch (error) {
    throw new Error('Failed to update report')
  }
}

export const reportModel = {
  getAllReports,
  createReport,
  deleteReport,
  updateReport
}
