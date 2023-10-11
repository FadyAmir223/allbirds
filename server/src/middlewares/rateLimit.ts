import {
  createAccountRateLimit,
  loginRateLimit_IP,
  loginRateLimit_IP_Email,
  loginRateLimit_Email,
  resetPasswordRateLimit,
} from '../config/rateLimitConfig.js';
import { getUserTrustedDevices } from '../models/user/user.model.js';
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

async function loginRateLimitMiddleware(req, res, next) {
  try {
    const { username, password } = req.body;

    if (!(username && password))
      return { status: 400, message: 'username or password are missing' };

    const email = req.body.username.toLowerCase();
    const { ip } = req;
    const email_ip = email + '---' + ip;

    // console.log('######', email, '######');

    const trustedDevices = await getUserTrustedDevices(email);
    const deviceId = req.cookies.deviceId;

    const isDeviceTrusted = trustedDevices.includes(deviceId);
    req.body.username = email_ip + '---' + isDeviceTrusted;

    const promises = [loginRateLimit_IP_Email.get(email_ip)];

    if (!isDeviceTrusted)
      promises.push(loginRateLimit_IP.get(ip), loginRateLimit_Email.get(email));

    const [resIpUsername, resIp, resUsername] = await Promise.all(promises);

    let retrySecs = 0;

    if (resIpUsername?.consumedPoints > loginRateLimit_IP_Email.points)
      retrySecs = Math.round(resIpUsername.msBeforeNext / 1000) || 1;
    else if (resIp?.consumedPoints > loginRateLimit_IP.points)
      retrySecs = Math.round(resIp.msBeforeNext / 1000) || 1;
    else if (resUsername?.consumedPoints > loginRateLimit_Email.points)
      retrySecs = Math.round(resUsername.msBeforeNext / 1000) || 1;

    if (retrySecs === 0) return next();

    const { hours, minutes } = secondsToHoursMinutes(retrySecs);

    return res
      .status(429)
      .set('Retry-After', String(retrySecs))
      .json({
        message: `too many login attempts, try after: ${hours}h, ${minutes}m`,
      });
  } catch (rateLimiterRes) {
    if (rateLimiterRes?.remainingPoints === 0)
      return res.status(429).json({
        message: 'too many login attempts, try again later',
      });

    next();
  }
}

export {
  createAccountRateLimitMiddleware,
  resetPasswordRateLimitMiddleware,
  loginRateLimitMiddleware,
};
