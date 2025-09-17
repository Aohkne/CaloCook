import { StatusCodes } from 'http-status-codes'
import { reportModel } from '@/models/reportModel'
import ApiError from '@/utils/ApiError'
import { ObjectId } from 'mongodb'

// Get all reports
const getAllReport = async () => {
  try {
    const reports = await reportModel.getAllReports()
    return reports
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Error fetching reports')
  }
}

// Create a report
const createReport = async (reportPayload) => {
  try {
    const newReport = await reportModel.createReport({
      dishId: new ObjectId(reportPayload.dishId),
      userId: new ObjectId(reportPayload.userId),
      description: reportPayload.description,
      createdAt: new Date()
    })
    return newReport
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Error creating report')
  }
}

// Delete a report
const deleteReport = async (id) => {
    try {
        const result = await reportModel.deleteReport(id)
        return result
    } catch (error) {
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Error deleting report')
    }
}
export const reportService = {
  getAllReport,
  createReport,
  deleteReport
}