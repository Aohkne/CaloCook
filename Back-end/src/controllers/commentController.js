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

// Create a new comment
const createComment = async (req, res, next) => {
  try {
    const payload = { ...req.body, userId: req.user._id }
    const newComment = await commentService.createComment(payload)
    res.status(StatusCodes.CREATED).json(newComment)
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
    res.status(StatusCodes.OK).json(comments)
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
    res.status(StatusCodes.OK).json(updatedComment)
  } catch (error) {
    next(error)
  }
}

// Delete a comment by ID
const deleteCommentById = async (req, res, next) => {
  try {
    const commentId = req.params.id
    const deletedComment = await commentService.deleteCommentById(commentId)
    res.status(StatusCodes.OK).json(deletedComment)
  } catch (error) {
    next(error)
  }
}

export const commentController = {
  getAllComments,
  createComment,
  getCommentById,
  getCommentsByParentId,
  updateCommentById,
  deleteCommentById
}
