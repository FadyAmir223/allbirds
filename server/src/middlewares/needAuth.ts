import express from 'express';
import passport from 'passport';

import { regenerateMiddleware, userSession } from '../config/auth.session.js';
import { refreshTokenMiddleware } from './refreshToken.js';
import { checkLoggedIn } from './checkAuth.js';

const needAuth = express.Router();

needAuth.use(userSession, regenerateMiddleware);
needAuth.use(passport.initialize(), passport.session());
needAuth.use(refreshTokenMiddleware);
needAuth.use(checkLoggedIn);

export default needAuth;
