import express from 'express';
import passport from 'passport';

import {
  httpsGetCart,
  httpsAddCartItem,
  httpsRemoveCartItem,
  httpsDeleteCartItem,
  httpsOrderCart,
} from './cart.controller.js';
import cartSession from '../../config/cart.session.js';
import {
  regenerateMiddleware,
  userSession,
} from '../../config/auth.session.js';
import { checkLoggedIn } from '../../middlewares/checkAuth.js';

const cartRoute = express.Router();

cartRoute.use(cartSession);

cartRoute.get('/', httpsGetCart);
cartRoute.post('/add', httpsAddCartItem);
cartRoute.delete('/remove', httpsRemoveCartItem);
cartRoute.delete('/delete', httpsDeleteCartItem);

cartRoute.use(userSession, regenerateMiddleware);
cartRoute.use(passport.initialize(), passport.session());
cartRoute.use(checkLoggedIn);

cartRoute.post('/order', httpsOrderCart);

export default cartRoute;
