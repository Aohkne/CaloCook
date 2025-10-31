import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '@/utils/ApiError'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '@/utils/validators'

const createNewEmailService = async (req, res, next) => {
  const correctCondition = Joi.object({
    userId: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE).required().messages({
      'any.required': 'userId is required',
      'string.empty': 'userId is not allowed to be empty'
    })
  })

  try {
    const validated = await correctCondition.validateAsync(req.body)
    req.body = validated
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.BAD_REQUEST, error.message))
  }
}

export const emailServiceValidation = {
  createNewEmailService
}
