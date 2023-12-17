import { Request, Response } from 'express'

import {
  getUserInfo,
  addLocation,
  getLocations,
  removeLocation,
  updateLocation,
  getOrders,
  orderCart,
} from '../../models/user/user.model.js'
import { NODE_ENV, SERVER_URL } from '../../config/env.js'

async function httpsGetUser(req: Request, res: Response) {
  const { status, user } = await getUserInfo(req.user._id)

  res.status(status).json({ user })
}

async function htppsGetLocations(req: Request, res: Response) {
  const { status, message, locations } = await getLocations(req.user._id)
  res.status(status).json({ message, locations })
}

async function httpsAddLocation(
  req: Request,
  res: Response,
): Promise<Response> {
  const { address, city, country, state, phone } = req.body

  if (!(address && city && country && state && phone))
    return res.status(400).json({ message: 'some fields are missing' })

  const { status, location, message } = await addLocation(
    req.user._id,
    req.body,
  )
  res.status(status).json({ location, message })
}

async function httpsRemoveLocation(
  req: Request,
  res: Response,
): Promise<Response> {
  const { id } = req.params

  if (!id || id.length !== 24)
    return res.status(400).json({ message: 'invalid location id' })

  const { status, locations, message } = await removeLocation(
    req.user._id,
    req.params.id,
  )
  res.status(status).json({ locations, message })
}

async function httpsUpdateLocation(
  req: Request,
  res: Response,
): Promise<Response> {
  const { id } = req.params
  const { body } = req

  if (!id || id.length !== 24)
    return res.status(400).json({ message: 'invalid location id' })

  if (Object.values(body).every((value) => value === ''))
    return res.status(400).json({ message: 'no fields to update location' })

  const { status, locations, message } = await updateLocation(
    req.user._id,
    req.params,
    body,
  )

  res.status(status).json({ locations, message })
}

async function httpsOrderCart(req: Request, res: Response): Promise<Response> {
  const userId = req.user._id
  const { items } = req.body

  if (items?.length === 0)
    return res.status(400).json({ message: 'there is no items to purchase' })

  const { status, orders, soldOutItems, message } = await orderCart(
    userId,
    items,
  )
  res.status(status).json({ orders, soldOutItems, message })
}

async function httpsGetOrders(req: Request, res: Response) {
  const { status, orders, message } = await getOrders(req.user._id)
  res.status(status).json({ orders, message })
}

async function httpsGetOrderHistory(req: Request, res: Response) {
  const { status, orders, message } = await getOrders(req.user._id, true)
  res.status(status).json({ orders, message })
}

export {
  httpsGetUser,
  htppsGetLocations,
  httpsAddLocation,
  httpsRemoveLocation,
  httpsUpdateLocation,
  httpsOrderCart,
  httpsGetOrders,
  httpsGetOrderHistory,
}
