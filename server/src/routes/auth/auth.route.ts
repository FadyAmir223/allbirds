import express from 'express';
import passport from 'passport';

import localRoute from './local/local.route.js';
import googleRoute from './social/google.js';

import { htppsLogout } from './auth.controller.js';
import { checkLoggedIn } from '../../middlewares/checkAuth.js';
import {
  userSession,
  regenerateMiddleware,
} from '../../config/auth.session.js';

import './passport.js';

const authRoute = express.Router();

authRoute.use(userSession, regenerateMiddleware);

authRoute.use(passport.initialize(), passport.session());

authRoute.use('/local', localRoute);

authRoute.use('/google', googleRoute);

authRoute.post('/logout', checkLoggedIn, htppsLogout);

export default authRoute;
