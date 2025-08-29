import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '@/utils/ApiError'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '@/utils/validators'

const addReaction = async (req, res, next) => {
    const correctCondition = Joi.object({
        commentId: Joi.string().pattern(OBJECT_ID_RULE).required().messages({
            'any.required': 'Comment ID is required',
            'string.empty': 'Comment ID is not allowed to be empty',
            'string.pattern.base': 'Comment ID must be a valid ObjectId'
        }),
        reactionType: Joi.string().trim().lowercase().valid('like', 'love', 'haha', 'angry', 'sad', 'wow').required().messages({
            'any.required': 'Reaction type is required',
            'string.empty': 'Reaction type is not allowed to be empty',
            'any.only': 'Reaction type must be one of like, love, haha, angry, sad, wow'
        })
    })

    const { error } = correctCondition.validate(req.body)
    if (error) {
        return next(new ApiError(StatusCodes.BAD_REQUEST, error.details[0].message))
    }

    next()
}

const updatedReaction = async (req, res, next) => {
    const correctCondition = Joi.object({
        reactionType: Joi.string().trim().lowercase().valid('like', 'love', 'haha', 'angry', 'sad', 'wow').required().messages({
            'any.required': 'Reaction type is required',
            'string.empty': 'Reaction type is not allowed to be empty',
            'any.only': 'Reaction type must be one of like, love, haha, angry, sad, wow'
        })
    })

    const { error } = correctCondition.validate(req.body)
    if (error) {
        return next(new ApiError(StatusCodes.BAD_REQUEST, error.details[0].message))
    }

    next()
}

export const reactionValidation = {
    addReaction,
    updatedReaction
}
