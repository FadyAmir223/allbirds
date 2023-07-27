import cookieSession from 'cookie-session';
import {
  IS_PRODUCTION,
  SESSION_KEY_1,
  SESSION_KEY_2,
  CLIENT_DOMAIN,
} from '../utils/loadEnv.js';

const sessionOptions = {
  name: 'user',
  keys: [SESSION_KEY_1, SESSION_KEY_2],
  maxAge: 30 * 24 * 60 * 60 * 1000,
  secure: IS_PRODUCTION,
};

// if (!IS_PRODUCTION) sessionOptions['domain'] = CLIENT_DOMAIN;

const userSession = cookieSession(sessionOptions);

function regenerateMiddleware(req, res, next) {
  req.session.regenerate = (cb) => cb();
  req.session.save = (cb) => cb();
  next();
}

export { userSession, regenerateMiddleware };
