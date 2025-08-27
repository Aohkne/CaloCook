import Joi from 'joi'
import { GET_DB } from '@/config/mongodb'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '@/utils/validators'
import { ObjectId } from 'mongodb'

const _COLLECTION_NAME = 'comment'
const _COLLECTION_SCHEMA = Joi.object({
  dishId: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE).required(),
  userId: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE).required(),
  content: Joi.string().max(1000).trim().allow(null, '').default(''),
  parentId: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE).trim().allow(null, '').default(''),
  image: Joi.string().uri().trim().default(''),
  createdAt: Joi.date().timestamp('javascript').default(Date.now)
})

// Sort object
const createSortObject = (sortBy, order) => {
  const sortOrder = order === 'asc' ? 1 : -1
  return { [sortBy]: sortOrder }
}

// getAll
export const getAllComments = async () => {
  try {
    const [data, totalCount] = await Promise.all([
      GET_DB().collection(_COLLECTION_NAME).find().toArray(),
      GET_DB().collection(_COLLECTION_NAME).countDocuments()
    ])

    return { data, totalCount }
  } catch (error) {
    throw new Error(error)
  }
}

// createComment
const createComment = async (data) => {
  try {
    const createdComment = await GET_DB().collection(_COLLECTION_NAME).insertOne(data)
    return createdComment
  } catch (error) {
    throw new Error(error)
  }
}
// getCommentById
const getCommentById = async (id) => {
  return await GET_DB()
    .collection(_COLLECTION_NAME)
    .findOne({ _id: new ObjectId(id) })
}

// Get những thằng was comment, this comment (parentId = commentId origin)
const getCommentsByParentId = async (parentId) => {
  try {
    const comments = await GET_DB()
      .collection(_COLLECTION_NAME)
      .find({ parentId: new ObjectId(parentId) })
      .toArray()
    return comments
  } catch (error) {
    throw new Error(error)
  }
}

// updateCommentById
const updateCommentById = async (id, data) => {
  try {
    const updatedComment = await GET_DB()
      .collection(_COLLECTION_NAME)
      .findOneAndUpdate({ _id: new ObjectId(id) }, { $set: data }, { returnDocument: 'after' })
    return updatedComment
  } catch (error) {
    throw new Error(error)
  }
}

// deleteCommentById
const deleteCommentById = async (id) => {
  try {
    const deletedComment = await GET_DB()
      .collection(_COLLECTION_NAME)
      .findOneAndDelete({ _id: new ObjectId(id) })
    return deletedComment
  } catch (error) {
    throw new Error(error)
  }
}

export const commentModel = {
  getAllComments,
  createComment,
  getCommentById,
  getCommentsByParentId,
  updateCommentById,
  deleteCommentById
}
