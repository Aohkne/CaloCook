import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '@/utils/ApiError'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '@/utils/validators'

const addToHistory = async (req, res, next) => {
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

const viewHistory = async (req, res, next) => {
  const correctCondition = Joi.object({
    userId: Joi.string()
      .pattern(OBJECT_ID_RULE)
      .message(OBJECT_ID_RULE_MESSAGE)
      .required()
      .messages({
        'any.required': 'userId is required',
        'string.empty': 'userId is not allowed to be empty'
      })
  })
  try {
    await correctCondition.validateAsync(
      { userId: req.params.userId },
      { abortEarly: false }
    )
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
  }
}

const searchByUserId = async (req, res, next) => {
  const correctCondition = Joi.object({
    userId: Joi.string()
      .pattern(OBJECT_ID_RULE)
      .message(OBJECT_ID_RULE_MESSAGE)
      .required()
      .messages({
        'any.required': 'userId is required',
        'string.empty': 'userId is not allowed to be empty'
      })
  })
  try {
    await correctCondition.validateAsync(
      { userId: req.params.userId },
      { abortEarly: false }
    )
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
  }
}

const searchByDishId = async (req, res, next) => {
  const correctCondition = Joi.object({
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
      { dishId: req.params.dishId },
      { abortEarly: false }
    )
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
  }
}

const deleteFromHistory = async (req, res, next) => {
  const correctCondition = Joi.object({
    historyId: Joi.string()
      .pattern(OBJECT_ID_RULE)
      .message(OBJECT_ID_RULE_MESSAGE)
      .required()
      .messages({
        'any.required': 'historyId is required',
        'string.empty': 'historyId is not allowed to be empty'
      })
  })
  try {
    await correctCondition.validateAsync(
      { historyId: req.params.historyId },
      { abortEarly: false }
    )
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
  }
}

const editHistory = async (req, res, next) => {
  const correctCondition = Joi.object({
    historyId: Joi.string()
      .pattern(OBJECT_ID_RULE)
      .message(OBJECT_ID_RULE_MESSAGE)
      .required()
      .messages({
        'any.required': 'historyId is required',
        'string.empty': 'historyId is not allowed to be empty'
      }),
    consumedAt: Joi.date()
      .iso()
      .required()
      .messages({
        'date.base': 'consumedAt must be a valid date',
        'date.iso': 'consumedAt must be in ISO format (e.g., 2025-06-06T23:00:00.000Z)',
        'any.required': 'consumedAt is required'
      })
  })
  try {
    await correctCondition.validateAsync(
      { historyId: req.params.historyId, consumedAt: req.body.consumedAt },
      { abortEarly: false }
    )
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
  }
}

export const historyValidation = {
  addToHistory,
  viewHistory,
  searchByUserId,
  searchByDishId,
  deleteFromHistory,
  editHistory
}