import { StatusCodes } from 'http-status-codes'
import { reportService } from '@/services/reportService'

// Get all reports
const getAllReport = async (req, res, next) => {
  try {
    const { dishName, page = 1, limit = 10, sortBy = 'createdAt', order = 'desc' } = req.query

    const queryParams = {
      dishName: dishName?.trim(),
      page: parseInt(page),
      limit: parseInt(limit),
      skip: (parseInt(page) - 1) * parseInt(limit),
      sortBy: sortBy?.trim(),
      order: order?.trim()
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
    const { dishId, description } = req.body
    const userId = req.user._id
    const reportPayload = { dishId, userId, description }
    const report = await reportService.createReport(reportPayload)
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

// update
const updateReport = async (req, res, next) => {
  try {
    const { id } = req.params
    await reportService.updateReport(id)
    return res.status(StatusCodes.OK).json('Report updated successfully')
  } catch (error) {
    next(error)
  }
}

export const reportController = {
  getAllReport,
  createReport,
  deleteReport,
  updateReport
}
