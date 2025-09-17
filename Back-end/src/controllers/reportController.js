import { StatusCodes } from 'http-status-codes'
import { reportService } from '@/services/reportService'

// Get all reports
const getAllReport = async (req, res, next) => {
  try {
    const reports = await reportService.getAllReport()
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
