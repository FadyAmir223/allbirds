import express from 'express';

import {
  httpsGetCart,
  httpsAddCartItem,
  httpsRemoveCartItem,
  httpsDeleteCartItem,
} from './cart.controller.js';

const cartRoute = express.Router();

cartRoute.get('/:id', httpsGetCart);

cartRoute.post('/:id/add', httpsAddCartItem);

cartRoute.delete('/:id/remove', httpsRemoveCartItem);

cartRoute.delete('/:id/delete', httpsDeleteCartItem);

export default cartRoute;
