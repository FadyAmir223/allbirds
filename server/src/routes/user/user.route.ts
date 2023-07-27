import express from 'express';
import passport from 'passport';

import { htppsGetSecret } from './user.controller.js';
import {
  checkLoggedIn,
  checkPermissions,
} from '../../middlewares/auth.checks.js';

import {
  regenerateMiddleware,
  userSession,
} from '../../config/auth.session.js';

const userRoute = express.Router();

userRoute.use(userSession, regenerateMiddleware);

userRoute.use(passport.initialize(), passport.session());

userRoute.get('/secret', checkLoggedIn, checkPermissions, htppsGetSecret);

export default userRoute;
