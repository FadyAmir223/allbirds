import cookieSession from 'cookie-session';
import {
  IS_PRODUCTION,
  SESSION_KEY_1,
  SESSION_KEY_2,
  // CLIENT_DOMAIN,
} from '../utils/loadEnv.js';

const userSessionConfig = {
  name: 'user',
  keys: [SESSION_KEY_1, SESSION_KEY_2],
  maxAge: 30 * 24 * 60 * 60 * 1000,
  secure: IS_PRODUCTION,
};

// if (!IS_PRODUCTION) userSessionConfig['domain'] = CLIENT_DOMAIN;

const userSession = cookieSession(userSessionConfig);

function regenerateMiddleware(req, res, next) {
  req.session.regenerate = (cb) => cb();
  req.session.save = (cb) => cb();
  next();
}

const deviceIdSessionConfig = {
  name: 'deviceId',
  maxAge: 365 * 24 * 60 * 60 * 1000,
  secure: IS_PRODUCTION,
};

// if (!IS_PRODUCTION) deviceIdSessionConfig['domain'] = CLIENT_DOMAIN;

export { userSession, regenerateMiddleware, deviceIdSessionConfig };
