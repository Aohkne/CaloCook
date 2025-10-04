import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '@/utils/ApiError'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '@/utils/validators'

const createReport = async (req, res, next) => {
  const correctCondition = Joi.object({
    dishId: Joi.string().pattern(OBJECT_ID_RULE).required().messages({
      'string.empty': 'dishId is not allowed to be empty',
      'any.required': 'dishId is required',
      'string.pattern.base': OBJECT_ID_RULE_MESSAGE
    }),

    description: Joi.string().min(10).max(1000).required().messages({
      'string.min': 'description must be at least 10 characters long',
      'string.max': 'description must be at most 1000 characters long'
    })
  })

  const { error } = correctCondition.validate(req.body)
  if (error) {
    return next(new ApiError(StatusCodes.BAD_REQUEST, error.details[0].message))
  }

  next()
}
export const reportValidation = {
  createReport
}
