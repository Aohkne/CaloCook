import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '@/utils/ApiError'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '@/utils/validators'

const addToFavorites = async (req, res, next) => {
    const correctCondition = Joi.object({
        userId: Joi.string()
            .pattern(OBJECT_ID_RULE)
            .message(OBJECT_ID_RULE_MESSAGE)
            .required()
            .messages({
                'any.required': 'userId is required',
                'string.empty': 'userId is not allowed to be empty'
            }),
        dishId: Joi.string()
            .pattern(OBJECT_ID_RULE)
            .message(OBJECT_ID_RULE_MESSAGE)
            .required()
            .messages({
                'any.required': 'dishId is required',
                'string.empty': 'dishId is not allowed to be empty'
            })
    })
    try {
        await correctCondition.validateAsync(
            { userId: req.params.userId, dishId: req.body.dishId },
            { abortEarly: false }
        )
        next()
    } catch (error) {
        next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
    }
    
}
const viewFavorites = async (req, res, next) => {
  const correctCondition = Joi.object({
    userId: Joi.string()
      .pattern(OBJECT_ID_RULE)
      .message(OBJECT_ID_RULE_MESSAGE)
      .required()
      .messages({
        'any.required': 'userId is required',
        'string.empty': 'userId is not allowed to be empty'
      }),
    sortBy: Joi.string().valid('createdAt', 'name', 'cookingTime', 'calorie', 'difficulty').default('createdAt'),
    order: Joi.string().valid('asc', 'desc').default('asc')
  })
   try {
    await correctCondition.validateAsync(
      { userId: req.params.userId, ...req.query },
      { abortEarly: false }
    )
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
  }
}
const deleteFromFavorites = async (req, res, next) => {
  const correctCondition = Joi.object({
    userId: Joi.string()
      .pattern(OBJECT_ID_RULE)
      .message(OBJECT_ID_RULE_MESSAGE)
      .required()
      .messages({
        'any.required': 'userId is required',
        'string.empty': 'userId is not allowed to be empty'
      }),
       dishId: Joi.string()
      .pattern(OBJECT_ID_RULE)
      .message(OBJECT_ID_RULE_MESSAGE)
      .required()
      .messages({
        'any.required': 'dishId is required',
        'string.empty': 'dishId is not allowed to be empty'
      })
  })
  try {
    await correctCondition.validateAsync(
      { userId: req.params.userId, dishId: req.params.dishId },
      { abortEarly: false }
    )
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
  }
}
export const favoriteValidation = {
  addToFavorites,
  viewFavorites,
  deleteFromFavorites
}