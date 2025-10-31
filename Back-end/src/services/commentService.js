import { StatusCodes } from 'http-status-codes'
import ApiError from '@/utils/ApiError'
import { commentModel } from '@/models/commentModel'
import { userModel } from '@/models/userModel'
import { reactionCommentModel } from '@/models/reactionCommentModel'
import { ObjectId } from 'mongodb'
import cloudinary from '@/config/cloudinary'

// Get all comments with pagination
const getAllComments = async () => {
  try {
    const result = await commentModel.getAllComments()

    // Check if result is an object with data property or direct array
    const comments = Array.isArray(result) ? result : result?.data || []

    if (!comments || comments.length === 0) {
      return []
    }

    // Get unique user IDs
    const userIds = [...new Set(comments.map((comment) => comment.userId).filter((id) => id))]

    if (userIds.length === 0) {
      return comments
    }

    // Fetch users one by one since getDetails only accepts single ID
    const users = await Promise.all(
      userIds.map(async (userId) => {
        try {
          const user = await userModel.getDetails(userId)
          if (user) {
            // Remove sensitive data
            delete user.password_hash
          }
          return user
        } catch (error) {
          console.error(`Error fetching user ${userId}:`, error)
          return null
        }
      })
    )

    // Filter out null users
    const validUsers = users.filter((user) => user !== null)

    return comments.map((comment) => ({
      ...comment,
      user: validUsers.find((user) => user._id.toString() === comment.userId.toString()) || null
    }))
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Error fetching comments')
  }
}

// Get comment count
const getCommentCount = async () => {
  try {
    const count = await commentModel.getCommentCount()
    return { count }
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Error fetching comment count')
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
    // bao gom luôn thông tin user, xoa password_hash
    const user = await userModel.getDetails(comment.userId)
    delete user.password_hash
    return { ...comment, user }
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Error fetching comment')
  }
}

// Get những thằng was comment, this comment (parentId = commentId origin)
const getCommentsByParentId = async (parentId) => {
  try {
    const comments = await commentModel.getCommentsByParentId(new ObjectId(parentId))
    // bao gom luôn thông tin user, xoa password_hash
    const commentsWithUser = await Promise.all(
      comments.map(async (comment) => {
        const user = await userModel.getDetails(comment.userId)
        delete user.password_hash
        return { ...comment, user }
      })
    )
    return commentsWithUser
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Error fetching comments by parentId')
  }
}

// Get comments by dishId
const getCommentsByDishId = async (dishId) => {
  try {
    const result = await commentModel.getCommentsByDishId(new ObjectId(dishId))

    // Check if result has comments property (structured response) or is direct array
    const comments = result?.comments || (Array.isArray(result) ? result : result?.data || [])

    if (!comments || comments.length === 0) {
      return result || []
    }

    // Helper function to add user info recursively
    const addUserToComment = async (comment) => {
      try {
        const user = await userModel.getDetails(comment.userId)
        if (user) {
          delete user.password_hash
        }

        // Process children recursively if they exist
        let childrenWithUser = comment.children || []
        if (childrenWithUser.length > 0) {
          childrenWithUser = await Promise.all(childrenWithUser.map(async (child) => await addUserToComment(child)))
        }

        return { ...comment, user, children: childrenWithUser }
      } catch (error) {
        console.error(`Error fetching user for comment ${comment._id}:`, error)
        return { ...comment, user: null }
      }
    }

    // bao gom luôn thông tin user, xoa password_hash (including children)
    const commentsWithUser = await Promise.all(comments.map(async (comment) => await addUserToComment(comment)))

    // Return with same structure as original result
    if (result?.comments) {
      return {
        ...result,
        comments: commentsWithUser
      }
    }

    return commentsWithUser
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Error fetching comments by dishId')
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
    // nếu xóa comment thì sẽ xóa luôn cái reaction có commentId tương ứng
    await reactionCommentModel.deleteReactionsByCommentId(new ObjectId(commentId))

    const deletedComment = await commentModel.deleteCommentById(new ObjectId(commentId))
    return deletedComment
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Error deleting comment')
  }
}

export const commentService = {
  getAllComments,
  getCommentCount,
  createComment,
  getCommentById,
  getCommentsByParentId,
  getCommentsByDishId,
  updateCommentById,
  deleteCommentById
}
