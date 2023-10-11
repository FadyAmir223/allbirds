import express from 'express';
import passport from 'passport';

import { checkLoggedOut } from '../../../middlewares/checkAuth.js';
import { httpsSignup } from './local.controller.js';
import {
  createAccountRateLimitMiddleware,
  loginRateLimitMiddleware,
} from '../../../middlewares/rateLimit.js';
import { socialCallback } from '../social/_verifyCallback.js';

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
  loginRateLimitMiddleware,
  passport.authenticate('local'),
  socialCallback
);

export default localRoute;
