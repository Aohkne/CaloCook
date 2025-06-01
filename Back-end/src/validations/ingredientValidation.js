import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '@/utils/ApiError'

const createNew = async (req, res, next) => {
  const correctCondition = Joi.object({
    dishId: Joi.string().required().length(24).hex().messages({
      'any.required': 'Dish Id is required',
      'string.length': 'Dish Id must be a 24-character hex string',
      'string.hex': 'Dish Id must be in hexadecimal format'
    }),

    name: Joi.string().required().min(1).max(100).trim().messages({
      'any.required': 'Name is required',
      'string.empty': 'Name must not be empty',
      'string.min': 'Name must be at least 1 character',
      'string.max': 'Name must not exceed 100 characters',
      'string.trim': 'Name must not have leading or trailing whitespace'
    }),

    quantity: Joi.string().required().min(1).max(50).trim().messages({
      'any.required': 'Quantity is required',
      'string.empty': 'Quantity must not be empty',
      'string.min': 'Quantity must be at least 1 character',
      'string.max': 'Quantity must not exceed 50 characters',
      'string.trim': 'Quantity must not have leading or trailing whitespace'
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

const updateIngredient = async (req, res, next) => {
  const correctCondition = Joi.object({
    dishId: Joi.string().required().length(24).hex().messages({
      'any.required': 'Dish Id is required',
      'string.length': 'Dish Id must be a 24-character hex string',
      'string.hex': 'Dish Id must be in hexadecimal format'
    }),

    name: Joi.string().required().min(1).max(100).trim().messages({
      'any.required': 'Name is required',
      'string.empty': 'Name must not be empty',
      'string.min': 'Name must be at least 1 character',
      'string.max': 'Name must not exceed 100 characters',
      'string.trim': 'Name must not have leading or trailing whitespace'
    }),

    quantity: Joi.string().required().min(1).max(50).trim().messages({
      'any.required': 'Quantity is required',
      'string.empty': 'Quantity must not be empty',
      'string.min': 'Quantity must be at least 1 character',
      'string.max': 'Quantity must not exceed 50 characters',
      'string.trim': 'Quantity must not have leading or trailing whitespace'
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

export const ingredientValidation = {
  createNew,
  updateIngredient
}
