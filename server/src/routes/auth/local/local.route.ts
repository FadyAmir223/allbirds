import express from 'express';
import passport from 'passport';

import { checkLoggedOut } from '../../../middlewares/checkAuth.js';
import { httpsLogin, httpsSignup } from './local.controller.js';
import {
  createAccountRateLimitMiddleware,
  failedLoginRateLimitMiddleware,
} from '../../../middlewares/rateLimit.js';

const localRoute = express.Router();

localRoute.post(
  '/signup',
  checkLoggedOut,
  createAccountRateLimitMiddleware,
  httpsSignup
);

localRoute.post(
  '/login',
  checkLoggedOut,
  failedLoginRateLimitMiddleware,
  passport.authenticate('local'),
  httpsLogin
);

export default localRoute;
