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

// getAll
const getAllReports = async () => {
  try {
    const db = await GET_DB()
    const [data, totalCount] = await Promise.all([
      db.collection(_COLLECTION_NAME).find().toArray(),
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

export const reportModel = {
  getAllReports,
  createReport,
  deleteReport
}
