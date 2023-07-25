import express from 'express';

import {
  httpsGetCart,
  httpsAddCartItem,
  httpsRemoveCartItem,
  httpsDeleteCartItem,
} from './cart.controller.js';
import cartSession from './cart.session.js';

const cartRoute = express.Router();

cartRoute.use(cartSession);

cartRoute.get('/', httpsGetCart);

cartRoute.post('/add', httpsAddCartItem);

cartRoute.delete('/remove', httpsRemoveCartItem);

cartRoute.delete('/delete', httpsDeleteCartItem);

export default cartRoute;
