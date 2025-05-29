import expesss from 'express'
import { StatusCodes } from 'http-status-codes'

import { userRoute } from '@/routes/v1/userRoute'
import { dishRoute } from '@/routes/v1/dishRoute'

const Router = expesss.Router()

/* Check API-v1 status */
Router.get('/status', (req, res) => {
  res.status(StatusCodes.OK).json({ message: 'APIS v1 are ready to use.', code: StatusCodes.OK })
})

/* API - Đường dẫn*/
Router.use('/user', userRoute)
Router.use('/dish', dishRoute)

export const APIs_V1 = Router
