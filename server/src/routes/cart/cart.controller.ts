import {
  getCart,
  addCartItem,
  removeCartItem,
} from '../../models/product/product.model.js';

async function httpsGetCart(req, res) {
  const { items } = req.session;
  const { status, cart, message } = await getCart(items);
  return res.status(status).json({ cart, message });
}

async function httpsAddCartItem(req, res) {
  const { items } = req.session;
  const { status, newItems, cart, message } = await addCartItem(
    items,
    req.body
  );
  if (newItems) req.session.items = newItems;
  return res.status(status).json({ cart, message });
}

async function httpsRemoveCartItem(req, res) {
  return await httpsDecrementCartItem(req, res);
}

async function httpsDeleteCartItem(req, res) {
  return await httpsDecrementCartItem(req, res, true);
}

async function httpsDecrementCartItem(req, res, _delete?) {
  const { items } = req.session;
  const { status, newItems, cart, message } = await removeCartItem(
    items,
    req.body,
    _delete
  );
  if (newItems) req.session.items = newItems;
  return res.status(status).json({ cart, message });
}

export {
  httpsGetCart,
  httpsAddCartItem,
  httpsRemoveCartItem,
  httpsDeleteCartItem,
};
