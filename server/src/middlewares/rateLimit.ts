import {
  createAccountRateLimit,
  loginFailRateLimit,
  resetPasswordRateLimit,
} from '../config/rateLimitConfig.js';
import { secondsToHoursMinutes } from '../utils/date.js';

async function createAccountRateLimitMiddleware(req, res, next) {
  try {
    await createAccountRateLimit.consume(req.ip, 1);
    next();
  } catch (rateLimiterRes) {
    if (rateLimiterRes?.remainingPoints === 0)
      return res.status(429).json({
        message: 'too many accounts created, please try again later',
      });
    next();
  }
}

async function resetPasswordRateLimitMiddleware(req, res, next) {
  try {
    await resetPasswordRateLimit.consume(req.ip, 1);
    next();
  } catch (rateLimiterRes) {
    if (rateLimiterRes?.remainingPoints === 0)
      return res.status(429).json({
        message: 'too many password resets, please try again later',
      });
    next();
  }
}

async function failedLoginRateLimitMiddleware(req, res, next) {
  try {
    req.body.username += '---' + req.ip;
    const email = req.body.username;

    const rl = await loginFailRateLimit.get(email);

    if (rl && rl.consumedPoints > loginFailRateLimit.points) {
      const retrySecs = Math.round(rl.msBeforeNext / 1000) || 1;
      const { hours, minutes } = secondsToHoursMinutes(retrySecs);

      return res
        .set('Retry-After', String(retrySecs))
        .status(429)
        .json({
          message: `too many password resets, try after: ${hours} hours and ${minutes} minutes`,
        });
    }

    next();
  } catch (rateLimiterRes) {
    if (rateLimiterRes?.remainingPoints === 0)
      return res.status(429).json({
        message: 'too many password resets, please try again later',
      });

    next();
  }
}

export {
  createAccountRateLimitMiddleware,
  resetPasswordRateLimitMiddleware,
  failedLoginRateLimitMiddleware,
};
