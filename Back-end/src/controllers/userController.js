import { StatusCodes } from 'http-status-codes'
import { userService } from '@/services/userService'

const getAll = async (req, res, next) => {
  try {
    // NAVIGATION TO SERVICE
    const listUser = await userService.getAll()

    // RETURN CLIENT
    res.status(StatusCodes.OK).json({
      code: StatusCodes.OK,
      message: 'Get successful',
      data: listUser
    })
  } catch (error) {
    next(error)
  }
}

export const userController = {
  getAll
}
