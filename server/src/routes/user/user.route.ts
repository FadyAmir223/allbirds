import express from 'express';
import passport from 'passport';

import {
  htppsGetLocations,
  httpsAddLocation,
  httpsRemoveLocation,
  httpsUpdateLocation,
  httpsOrderCart,
  httpsGetOrders,
} from './user.controller.js';
import { checkLoggedIn } from '../../middlewares/checkAuth.js';
import {
  regenerateMiddleware,
  userSession,
} from '../../config/auth.session.js';
import { refreshTokenMiddleware } from '../../middlewares/refreshToken.js';

const userRoute = express.Router();

userRoute.use(userSession, regenerateMiddleware);
userRoute.use(passport.initialize(), passport.session());
userRoute.use(refreshTokenMiddleware);
userRoute.use(checkLoggedIn);

const locationRoute = express.Router();
locationRoute.get('/', htppsGetLocations);
locationRoute.post('/', httpsAddLocation);
locationRoute.delete('/:id', httpsRemoveLocation);
locationRoute.patch('/:id', httpsUpdateLocation);
userRoute.use('/locations', locationRoute);

const orderRoute = express.Router();
orderRoute.get('/', httpsGetOrders);
orderRoute.post('/', httpsOrderCart);
userRoute.use('/orders', orderRoute);

export default userRoute;
