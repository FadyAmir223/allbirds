import { Request, Response } from 'express';

import {
  getCart,
  addCartItem,
  removeCartItem,
} from '../../models/product/product.model.js';
import { orderCart } from '../../models/user/user.model.js';
import { NODE_ENV } from '../../utils/loadEnv.js';

async function httpsGetCart(req: Request, res: Response) {
  const { items } = req.session;
  const { status, cart, message } = await getCart(items);
  res.status(status).json({ cart, message });
}

async function httpsAddCartItem(req: Request, res: Response) {
  const { handle, editionId, size } = req.body;

  if (!(handle && editionId && size))
    return res.status(400).json({ message: 'some fields are empty' });

  const { items } = req.session;

  const { status, newItems, cart, message } = await addCartItem(
    items,
    req.body
  );

  if (newItems) req.session.items = newItems;

  res.status(status).json({ cart, message });
}

async function httpsRemoveCartItem(req: Request, res: Response) {
  return await httpsDecrementCartItem(req, res);
}

async function httpsDeleteCartItem(req: Request, res: Response) {
  return await httpsDecrementCartItem(req, res, true);
}

async function httpsDecrementCartItem(req, res, _delete?) {
  const { items } = req.session;

  const { editionId, size } = req.body;

  if (!(editionId && size))
    return res.status(400).json({ message: 'some fields are empty' });

  const { status, newItems, cart, message } = await removeCartItem(
    items,
    req.body,
    _delete
  );
  if (newItems) req.session.items = newItems;
  res.status(status).json({ cart, message });
}

async function httpsOrderCart(req: Request, res: Response): Promise<Response> {
  let { userId } = req.query;

  if (NODE_ENV === 'test')
    userId = JSON.parse(
      Buffer.from(req.cookies?.user || '', 'base64').toString('utf8')
    ).passport.user;

  const { items } = req.session;

  if (!items || items?.length === 0)
    return res.status(400).json({ message: 'there is no items to purchase' });

  const { status, orders, message } = await orderCart(userId, items);
  req.session.items = [];
  res.status(status).json({ orders, message });
}

export {
  httpsGetCart,
  httpsAddCartItem,
  httpsRemoveCartItem,
  httpsDeleteCartItem,
  httpsOrderCart,
};
