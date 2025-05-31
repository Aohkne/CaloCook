import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '@/utils/ApiError'

const createNew = async (req, res, next) => {
  const correctCondition = Joi.object({
    dishId: Joi.string().required().length(24).hex().messages({
      'any.required': 'Dish Id is required',
      'string.empty': 'Dish Id must not be empty',
      'string.length': 'Dish Id must be a 24-character hex string',
      'string.hex': 'Dish Id must be in hexadecimal format'
    }),

    stepNumber: Joi.number().required().min(1).max(100).messages({
      'any.required': 'Step number is required',
      'number.base': 'Step number must be a number',
      'number.min': 'Step number must be at least 1',
      'number.max': 'Step number must not exceed 100'
    }),

    description: Joi.string().required().min(1).max(50).trim().messages({
      'any.required': 'Description is required',
      'string.empty': 'Description must not be empty',
      'string.min': 'Description must be at least 1 character',
      'string.max': 'Description must not exceed 50 characters',
      'string.trim': 'Description must not have leading or trailing whitespace'
    }),

    isActive: Joi.boolean().default(true).messages({
      'boolean.base': 'isActive must be a boolean'
    })
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

const updateStep = async (req, res, next) => {
  const correctCondition = Joi.object({
    dishId: Joi.string().required().length(24).hex().messages({
      'any.required': 'Dish Id is required',
      'string.empty': 'Dish Id must not be empty',
      'string.length': 'Dish Id must be a 24-character hex string',
      'string.hex': 'Dish Id must be in hexadecimal format'
    }),

    stepNumber: Joi.number().required().min(1).max(100).messages({
      'any.required': 'Step number is required',
      'number.base': 'Step number must be a number',
      'number.min': 'Step number must be at least 1',
      'number.max': 'Step number must not exceed 100'
    }),

    description: Joi.string().required().min(1).max(50).trim().messages({
      'any.required': 'Description is required',
      'string.empty': 'Description must not be empty',
      'string.min': 'Description must be at least 1 character',
      'string.max': 'Description must not exceed 50 characters',
      'string.trim': 'Description must not have leading or trailing whitespace'
    }),

    isActive: Joi.boolean().default(true).messages({
      'boolean.base': 'isActive must be a boolean'
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

export const stepValidation = {
  createNew,
  updateStep
}
