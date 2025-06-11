import { StatusCodes } from 'http-status-codes'
import { historyService } from '@/services/historyService'

const addToHistory = async (req, res, next) => {
    try {
        const { userId } = req.params
        const { dishId } = req.body

        const createdHistory = await historyService.addToHistory(userId, dishId)

        res.status(StatusCodes.CREATED).json({
            statusCode: StatusCodes.CREATED,
            message: 'History added successfully',
            data: createdHistory
        })
    } catch (error) {
        next(error)
    }
}

const viewHistory = async (req, res, next) => {
    try {
        const { userId } = req.params

        const histories = await historyService.viewHistory(userId)

        res.status(StatusCodes.OK).json({
            statusCode: StatusCodes.OK,
            message: 'History retrieved successfully',
            data: histories
        })
    } catch (error) {
        next(error)
    }
}
const viewHistoryDetail = async (req, res, next) => {
  try {
    const { historyId } = req.params
    console.log('Controller: viewHistoryDetail', { historyId })
    const history = await historyService.viewHistoryDetail(historyId)
    res.status(StatusCodes.OK).json({
      code: StatusCodes.OK,
      message: 'History details retrieved successfully',
      data: history
    })
  } catch (error) {
    next(error)
  }
}

const searchByUserId = async (req, res, next) => {
    try {
        const { userId } = req.params

        const histories = await historyService.searchHistoryByUserId(userId)

        res.status(StatusCodes.OK).json({
            statusCode: StatusCodes.OK,
            message: 'History retrieved successfully',
            data: histories
        })
    } catch (error) {
        next(error)
    }
}

const searchByDishId = async (req, res, next) => {
    try {
        const { dishId } = req.params

        const histories = await historyService.searchHistoryByDishId(dishId)

        res.status(StatusCodes.OK).json({
            statusCode: StatusCodes.OK,
            message: 'History retrieved successfully',
            data: histories
        })
    } catch (error) {
        next(error)
    }
}

const deleteFromHistory = async (req, res, next) => {
    try {
        const { historyId } = req.params

        const result = await historyService.deleteHistory(historyId)

        res.status(StatusCodes.OK).json({
            statusCode: StatusCodes.OK,
            message: 'History deleted successfully',
            data: result
        })
    } catch (error) {
        next(error)
    }
}

const editHistory = async (req, res, next) => {
    try {
        const { historyId } = req.params
        const { consumedAt } = req.body
        const updatedHistory = await historyService.editHistory(historyId, consumedAt)

        res.status(StatusCodes.OK).json({
            statusCode: StatusCodes.OK,
            message: 'History updated successfully',
            data: updatedHistory
        })
    } catch (error) {
        next(error)
    }
}
const getTotalCalories = async (req, res, next) => {
  try {
    const { userId } = req.params
    const { date } = req.query
    const result = await historyService.getTotalCalories(userId, date)
    res.status(StatusCodes.OK).json({
 statusCode: StatusCodes.OK,
      message: 'History retrieved successfully',
      data: result
    })
  } catch (error) {
    next(error)
  }
}
export const historyController = {
    addToHistory,
    viewHistory,
    searchByUserId,
    searchByDishId,
    deleteFromHistory,
    editHistory,
    viewHistoryDetail,
    getTotalCalories
}