import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '@/utils/ApiError'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '@/utils/validators'

const addToFavorites = async (req, res, next) => {
  const correctCondition = Joi.object({
    userId: Joi.string()
      .pattern(OBJECT_ID_RULE)
      .message(OBJECT_ID_RULE_MESSAGE)
      .required(),
    dishId: Joi.string()
      .pattern(OBJECT_ID_RULE)
      .message(OBJECT_ID_RULE_MESSAGE)
      .required()
  })
  try {
    await correctCondition.validateAsync(
      {
        userId: req.params.userId,
        dishId: req.body.dishId
      },
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
      .required(),
    page: Joi.number()
      .integer()
      .min(1)
      .default(1)
      .optional(),
    limit: Joi.number()
      .integer()
      .min(1)
      .max(100)
      .default(10)
      .optional(),
    sortBy: Joi.string()
      .valid('createdAt', 'name', 'cookingTime', 'calorie', 'difficulty')
      .default('createdAt')
      .optional(),
    order: Joi.string()
      .valid('asc', 'desc')
      .default('asc')
      .optional()
  })
  try {
    await correctCondition.validateAsync(
      {
        userId: req.params.userId,
        page: req.query.page,
        limit: req.query.limit,
        sortBy: req.query.sortBy,
        order: req.query.order
      },
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
      .required(),
    dishId: Joi.string()
      .pattern(OBJECT_ID_RULE)
      .message(OBJECT_ID_RULE_MESSAGE)
      .required()
  })
  try {
    await correctCondition.validateAsync(
      {
        userId: req.params.userId,
        dishId: req.params.dishId
      },
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