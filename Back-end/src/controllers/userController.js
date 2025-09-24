import { StatusCodes } from 'http-status-codes'
import { userService } from '@/services/userService'
import { paginationHelper } from '@/utils/pagination'

const getAll = async (req, res, next) => {
  try {
    const { username, email, isActive } = req.query

    const paginationParams = req.pagination

    // NAVIGATION TO SERVICE

    let result
    if (username) {
      result = await userService.searchByUsername(username, paginationParams)
    } else if (email) {
      result = await userService.searchByEmail(email, paginationParams)
    } else if (isActive !== undefined) {
      result = await userService.searchByIsActive(isActive, paginationParams)
    } else {
      result = await userService.getAllUsers(paginationParams)
    }

    const response = paginationHelper.formatPaginatedResponse(
      'Get successful',
      result.totalCount,
      paginationParams,
      result.data
    )

    // RETURN CLIENT
    res.status(StatusCodes.OK).json(response)
  } catch (error) {
    next(error)
  }
}

const getDetails = async (req, res, next) => {
  try {
    const userId = req.params.id

    const user = await userService.getDetails(userId)

    // RETURN CLIENT
    res.status(StatusCodes.OK).json({
      code: StatusCodes.OK,
      message: 'Get successfull',
      data: user
    })
  } catch (error) {
    next(error)
  }
}

const activateUser = async (req, res, next) => {
  try {
    const userId = req.params.id

    const updatedUser = await userService.activateUser(userId)

    res.status(StatusCodes.OK).json({
      code: StatusCodes.OK,
      message: 'User activated successfully',
      data: updatedUser
    })
  } catch (error) {
    next(error)
  }
}

const deactivateUser = async (req, res, next) => {
  try {
    const userId = req.params.id

    const updatedUser = await userService.deactivateUser(userId)

    res.status(StatusCodes.OK).json({
      code: StatusCodes.OK,
      message: 'User deactivated successfully',
      data: updatedUser
    })
  } catch (error) {
    next(error)
  }
}

// lay so luong dish
const getUserCount = async (req, res, next) => {
  try {
    const userCount = await userService.getUserCount()

    res.status(StatusCodes.OK).json({
      code: StatusCodes.OK,
      message: 'User count retrieved successfully',
      data: userCount
    })
  } catch (error) {
    next(error)
  }
}

export const userController = {
  getAll,
  getDetails,
  activateUser,
  deactivateUser,
  getUserCount
}
