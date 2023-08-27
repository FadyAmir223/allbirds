import { Request, Response } from 'express';

import {
  addLocation,
  getLocations,
  removeLocation,
  updateLocation,
  getOrders,
} from '../../models/user/user.model.js';
import { SERVER_URL } from '../../utils/loadEnv.js';

async function htppsGetLocations(req: Request, res: Response) {
  const { status, message, locations } = await getLocations(req.user._id);
  res.status(status).json({ message, locations });
}

async function httpsAddLocation(
  req: Request,
  res: Response
): Promise<Response> {
  const { address, city, country, state, phone } = req.body;

  if (!(address && city && country && state && phone))
    return res.status(400).json({ message: 'some fields are missing' });

  const { status, locations, message } = await addLocation(
    req.user._id,
    req.body
  );
  res.status(status).json({ locations, message });
}

async function httpsRemoveLocation(
  req: Request,
  res: Response
): Promise<Response> {
  const { id } = req.params;

  if (!id || id.length !== 24)
    return res.status(400).json({ message: 'invalid location id' });

  const { status, locations, message } = await removeLocation(
    req.user._id,
    req.params.id
  );
  res.status(status).json({ locations, message });
}

async function httpsUpdateLocation(
  req: Request,
  res: Response
): Promise<Response> {
  const { id } = req.params;
  const { body } = req;

  if (!id || id.length !== 24)
    return res.status(400).json({ message: 'invalid location id' });

  if (Object.values(body).every((value) => value === ''))
    return res.status(400).json({ message: 'no fields to update location' });

  const { status, locations, message } = await updateLocation(
    req.user._id,
    req.params,
    body
  );

  res.status(status).json({ locations, message });
}

function httpsOrderCart(req: Request, res: Response) {
  res.redirect(`${SERVER_URL}/api/cart/orders?userId=${req.user._id}`);
}

async function httpsGetOrders(req: Request, res: Response) {
  const { status, orders, message } = await getOrders(req.user._id);
  res.status(status).json({ orders, message });
}

async function httpsGetOrderHistory(req: Request, res: Response) {
  const { status, orders, message } = await getOrders(req.user._id, true);
  res.status(status).json({ orders, message });
}

export {
  htppsGetLocations,
  httpsAddLocation,
  httpsRemoveLocation,
  httpsUpdateLocation,
  httpsOrderCart,
  httpsGetOrders,
  httpsGetOrderHistory,
};
