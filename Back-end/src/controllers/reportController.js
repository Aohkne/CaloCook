import { StatusCodes } from 'http-status-codes'
import { reportService } from '@/services/reportService'

// Get all reports
const getAllReport = async (req, res, next) => {
  try {
    const { dishName, page, limit, sortBy, order } = req.query

    // queryParams to trim whitespace and include pagination + sorting
    const queryParams = {
      ...(dishName && { dishName: dishName.trim() }),
      ...(page && { page: parseInt(page, 10) }), // Current page number
      ...(limit && { limit: parseInt(limit, 10) }), // Number of items per page
      ...(sortBy && { sortBy: sortBy.trim() }), // Sort field
      ...(order && { order: order.trim() }) // Sort direction
    }
    const reports = await reportService.getAllReport(queryParams)
    res.status(StatusCodes.OK).json(reports)
  } catch (error) {
    next(error)
  }
}

// Create a report
const createReport = async (req, res, next) => {
  try {
    const report = await reportService.createReport(req.body)
    res.status(StatusCodes.CREATED).json(report)
  } catch (error) {
    next(error)
  }
}

const deleteReport = async (req, res, next) => {
  try {
    const { id } = req.params
    const result = await reportService.deleteReport(id)
    return res.status(StatusCodes.NO_CONTENT).send()
  } catch (error) {
    next(error)
  }
}

export const reportController = {
  getAllReport,
  createReport,
  deleteReport
}
