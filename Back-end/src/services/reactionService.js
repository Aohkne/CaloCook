import { StatusCodes } from 'http-status-codes'
import ApiError from '@/utils/ApiError'
import { reactionCommentModel } from '@/models/reactionCommentModel'
import { ObjectId } from 'mongodb'
import { GET_DB } from '@/config/mongodb'

// Get all reactions
const getAllReactions = async () => {
  try {
    const reactions = await reactionCommentModel.getAllReactions()
    return reactions
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Error fetching reactions')
  }
}

// Add a reaction
const addReaction = async (payload) => {
  try {
    // Kiểm tra đã tồn tại reaction chưa
    const existing = await GET_DB()
      .collection('reactionComment')
      .findOne({
        commentId: new ObjectId(payload.commentId),
        userId: new ObjectId(payload.userId)
      })
    if (existing) {
      // console.log(existing)
      throw new ApiError(StatusCodes.BAD_REQUEST, 'You have already reacted to this comment')
    }
    const newReaction = await reactionCommentModel.addReaction({
      commentId: new ObjectId(payload.commentId),
      userId: new ObjectId(payload.userId),
      reactionType: payload.reactionType,
      createdAt: new Date()
    })
    return newReaction
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Error adding reaction')
  }
}

// Get reaction by commentId
const getReactionsByCommentId = async (commentId) => {
  try {
    const reactions = await reactionCommentModel.getReactionsByCommentId(commentId)
    return reactions
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Error fetching reactions by commentId')
  }
}

// Update a reaction
const updateReaction = async (reactionId, payload) => {
  try {
    const updatedReaction = await reactionCommentModel.updateReaction(reactionId, payload)
    return updatedReaction
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Error updating reaction')
  }
}

// Delete a reaction
const deleteReaction = async (reactionId) => {
  try {
    const deletedReaction = await reactionCommentModel.deleteReaction(reactionId)
    return deletedReaction
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Error deleting reaction')
  }
}

export const reactionService = {
  getAllReactions,
  addReaction,
  getReactionsByCommentId,
  updateReaction,
  deleteReaction
}
