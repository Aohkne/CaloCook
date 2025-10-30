import { StatusCodes } from 'http-status-codes'
import { commentService } from '@/services/commentService'
import { paginationHelper } from '@/utils/pagination'

// Get all comments
const getAllComments = async (req, res, next) => {
  try {
    const comments = await commentService.getAllComments()
    res.status(StatusCodes.OK).json(comments)
  } catch (error) {
    next(error)
  }
}

// Get comment count
const getCommentCount = async (req, res, next) => {
  try {
    const count = await commentService.getCommentCount()
    res.status(StatusCodes.OK).json(count)
  } catch (error) {
    next(error)
  }
}

// Create a new comment
const createComment = async (req, res, next) => {
  try {
    const payload = { ...req.body, userId: req.user._id }
    const newComment = await commentService.createComment(payload)
    res.json({
      code: 201,
      message: 'Comment created successfully',
      data: newComment
    })
  } catch (error) {
    next(error)
  }
}

// Get a comment by ID
const getCommentById = async (req, res, next) => {
  try {
    const commentId = req.params.id
    const comment = await commentService.getCommentById(commentId)
    res.status(StatusCodes.OK).json(comment)
  } catch (error) {
    next(error)
  }
}

// Get những thằng was comment, this comment (parentId = commentId origin)
const getCommentsByParentId = async (req, res, next) => {
  try {
    const parentId = req.params.id
    const comments = await commentService.getCommentsByParentId(parentId)
    res.status(StatusCodes.OK).json([comments])
  } catch (error) {
    next(error)
  }
}

// Get a comment by dishId
const getCommentsByDishId = async (req, res, next) => {
  try {
    const dishId = req.params.dishId
    const { comments, totalRoot, totalComment } = await commentService.getCommentsByDishId(dishId)
    res.status(StatusCodes.OK).json({ comments, totalRoot, totalComment })
  } catch (error) {
    next(error)
  }
}

// Update a comment by ID
const updateCommentById = async (req, res, next) => {
  try {
    const commentId = req.params.id
    const payload = req.body
    const updatedComment = await commentService.updateCommentById(commentId, payload)
    res.json({
      code: 200,
      message: 'Comment updated successfully',
      data: updatedComment
    })
  } catch (error) {
    next(error)
  }
}

// Delete a comment by ID
const deleteCommentById = async (req, res, next) => {
  try {
    const commentId = req.params.id
    const deletedComment = await commentService.deleteCommentById(commentId)
    res.json({
      code: 200,
      message: 'Comment deleted successfully',
      data: deletedComment
    })
  } catch (error) {
    next(error)
  }
}

export const commentController = {
  getAllComments,
  getCommentCount,
  createComment,
  getCommentById,
  getCommentsByDishId,
  getCommentsByParentId,
  updateCommentById,
  deleteCommentById
}
