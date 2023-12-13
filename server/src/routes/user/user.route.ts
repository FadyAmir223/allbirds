import express from 'express'

import {
  httpsGetUser,
  htppsGetLocations,
  httpsAddLocation,
  httpsRemoveLocation,
  httpsUpdateLocation,
  httpsOrderCart,
  httpsGetOrders,
  httpsGetOrderHistory,
} from './user.controller.js'
import needAuth from '../../middlewares/needAuth.js'

const userRoute = express.Router()

userRoute.use(needAuth)
userRoute.get('/', httpsGetUser)

const locationRoute = express.Router()
locationRoute.get('/', htppsGetLocations)
locationRoute.post('/', httpsAddLocation)
locationRoute.delete('/:id', httpsRemoveLocation)
locationRoute.patch('/:id', httpsUpdateLocation)
userRoute.use('/locations', locationRoute)

const orderRoute = express.Router()
orderRoute.get('/', httpsGetOrders)
orderRoute.post('/', httpsOrderCart)
orderRoute.get('/history', httpsGetOrderHistory)
userRoute.use('/orders', orderRoute)

export default userRoute
