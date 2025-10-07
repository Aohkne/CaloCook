import { StatusCodes } from 'http-status-codes'
import { dishService } from '@/services/dishService'

import { paginationHelper } from '@/utils/pagination'
import { exportHelper } from '@/utils/exportHelper'

const getAll = async (req, res, next) => {
  try {
    const { name, minCookingTime, maxCookingTime, minCalorie, maxCalorie, difficulty, isActive } = req.query
    const paginationParams = req.pagination

    const hasMultipleFilters =
      [name, minCookingTime, maxCookingTime, minCalorie, maxCalorie, difficulty, isActive].filter(
        (f) => f !== undefined && f !== ''
      ).length > 0

    let result

    if (hasMultipleFilters) {
      result = await dishService.getAllWithFilters(
        {
          name,
          minCookingTime,
          maxCookingTime,
          minCalorie,
          maxCalorie,
          difficulty,
          isActive
        },
        paginationParams
      )
    } else {
      result = await dishService.getAll(paginationParams)
    }

    const response = paginationHelper.formatPaginatedResponse(
      'Get successful',
      result.totalCount,
      paginationParams,
      result.data
    )

    res.status(StatusCodes.OK).json(response)
  } catch (error) {
    next(error)
  }
}

const getDetails = async (req, res, next) => {
  try {
    const dishId = req.params.id

    const dish = await dishService.getDetails(dishId)

    res.status(StatusCodes.OK).json({
      code: StatusCodes.OK,
      message: 'Get successfull',
      data: dish
    })
  } catch (error) {
    next(error)
  }
}

const getRandomUnfavoritedDishes = async (req, res, next) => {
  try {
    const { id } = req.params
    const { limit } = req.query

    const dish = await dishService.getRandomUnfavoritedDishes(id, limit)

    res.status(StatusCodes.OK).json({
      code: StatusCodes.OK,
      message: 'Get successfull',
      data: dish
    })
  } catch (error) {
    next(error)
  }
}

const createNew = async (req, res, next) => {
  try {
    const createdDish = await dishService.createNew(req.body)

    res.status(StatusCodes.CREATED).json({
      code: StatusCodes.CREATED,
      message: 'Create successfull',
      data: createdDish
    })
  } catch (error) {
    next(error)
  }
}

const updateDish = async (req, res, next) => {
  try {
    const dishId = req.params.id
    const updateData = req.body

    const updatedDish = await dishService.updateDish(dishId, updateData)

    res.status(StatusCodes.OK).json({
      code: StatusCodes.OK,
      message: 'Update successful',
      data: updatedDish
    })
  } catch (error) {
    next(error)
  }
}

const activateDish = async (req, res, next) => {
  try {
    const dishId = req.params.id

    const updatedDish = await dishService.activateDish(dishId)

    res.status(StatusCodes.OK).json({
      code: StatusCodes.OK,
      message: 'Dish activated successfully',
      data: updatedDish
    })
  } catch (error) {
    next(error)
  }
}

const deactivateDish = async (req, res, next) => {
  try {
    const dishId = req.params.id

    const updatedDish = await dishService.deactivateDish(dishId)

    res.status(StatusCodes.OK).json({
      code: StatusCodes.OK,
      message: 'Dish deactivated successfully',
      data: updatedDish
    })
  } catch (error) {
    next(error)
  }
}

const getDishCount = async (req, res, next) => {
  try {
    const dishCount = await dishService.getDishCount()

    res.status(StatusCodes.OK).json({
      code: StatusCodes.OK,
      message: 'Dish count retrieved successfully',
      data: dishCount
    })
  } catch (error) {
    next(error)
  }
}

const exportExcel = async (req, res, next) => {
  try {
    // FILTER
    const { name, minCookingTime, maxCookingTime, minCalorie, maxCalorie, difficulty, isActive } = req.query

    const dishes = await dishService.getAllForExport({
      name,
      minCookingTime,
      maxCookingTime,
      minCalorie,
      maxCalorie,
      difficulty,
      isActive
    })

    if (!dishes || dishes.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({
        code: StatusCodes.NOT_FOUND,
        message: 'No dishes found to export'
      })
    }

    // GENERATE EXCEL
    const buffer = await exportHelper.generateExcelFile(dishes)

    // SET RESPONSE HEADER
    const filename = `dishes_${new Date().toISOString().split('T')[0]}.xlsx`
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`)
    res.setHeader('Content-Length', buffer.length)

    // SEND
    res.send(buffer)
  } catch (error) {
    next(error)
  }
}

const exportCSV = async (req, res, next) => {
  try {
    //FILTER
    const { name, minCookingTime, maxCookingTime, minCalorie, maxCalorie, difficulty, isActive } = req.query

    const dishes = await dishService.getAllForExport({
      name,
      minCookingTime,
      maxCookingTime,
      minCalorie,
      maxCalorie,
      difficulty,
      isActive
    })

    if (!dishes || dishes.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({
        code: StatusCodes.NOT_FOUND,
        message: 'No dishes found to export'
      })
    }

    // GENERATE CSV
    const csv = await exportHelper.generateCSVFile(dishes)

    // SET RESPONSE HEADER
    const filename = `dishes_${new Date().toISOString().split('T')[0]}.csv`
    res.setHeader('Content-Type', 'text/csv; charset=utf-8')
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`)

    // SEND
    res.send('\uFEFF' + csv)
  } catch (error) {
    next(error)
  }
}

export const dishController = {
  getAll,
  getDetails,
  getRandomUnfavoritedDishes,
  createNew,
  updateDish,
  activateDish,
  deactivateDish,
  getDishCount,
  exportExcel,
  exportCSV
}
