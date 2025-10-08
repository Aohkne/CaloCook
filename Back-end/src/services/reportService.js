import { StatusCodes } from 'http-status-codes'
import { reportModel } from '@/models/reportModel'
import ApiError from '@/utils/ApiError'
import { ObjectId } from 'mongodb'
import { userModel } from '@/models/userModel'
import { dishModel } from '@/models/dishModel'

// Get all reports
const getAllReport = async (queryParams = {}) => {
  try {
    const reports = await reportModel.getAllReports(queryParams)

    // Enrich data with user email and dish name
    const data = await Promise.all(
      (reports.data || []).map(async (r) => {
        const [user, dish] = await Promise.all([
          r.userId ? userModel.getDetails(r.userId).catch(() => null) : null,
          r.dishId ? dishModel.getDetails(r.dishId).catch(() => null) : null
        ])

        return {
          ...r,
          userEmail: user?.email ?? null,
          dishName: dish?.name ?? null
        }
      })
    )

    return { data, totalCount: reports.totalCount ?? data.length }
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
      checked: false,
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

// Update report - toggle checked status
const updateReport = async (id) => {
  try {
    const updatedReport = await reportModel.updateReport(id)
    return updatedReport
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Error updating report')
  }
}

const getAllForExport = async (filters) => {
  try {
    const { dishName } = filters

    // SET MAX LIMIT: for server overload
    const maxExportLimit = 10000

    let result

    if (dishName) {
      result = await reportModel.getAllForExport({ dishName }, maxExportLimit)
    } else {
      result = await reportModel.getAllForExport({}, maxExportLimit)
    }

    return result
  } catch (error) {
    throw error
  }
}

export const reportService = {
  getAllReport,
  createReport,
  deleteReport,
  updateReport,
  getAllForExport
}
