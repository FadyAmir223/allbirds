import mongoose from 'mongoose';
import { RateLimiterMongo } from 'rate-limiter-flexible';
import { IS_PRODUCTION } from '../utils/loadEnv.js';

const storeClient = mongoose.connection;

const createAccountRateLimit = new RateLimiterMongo({
  storeClient,
  points: IS_PRODUCTION ? 5 : Number.MAX_VALUE,
  duration: 60 * 60 * 24,
  keyPrefix: 'create_account',
  tableName: 'rate-limit',
});

const resetPasswordRateLimit = new RateLimiterMongo({
  storeClient,
  points: IS_PRODUCTION ? 5 : Number.MAX_VALUE,
  duration: 60 * 60 * 24,
  keyPrefix: 'reset_password',
  tableName: 'rate-limit',
});

const loginRateLimit_IP_Email = new RateLimiterMongo({
  storeClient,
  points: IS_PRODUCTION ? 10 : Number.MAX_VALUE,
  duration: 60 * 60 * 24 * 90,
  blockDuration: 60 * 60 * 24 * 7,
  keyPrefix: 'login_ip_email',
  tableName: 'rate-limit',
});

const loginRateLimit_IP = new RateLimiterMongo({
  storeClient,
  points: IS_PRODUCTION ? 100 : Number.MAX_VALUE,
  duration: 60 * 60 * 24,
  blockDuration: 60 * 60 * 24,
  keyPrefix: 'login_ip',
  tableName: 'rate-limit',
});

const loginRateLimit_Email = new RateLimiterMongo({
  storeClient,
  points: IS_PRODUCTION ? 50 : Number.MAX_VALUE,
  duration: 60 * 60 * 24,
  blockDuration: 60 * 60 * 24 * 7,
  keyPrefix: 'login_email',
  tableName: 'rate-limit',
});

export {
  createAccountRateLimit,
  resetPasswordRateLimit,
  loginRateLimit_IP_Email,
  loginRateLimit_IP,
  loginRateLimit_Email,
};
