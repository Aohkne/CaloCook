import { historyModel } from '@/models/historyModel'
import { StatusCodes } from 'http-status-codes'
import ApiError from '@/utils/ApiError'
import { ObjectId } from 'mongodb'


const addToHistory = async (userId, dishId) => {
  try {
    //console.log('Service: addToHistory', { userId, dishId })
 
    if (!ObjectId.isValid(userId) || !ObjectId.isValid(dishId)) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid userId or dishId')
    }


  const createdHistory = await historyModel.addToHistory({ userId, dishId })
    return createdHistory
  } catch (error) {

    if (error.message === 'User not found' || error.message === 'Dish not found') {
      throw new ApiError(StatusCodes.NOT_FOUND, error.message)
    }
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message)
  }
}
const viewHistoryDetail = async (historyId) => {
  try {
    //console.log('Service: viewHistoryDetail', { historyId })
    if (!ObjectId.isValid(historyId)) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid historyId')
    }
    const history = await historyModel.viewHistoryDetail(historyId)
    if (!history) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'History not found')
    }
    return history
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message)
  }
}

const viewHistory = async (userId) => {
  try {
    //console.log('Service: viewHistory', { userId })
    if (!ObjectId.isValid(userId)) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid userId')
    }

    const histories = await historyModel.viewHistory(userId)
    return histories
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message)
  }
}


const searchHistoryByUserId = async (userId) => {
  try {
    //console.log('Service: searchHistoryByUserId', { userId })
    if (!ObjectId.isValid(userId)) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid userId')
    }

    const histories = await historyModel.searchByUserId(userId)
    return histories
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message)
  }
}


const searchHistoryByDishId = async (dishId) => {
  try {
    //console.log('Service: searchHistoryByDishId', { dishId })
    if (!ObjectId.isValid(dishId)) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid dishId')
    }

    const histories = await historyModel.searchByDishId(dishId)
    return histories
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message)
  }
}


const deleteHistory = async (historyId) => {
  try {
    //console.log('Service: deleteHistory', { historyId })
    if (!ObjectId.isValid(historyId)) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid historyId')
    }

    const result = await historyModel.deleteFromHistory(historyId)
    return result
  } catch (error) {
    if (error.message === 'History not found' || error.message === 'Invalid historyId') {
      throw new ApiError(StatusCodes.NOT_FOUND, error.message)
    }
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message)
  }
}


const editHistory = async (historyId, consumedAt) => {
  try {
    //console.log('Service: editHistory', { historyId, consumedAt })
 
    if (!ObjectId.isValid(historyId)) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid historyId')
    }
   if (!consumedAt || isNaN(new Date(consumedAt).getTime())) {
  throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid consumedAt date')
}

    const updatedHistory = await historyModel.editHistory({ historyId, consumedAt })
    return updatedHistory
  } catch (error) {

    if (error.message === 'History not found') {
      throw new ApiError(StatusCodes.NOT_FOUND, error.message)
    }
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message)
  }
}
const getTotalCalories = async (userId, date) => {
  try {
    //console.log('Service: getTotalCalories', { userId, date })
    if (!ObjectId.isValid(userId)) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid userId')
    }
    const targetDate = date ? new Date(date) : new Date()
    if (isNaN(targetDate.getTime())) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid date format')
    }
    const result = await historyModel.getTotalCaloriesByDate(userId, targetDate)
    return result
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message)
  }
}
export const historyService = {
  addToHistory,
  viewHistory,
  searchHistoryByUserId,
  searchHistoryByDishId,
  deleteHistory,
  editHistory,
  viewHistoryDetail,
  getTotalCalories
}
