import expesss from 'express'
import { StatusCodes } from 'http-status-codes'

import { userRoute } from '@/routes/v1/userRoute'
import { authRoute } from '@/routes/v1/authRoute'
import { dishRoute } from '@/routes/v1/dishRoute'
import { ingredientRoute } from '@/routes/v1/ingredientRoute'
import { stepRoute } from '@/routes/v1/stepRoute'

const Router = expesss.Router()

/* Check API-v1 status */
Router.get('/status', (req, res) => {
  res.status(StatusCodes.OK).json({ message: 'APIS v1 are ready to use.', code: StatusCodes.OK })
})

/* API - Đường dẫn*/
Router.use('/user', userRoute)
Router.use('/auth', authRoute)
Router.use('/dish', dishRoute)
Router.use('/ingredient', ingredientRoute)
Router.use('/step', stepRoute)

export const APIs_V1 = Router
