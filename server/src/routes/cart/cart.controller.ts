import {
  getCart,
  addCartItem,
  removeCartItem,
  // deleteCartItem,
} from '../../models/cart/cart.model.js';

async function httpsGetCart(req, res) {
  const { id } = req.params;
  const cart = await getCart(id);
  return res.json({ cart });
}

async function httpsAddCartItem(req, res) {
  const { id: userId } = req.params;
  const { productId, editionId, size } = req.body;
  const { status, cart, message } = await addCartItem(
    userId,
    productId,
    editionId,
    size
  );
  return res.status(status).json({ cart, message });
}

async function httpsRemoveCartItem(req, res) {
  const { id: userId } = req.params;
  const { editionId, size } = req.body;
  const { status, cart, message } = await removeCartItem(
    userId,
    editionId,
    size
  );
  return res.status(status).json({ cart, message });
}

async function httpsDeleteCartItem(req, res) {
  const { id: userId } = req.params;
  const { editionId, size } = req.body;
  const { status, cart, message } = await removeCartItem(
    userId,
    editionId,
    size,
    true
  );
  return res.status(status).json({ cart, message });
}

export {
  httpsGetCart,
  httpsAddCartItem,
  httpsRemoveCartItem,
  httpsDeleteCartItem,
};
