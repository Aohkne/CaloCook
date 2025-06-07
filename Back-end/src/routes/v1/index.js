import express from 'express'
import { StatusCodes } from 'http-status-codes'

import { userRoute } from '@/routes/v1/userRoute'
import { dishRoute } from '@/routes/v1/dishRoute'
import { ingredientRoute } from '@/routes/v1/ingredientRoute'
import { stepRoute } from '@/routes/v1/stepRoute'
import { favoriteRoute } from '@/routes/v1/favoriteRoute'
import { historyRoute } from '@/routes/v1/historyRoute'

const Router = express.Router()

/* Check API-v1 status */
Router.get('/status', (req, res) => {
  res.status(StatusCodes.OK).json({ message: 'APIs v1 are ready to use.', code: StatusCodes.OK })
})

/* API - Đường dẫn */
Router.use('/user', userRoute)
Router.use('/dish', dishRoute)
Router.use('/ingredient', ingredientRoute)
Router.use('/step', stepRoute)
Router.use('/favorite', favoriteRoute)
Router.use('/history', historyRoute)

export const APIs_V1 = Router