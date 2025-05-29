import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '@/utils/ApiError'

const createNew = async (req, res, next) => {
  const correctCondition = Joi.object({
    name: Joi.string().required().min(3).max(50).trim().strict().messages({
      'any.required': 'Name is required',
      'string.empty': 'Name is not allowed to be empty',
      'string.min': 'Name length must be at least 3 characters',
      'string.max': 'Name length must be less than or equal to 50 characters',
      'string.trim': 'Name must not have leading or trailing whitespace'
    }),

    cookingTime: Joi.number().integer().min(1).max(10080).default(30).messages({
      'number.base': 'Cooking time must be a number',
      'number.integer': 'Cooking time must be an integer',
      'number.min': 'Cooking time must be at least 1 minute',
      'number.max': 'Cooking time must not exceed 10080 minutes (1 week)'
    }),

    calorie: Joi.number().integer().min(1).max(10000).default(100).messages({
      'number.base': 'Calorie must be a number',
      'number.integer': 'Calorie must be an integer',
      'number.min': 'Calorie must be at least 1',
      'number.max': 'Calorie must not exceed 10000'
    }),

    difficulty: Joi.string().valid('easy', 'medium', 'hard').default('medium').messages({
      'any.only': 'Difficulty must be one of: easy, medium, hard'
    }),

    description: Joi.string().required().min(10).max(1000).trim().strict().messages({
      'any.required': 'Description is required',
      'string.empty': 'Description is not allowed to be empty',
      'string.min': 'Description must be at least 10 characters long',
      'string.max': 'Description must not exceed 1000 characters',
      'string.trim': 'Description must not have leading or trailing whitespace'
    }),

    imageUrl: Joi.string().uri().allow('').default('').messages({
      'string.uri': 'Image URL must be a valid URI'
    }),

    isActive: Joi.boolean().default(true)
  })

  try {
    // abortEarly - false -> trả về nếu th nhiều lỗi
    await correctCondition.validateAsync(req.body, { abortEarly: false })

    // Validate -> Controller
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
  }
}

const updateDish = async (req, res, next) => {
  const correctCondition = Joi.object({
    name: Joi.string().min(3).max(50).trim().strict().messages({
      'string.empty': 'Name is not allowed to be empty',
      'string.min': 'Name length must be at least 3 characters',
      'string.max': 'Name length must be less than or equal to 50 characters',
      'string.trim': 'Name must not have leading or trailing whitespace'
    }),

    cookingTime: Joi.number().integer().min(1).max(10080).messages({
      'number.base': 'Cooking time must be a number',
      'number.integer': 'Cooking time must be an integer',
      'number.min': 'Cooking time must be at least 1 minute',
      'number.max': 'Cooking time must not exceed 10080 minutes (1 week)'
    }),

    calorie: Joi.number().integer().min(1).max(10000).messages({
      'number.base': 'Calorie must be a number',
      'number.integer': 'Calorie must be an integer',
      'number.min': 'Calorie must be at least 1',
      'number.max': 'Calorie must not exceed 10000'
    }),

    difficulty: Joi.string().valid('easy', 'medium', 'hard').messages({
      'any.only': 'Difficulty must be one of: easy, medium, hard'
    }),

    description: Joi.string().min(10).max(1000).trim().strict().messages({
      'string.empty': 'Description is not allowed to be empty',
      'string.min': 'Description must be at least 10 characters long',
      'string.max': 'Description must not exceed 1000 characters',
      'string.trim': 'Description must not have leading or trailing whitespace'
    }),

    imageUrl: Joi.string().uri().allow('').messages({
      'string.uri': 'Image URL must be a valid URI'
    }),

    isActive: Joi.boolean().messages({
      'boolean.base': 'isActive must be a boolean value'
    })
  })

  try {
    // abortEarly - false -> trả về nếu có nhiều lỗi
    await correctCondition.validateAsync(req.body, { abortEarly: false })

    // Validate -> Controller
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
  }
}

export const dishValidation = {
  createNew,
  updateDish
}
