import { addCartItem, getCart } from '../../models/cart/cart.model.js';

async function httpsGetCart(req, res) {
  let response;
  response = { cart: await getCart(req.params.id) };
  if (!response.cart) response = { message: "user doesn't exist" };
  return res.json(response);
}

async function httpsAddCartItem(req, res) {
  const { id: userId } = req.params;
  const { productId, editionId } = req.body;
  await addCartItem(userId, productId, editionId);
  return res.json({ success: true });
}

async function httpsRemoveCartItem(req, res) {}

async function httpsDeleteCartItem(req, res) {}

export {
  httpsGetCart,
  httpsAddCartItem,
  httpsRemoveCartItem,
  httpsDeleteCartItem,
};
