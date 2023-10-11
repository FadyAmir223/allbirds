import express from 'express';

import {
  httpsGetCart,
  httpsAddCartItem,
  httpsRemoveCartItem,
  httpsDeleteCartItem,
  httpsOrderCart,
} from './cart.controller.js';
import cartSession from '../../config/cart.session.js';

const cartRoute = express.Router();

cartRoute.use(cartSession);

cartRoute.get('/', httpsGetCart);
cartRoute.post('/add', httpsAddCartItem);
cartRoute.delete('/remove', httpsRemoveCartItem);
cartRoute.delete('/delete', httpsDeleteCartItem);

cartRoute.get('/orders', httpsOrderCart);

export default cartRoute;
