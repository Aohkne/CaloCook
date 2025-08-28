import Joi from 'joi'
import { GET_DB } from '@/config/mongodb'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '@/utils/validators'
import { ObjectId } from 'mongodb'

const _COLLECTION_NAME = 'reactionComment'
const _COLLECTION_SCHEMA = Joi.object({
  commentId: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE).required(),
  userId: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE).required(),
  reactionType: Joi.string().valid('like', 'love', 'haha', 'angry', 'sad', 'wow').required(),
  createdAt: Joi.date().timestamp('javascript').default(Date.now)
})

// getAllReactions
export const getAllReactions = async () => {
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

// addReaction
export const addReaction = async (data) => {
  try {
    const addedReaction = await GET_DB().collection(_COLLECTION_NAME).insertOne(data)
    return addedReaction
  } catch (error) {
    throw new Error(error)
  }
}

// getReactionsByCommentId
export const getReactionsByCommentId = async (commentId) => {
  try {
    const reactions = await GET_DB().collection(_COLLECTION_NAME).find({ commentId: new ObjectId(commentId) }).toArray()
    const totalReaction = reactions.length

    // aggregate counts per reactionType
    const agg = await GET_DB().collection(_COLLECTION_NAME).aggregate([
      { $match: { commentId: new ObjectId(commentId) } },
      { $group: { _id: '$reactionType', count: { $sum: 1 } } }
    ]).toArray()
    const counts = { like: 0, love: 0, haha: 0, angry: 0, sad: 0, wow: 0 }
    agg.forEach(item => {
      counts[item._id] = item.count
    })
    return { reactions, totalReaction, reactionCounts: counts }
  } catch (error) {
    throw new Error(error)
  }
}

// updateReaction
export const updateReaction = async (id, data) => {
  try {
    const updatedReaction = await GET_DB()
      .collection(_COLLECTION_NAME)
      .findOneAndUpdate({ _id: new ObjectId(id) }, { $set: data }, { returnDocument: 'after' })
    return updatedReaction
  } catch (error) {
    throw new Error(error)
  }
}

// DeleteReaction
export const deleteReaction = async (id) => {
  try {
    const deletedReaction = await GET_DB()
      .collection(_COLLECTION_NAME)
      .findOneAndDelete({ _id: new ObjectId(id) })
    return deletedReaction
  } catch (error) {
    throw new Error(error)
  }
}

// deleteReactionsByCommentId
export const deleteReactionsByCommentId = async (commentId) => {
  try {
    const deletedReactions = await GET_DB()
      .collection(_COLLECTION_NAME)
      .deleteMany({ commentId: new ObjectId(commentId) })
    return deletedReactions
  } catch (error) {
    throw new Error(error)
  }
}

export const reactionCommentModel = {
  getAllReactions,
  addReaction,
  getReactionsByCommentId,
  deleteReactionsByCommentId,
  updateReaction,
  deleteReaction
}
