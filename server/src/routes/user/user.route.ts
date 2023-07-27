import express from 'express';
import passport from 'passport';

import { htppsGetSecret } from './user.controller.js';
import {
  checkLoggedIn,
  checkPermissions,
} from '../../middlewares/checkAuth.js';
import {
  regenerateMiddleware,
  userSession,
} from '../../config/auth.session.js';
import { refreshTokenMiddleware } from '../../middlewares/refreshToken.js';

const userRoute = express.Router();

userRoute.use(userSession, regenerateMiddleware);

userRoute.use(passport.initialize(), passport.session());

userRoute.use(refreshTokenMiddleware);

userRoute.get('/secret', checkLoggedIn, checkPermissions, htppsGetSecret);

export default userRoute;
