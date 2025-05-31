import { StatusCodes } from 'http-status-codes'
import { stepService } from '@/services/stepService'

const getAll = async (req, res, next) => {
  try {
    const { isActive, sortBy, order } = req.query

    // NAVIGATION TO SERVICE

    let step
    if (isActive) {
      step = await stepService.searchByIsActive(isActive, sortBy, order)
    } else {
      step = await stepService.getAll(sortBy, order)
    }

    // RETURN CLIENT
    res.status(StatusCodes.OK).json({
      code: StatusCodes.OK,
      message: 'Get successfull',
      data: step
    })
  } catch (error) {
    next(error)
  }
}

const getDetails = async (req, res, next) => {
  try {
    const stepId = req.params.id

    const step = await stepService.getDetails(stepId)

    res.status(StatusCodes.OK).json({
      code: StatusCodes.OK,
      message: 'Get successfull',
      data: step
    })
  } catch (error) {
    next(error)
  }
}

const getDetailsByDishId = async (req, res, next) => {
  try {
    const { sortBy, order } = req.query
    const dishId = req.params.dishId

    const step = await stepService.getDetailsByDishId(dishId, sortBy, order)

    res.status(StatusCodes.OK).json({
      code: StatusCodes.OK,
      message: 'Get successfull',
      data: step
    })
  } catch (error) {
    next(error)
  }
}

const createNew = async (req, res, next) => {
  try {
    const createdStep = await stepService.createNew(req.body)

    res.status(StatusCodes.CREATED).json({
      code: StatusCodes.CREATED,
      message: 'Create successfull',
      data: createdStep
    })
  } catch (error) {
    next(error)
  }
}

const updateStep = async (req, res, next) => {
  try {
    const stepId = req.params.id
    const updateData = req.body

    const updatedStep = await stepService.updateStep(stepId, updateData)

    res.status(StatusCodes.OK).json({
      code: StatusCodes.OK,
      message: 'Update successful',
      data: updatedStep
    })
  } catch (error) {
    next(error)
  }
}

const activateStep = async (req, res, next) => {
  try {
    const stepId = req.params.id

    const updatedStep = await stepService.activateStep(stepId)

    res.status(StatusCodes.OK).json({
      code: StatusCodes.OK,
      message: 'SupdatedStep activated successfully',
      data: updatedStep
    })
  } catch (error) {
    next(error)
  }
}

const deactivateStep = async (req, res, next) => {
  try {
    const stepId = req.params.id

    const updatedStep = await stepService.deactivateStep(stepId)

    res.status(StatusCodes.OK).json({
      code: StatusCodes.OK,
      message: 'Step deactivated successfully',
      data: updatedStep
    })
  } catch (error) {
    next(error)
  }
}

export const stepController = {
  getAll,
  getDetails,
  getDetailsByDishId,
  createNew,
  updateStep,
  activateStep,
  deactivateStep
}
