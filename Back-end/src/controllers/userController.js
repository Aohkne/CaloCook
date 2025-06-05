import { StatusCodes } from 'http-status-codes'
import { userService } from '@/services/userService'

const getAll = async (req, res, next) => {
  try {
    const { username, email, isActive, sortBy, order } = req.query

    // NAVIGATION TO SERVICE

    let users
    if (username) {
      users = await userService.searchByUsername(username, sortBy, order)
    } else if (email) {
      users = await userService.searchByEmail(email, sortBy, order)
    } else if (isActive !== undefined) {
      users = await userService.searchByIsActive(isActive, sortBy, order)
    } else {
      users = await userService.getAll(sortBy, order)
    }

    // RETURN CLIENT
    res.status(StatusCodes.OK).json({
      code: StatusCodes.OK,
      message: 'Get successfull',
      data: users
    })
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
