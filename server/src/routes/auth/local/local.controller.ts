import passport from 'passport';
import { Strategy } from 'passport-local';
import bcrypt from 'bcrypt';

import {
  addUserAgent,
  createLocalUser,
  getLocalUser,
} from '../../../models/user/user.model.js';
import { isPasswordComplex } from '../../../utils/authProtection.js';
import { loginFailRateLimit } from '../../../config/rateLimitConfig.js';

async function httpsSignup(req, res) {
  const { firstName, lastName, email, password, confirmPassword } = req.body;

  if (!(firstName && lastName && email && password && confirmPassword))
    return res.status(400).json({ message: 'some fields are empty' });

  if (password !== confirmPassword)
    return res.status(400).json({ message: 'non matched passwords' });

  if (!isPasswordComplex(password))
    return res.status(400).json({ message: 'password not complex enough' });

  const user = await getLocalUser(email);
  if (user) return res.status(409).json({ message: 'email already used' });

  const username = `${firstName} ${lastName}`;
  const hashPassword = await bcrypt.hash(password, 10);

  const { status, id, message } = await createLocalUser(
    username,
    email,
    hashPassword
  );

  req.login({ id }, (err) => {
    if (err) return res.status(500).json({ message: 'error during login' });
    res.status(status).json({ message });
  });
}

async function httpsLogin(req, res) {
  const userAgent = req.headers['user-agent'];
  await addUserAgent(req.user.id, userAgent);
  res.status(200).json({ login: true });
}

passport.use(
  new Strategy(async (email_ip, password, done) => {
    try {
      const email = email_ip.split('---')[0];
      const user = await getLocalUser(email);

      if (!user) return done(null, false);
      if (email !== user?.email) return done(null, false);

      const passwordMatch = await bcrypt.compare(password, user?.password);
      if (!passwordMatch)
        try {
          await loginFailRateLimit.consume(email_ip);
        } finally {
          return done(null, false);
        }

      try {
        await loginFailRateLimit.delete(email_ip);
      } finally {
        return done(null, user);
      }
    } catch (err) {
      return done(err);
    }
  })
);

export { httpsSignup, httpsLogin };
