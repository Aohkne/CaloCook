import express from 'express'
import { StatusCodes } from 'http-status-codes'

import { userRoute } from '@/routes/v1/userRoute'
import { authRoute } from '@/routes/v1/authRoute'
import { dishRoute } from '@/routes/v1/dishRoute'
import { ingredientRoute } from '@/routes/v1/ingredientRoute'
import { stepRoute } from '@/routes/v1/stepRoute'
import { dashboardRoute } from '@/routes/v1/dashboardRoute'
import { favoriteRoute } from '@/routes/v1/favoriteRoute'
import { historyRoute } from '@/routes/v1/historyRoute'
import { ratingRoute } from '@/routes/v1/ratingRoute'
const Router = express.Router()

/* Check API-v1 status */
Router.get('/status', (req, res) => {
  res.status(StatusCodes.OK).json({ message: 'APIs v1 are ready to use.', code: StatusCodes.OK })
})

/* API - Đường dẫn */
Router.use('/user', userRoute)
Router.use('/auth', authRoute)
Router.use('/dish', dishRoute)
Router.use('/ingredient', ingredientRoute)
Router.use('/step', stepRoute)
Router.use('/dashboard', dashboardRoute)
Router.use('/favorite', favoriteRoute)
Router.use('/history', historyRoute)
Router.use('/rating', ratingRoute)
export const APIs_V1 = Router
