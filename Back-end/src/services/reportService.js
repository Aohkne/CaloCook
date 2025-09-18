import { StatusCodes } from 'http-status-codes'
import { reportModel } from '@/models/reportModel'
import ApiError from '@/utils/ApiError'
import { ObjectId } from 'mongodb'
import { userModel } from '@/models/userModel'
import { dishModel } from '@/models/dishModel'

// Get all reports
const getAllReport = async (params = {}) => {
  try {
    const reports = await reportModel.getAllReports(params)

    // reports.data is an array; enrich each report with user email and dish name
    const data = await Promise.all(
      (reports.data || []).map(async (r) => {
        let user = null
        let dish = null

        try {
          user = r.userId ? await userModel.getDetails(r.userId) : null
        } catch (e) {
          // swallow per-item errors and continue
          user = null
        }

        try {
          dish = r.dishId ? await dishModel.getDetails(r.dishId) : null
        } catch (e) {
          dish = null
        }

        return {
          ...r,
          userEmail: user?.email ?? null,
          dishName: dish?.name ?? null
        }
      })
    )

    return { data, totalCount: reports.totalCount ?? (data ? data.length : 0) }
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
