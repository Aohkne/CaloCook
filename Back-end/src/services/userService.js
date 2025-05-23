import { userModel } from '@/models/userModel'
import { slugify } from '@/utils/formatters'

const getAll = async () => {
  try {
    return await userModel.getAll()
  } catch (error) {
    throw error
  }
}

export const userService = {
  getAll
}
