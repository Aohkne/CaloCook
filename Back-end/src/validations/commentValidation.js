import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '@/utils/ApiError'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '@/utils/validators'

const createComment = async (req, res, next) => {
  const correctCondition = Joi.object({
    dishId: Joi.string().pattern(OBJECT_ID_RULE).required().messages({
      'any.required': 'Dish ID is required',
      'string.empty': 'Dish ID is not allowed to be empty',
      'string.pattern.base': 'Dish ID must be a valid ObjectId'
    }),
    content: Joi.string().max(1000).trim().default('').messages({
      'string.max': 'Content must not exceed 1000 characters',
      'string.trim': 'Content must not have leading or trailing whitespace'
    }),
    parentId: Joi.string().pattern(OBJECT_ID_RULE).allow(null, '').default('').messages({
      'string.pattern.base': 'Parent ID must be a valid ObjectId'
    }),
    image: Joi.string().uri().trim().allow(null, '').default('').messages({
      'string.uri': 'Image must be a valid URI'
    })
  })

  const { error } = correctCondition.validate(req.body)
  if (error) {
    return next(new ApiError(StatusCodes.BAD_REQUEST, error.details[0].message))
  }

  next()
}

const updateComment = async (req, res, next) => {
  const correctCondition = Joi.object({
    content: Joi.string().min(1).max(1000).trim().allow(null, '').messages({
      'string.min': 'Content must be at least 1 character long',
      'string.max': 'Content must not exceed 1000 characters',
      'string.trim': 'Content must not have leading or trailing whitespace'
    }),
    image: Joi.string().uri().allow(null, '').messages({
      'string.uri': 'Image must be a valid URI'
    })
  })

  const { error } = correctCondition.validate(req.body)
  if (error) {
    return next(new ApiError(StatusCodes.BAD_REQUEST, error.details[0].message))
  }

  next()
}
export const commentValidation = {
  createComment,
  updateComment
}
