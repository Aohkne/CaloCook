import { StatusCodes } from 'http-status-codes'
import { reactionService } from '@/services/reactionService'

// Get all reactions
const getAllReactions = async (req, res, next) => {
    try {
        const reactions = await reactionService.getAllReactions()
        res.status(StatusCodes.OK).json(reactions)
    } catch (error) {
        next(error)
    }
}
// Add a reaction
const addReaction = async (req, res, next) => {
    try {
        const payload = { ...req.body, userId: req.user._id }
        const newReaction = await reactionService.addReaction(payload)
        res.status(StatusCodes.CREATED).json(newReaction)
    } catch (error) {
        next(error)
    }
}

// Get reactions by commentId
const getReactionsByCommentId = async (req, res, next) => {
    try {
        const commentId = req.params.commentId
        const { reactions, totalReaction, reactionCounts } = await reactionService.getReactionsByCommentId(commentId)
        res.status(StatusCodes.OK).json({ reactions, totalReaction, reactionCounts })
    } catch (error) {
        next(error)
    }
}

// Update a reaction
const updateReaction = async (req, res, next) => {
    try {
        const reactionId = req.params.id
        const payload = req.body
        const updatedReaction = await reactionService.updateReaction(reactionId, payload)
        res.status(StatusCodes.OK).json(updatedReaction)
    } catch (error) {
        next(error)
    }
}

// Delete a reaction
const deleteReaction = async (req, res, next) => {
    try {
        const reactionId = req.params.id
        const deletedReaction = await reactionService.deleteReaction(reactionId)
        res.status(StatusCodes.OK).json(deletedReaction)
    } catch (error) {
        next(error)
    }
}

export const reactionController = {
    getAllReactions,
    addReaction,
    getReactionsByCommentId,
    updateReaction,
    deleteReaction
}
