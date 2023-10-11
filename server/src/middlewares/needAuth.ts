import express from 'express';
import passport from 'passport';

import { regenerateMiddleware, userSession } from '../config/auth.session.js';
import { refreshTokenMiddleware } from './refreshToken.js';
import { checkLoggedIn, checkUserAgent } from './checkAuth.js';

const needAuth = express.Router();

needAuth.use(userSession);
needAuth.use(regenerateMiddleware);

needAuth.use(passport.initialize());
needAuth.use(passport.session());

needAuth.use(refreshTokenMiddleware);

needAuth.use(checkLoggedIn);
needAuth.use(checkUserAgent);

export default needAuth;
