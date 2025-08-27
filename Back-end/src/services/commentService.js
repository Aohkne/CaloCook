import { StatusCodes } from 'http-status-codes'
import ApiError from '@/utils/ApiError'
import { commentModel } from '@/models/commentModel'
import { ObjectId } from 'mongodb'
import cloudinary from '@/config/cloudinary'

// Get all comments with pagination
const getAllComments = async () => {
  try {
    const comments = await commentModel.getAllComments()
    return comments
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Error fetching comments')
  }
}

// Create a new comment
const createComment = async (commentPayload) => {
  let cloudinaryResponse = null
  if (commentPayload.image) {
    cloudinaryResponse = await cloudinary.uploader.upload(commentPayload.image, {
      folder: 'comments'
    })
  }
  try {
    const newComment = await commentModel.createComment({
      dishId: new ObjectId(commentPayload.dishId),
      userId: new ObjectId(commentPayload.userId),
      content: commentPayload.content || null,
      parentId: commentPayload.parentId ? new ObjectId(commentPayload.parentId) : null,
      image: cloudinaryResponse?.secure_url ? cloudinaryResponse.secure_url : null,
      createdAt: new Date()
    })
    return newComment
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Error creating comment')
  }
}

// Get a comment by ID
const getCommentById = async (commentId) => {
  try {
    const comment = await commentModel.getCommentById(new ObjectId(commentId))
    return comment
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Error fetching comment')
  }
}

// Get những thằng was comment, this comment (parentId = commentId origin)
const getCommentsByParentId = async (parentId) => {
  try {
    const comments = await commentModel.getCommentsByParentId(new ObjectId(parentId))
    return comments
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Error fetching comments by parentId')
  }
}

// Update a comment by ID
const updateCommentById = async (commentId, updateData) => {
  try {
    const updatedComment = await commentModel.updateCommentById(commentId, updateData)
    return updatedComment
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Error updating comment')
  }
}

// Delete a comment by ID
const deleteCommentById = async (commentId) => {
  try {
    // nếu những comment khác có parentId = commentId thì cũng xóa luôn
    const childComments = await commentModel.getCommentsByParentId(new ObjectId(commentId))
    if (childComments.length > 0) {
      await Promise.all(
        childComments.map(async (child) => {
          await commentModel.deleteCommentById(child._id)
        })
      )
    }
    const deletedComment = await commentModel.deleteCommentById(new ObjectId(commentId))
    return deletedComment
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Error deleting comment')
  }
}

export const commentService = {
  getAllComments,
  createComment,
  getCommentById,
  getCommentsByParentId,
  updateCommentById,
  deleteCommentById
}
