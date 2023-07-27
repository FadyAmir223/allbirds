import express from 'express';
import passport from 'passport';

import { checkLoggedOut } from '../../../middlewares/checkAuth.js';
import { httpsLogin, httpsSignup } from './local.controller.js';

const localRoute = express.Router();

localRoute.post('/signup', checkLoggedOut, httpsSignup);

localRoute.post(
  '/login',
  checkLoggedOut,
  passport.authenticate('local'),
  httpsLogin
);

export default localRoute;
