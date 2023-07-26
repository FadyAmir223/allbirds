import express from 'express';
import passport from 'passport';

import {
  checkLoggedIn,
  checkLoggedOut,
  checkPermissions,
} from '../../middlewares/auth/auth.checks.js';
import {
  regenerateMiddleware,
  userLocalSession,
} from '../../config/auth.session.js';
import {
  httpsSignup,
  httpsLogin,
  htppsLogout,
  htppsSecret,
} from './auth.controller.js';

import './auth.passport.js';

const authRoute = express.Router();

authRoute.use(userLocalSession);

authRoute.use(regenerateMiddleware);

authRoute.use(passport.initialize());

authRoute.use(passport.session());

authRoute.post('/signup', checkLoggedOut, httpsSignup);

authRoute.post(
  '/login',
  checkLoggedOut,
  passport.authenticate('local'),
  httpsLogin
);

authRoute.post('/logout', checkLoggedIn, htppsLogout);

authRoute.get('/secret', checkLoggedIn, checkPermissions, htppsSecret);

export default authRoute;
