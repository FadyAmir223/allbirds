import express from 'express';
import passport from 'passport';

import localRoute from './local/local.route.js';
import googleRoute from './social/google.js';
import facebookRoute from './social/facebook.js';

import {
  htppsLogout,
  httpsVerifyUser,
  httpsRequestResetPassword,
  httpsVerifyResetToken,
  httpsResetPassword,
} from './auth.controller.js';
import { checkLoggedIn } from '../../middlewares/checkAuth.js';
import {
  userSession,
  regenerateMiddleware,
} from '../../config/auth.session.js';

import './passport.js';

const authRoute = express.Router();

authRoute.get('/verify/:verifyToken', httpsVerifyUser);

const passwordRoute = express.Router();
passwordRoute.post('/request-reset-token', httpsRequestResetPassword);
passwordRoute.post('/verify-reset-token', httpsVerifyResetToken);
passwordRoute.post('/reset', httpsResetPassword);
authRoute.use('/password', passwordRoute);

authRoute.use(userSession, regenerateMiddleware);
authRoute.use(passport.initialize(), passport.session());

authRoute.use('/local', localRoute);
authRoute.use('/google', googleRoute);
authRoute.use('/facebook', facebookRoute);
authRoute.post('/logout', checkLoggedIn, htppsLogout);

export default authRoute;
