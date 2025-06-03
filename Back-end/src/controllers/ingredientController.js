import { StatusCodes } from 'http-status-codes'
import { ingredientService } from '@/services/ingredientService'

const getAll = async (req, res, next) => {
  try {
    const { name, isActive, sortBy, order } = req.query

    // NAVIGATION TO SERVICE

    let ingredient
    if (name) {
      ingredient = await ingredientService.searchByName(name, sortBy, order)
    } else if (isActive) {
      ingredient = await ingredientService.searchByIsActive(isActive, sortBy, order)
    } else {
      ingredient = await ingredientService.getAll(sortBy, order)
    }

    // RETURN CLIENT
    res.status(StatusCodes.OK).json({
      code: StatusCodes.OK,
      message: 'Get successfull',
      data: ingredient
    })
  } catch (error) {
    next(error)
  }
}

const getDetails = async (req, res, next) => {
  try {
    const ingredientId = req.params.id

    const ingredient = await ingredientService.getDetails(ingredientId)

    res.status(StatusCodes.OK).json({
      code: StatusCodes.OK,
      message: 'Get successfull',
      data: ingredient
    })
  } catch (error) {
    next(error)
  }
}

const getDetailsByDishId = async (req, res, next) => {
  try {
    const { sortBy, order } = req.query
    const dishId = req.params.dishId

    const ingredient = await ingredientService.getDetailsByDishId(dishId, sortBy, order)

    res.status(StatusCodes.OK).json({
      code: StatusCodes.OK,
      message: 'Get successfull',
      data: ingredient
    })
  } catch (error) {
    next(error)
  }
}

const createNew = async (req, res, next) => {
  try {
    const createdIngredient = await ingredientService.createNew(req.body)

    res.status(StatusCodes.CREATED).json({
      code: StatusCodes.CREATED,
      message: 'Create successfull',
      data: createdIngredient
    })
  } catch (error) {
    next(error)
  }
}

const updateIngredient = async (req, res, next) => {
  try {
    const ingredientId = req.params.id
    const updateData = req.body

    const updatedIngredient = await ingredientService.updateIngredient(ingredientId, updateData)

    res.status(StatusCodes.OK).json({
      code: StatusCodes.OK,
      message: 'Update successful',
      data: updatedIngredient
    })
  } catch (error) {
    next(error)
  }
}

const activateIngredient = async (req, res, next) => {
  try {
    const ingredientId = req.params.id

    const updatedIngredient = await ingredientService.activateIngredient(ingredientId)

    res.status(StatusCodes.OK).json({
      code: StatusCodes.OK,
      message: 'Ingredient activated successfully',
      data: updatedIngredient
    })
  } catch (error) {
    next(error)
  }
}

const deactivateIngredient = async (req, res, next) => {
  try {
    const ingredientId = req.params.id

    const updatedIngredient = await ingredientService.deactivateIngredient(ingredientId)

    res.status(StatusCodes.OK).json({
      code: StatusCodes.OK,
      message: 'Ingredient deactivated successfully',
      data: updatedIngredient
    })
  } catch (error) {
    next(error)
  }
}

export const ingredientController = {
  getAll,
  getDetails,
  getDetailsByDishId,
  createNew,
  updateIngredient,
  activateIngredient,
  deactivateIngredient
}
