import mongoose from 'mongoose';
import { RateLimiterMongo } from 'rate-limiter-flexible';

const storeClient = mongoose.connection;

const createAccountRateLimit = new RateLimiterMongo({
  storeClient,
  points: 5,
  duration: 60 * 60 * 24,
  keyPrefix: 'create_account',
  tableName: 'rate-limit',
});

const loginFailRateLimit = new RateLimiterMongo({
  storeClient,
  points: 10,
  duration: 60 * 60 * 3,
  blockDuration: 60 * 15,
  keyPrefix: 'login_fail_attempt',
  tableName: 'rate-limit',
});

const resetPasswordRateLimit = new RateLimiterMongo({
  storeClient,
  points: 5,
  duration: 60 * 60 * 24,
  keyPrefix: 'reset_password',
  tableName: 'rate-limit',
});

export { createAccountRateLimit, loginFailRateLimit, resetPasswordRateLimit };
