import { Request, Response } from 'express';
import passport from 'passport';
import { Strategy } from 'passport-local';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

import {
  createLocalUser,
  getLocalUser,
} from '../../../models/user/user.model.js';
import { isPasswordComplex } from '../../../utils/authProtection.js';
import {
  loginRateLimit_IP,
  loginRateLimit_IP_Email,
  loginRateLimit_Email,
} from '../../../config/rateLimitConfig.js';
import { deviceIdSessionConfig } from '../../../config/auth.session.js';

async function httpsSignup(req: Request, res: Response): Promise<Response> {
  const { firstName, lastName, password, confirmPassword } = req.body;
  const email = req.body.email?.toLowerCase();

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

  const userAgent = req.headers['user-agent'];

  let { deviceId } = req.cookies;
  if (!deviceId) {
    deviceId = uuidv4();
    res.cookie('deviceId', deviceId, deviceIdSessionConfig);
  }

  const { status, id, message } = await createLocalUser(
    username,
    email,
    hashPassword,
    userAgent,
    deviceId
  );

  req.login({ id }, (err) => {
    if (err) return res.status(500).json({ message: 'error during login' });
    res.status(status).json({ message });
    // res.status(302).redirect(CLIENT_DOMAIN);
  });
}

passport.use(
  new Strategy(async (email_ip_isDeviceTrusted, password, done) => {
    try {
      const [email, ip, isDeviceTrusted] =
        email_ip_isDeviceTrusted.split('---');
      const email_ip = email + '---' + ip;

      const user = await getLocalUser(email);

      if (!user) return done(null, false);
      if (email !== user?.email) return done(null, false);

      const passwordMatch = await bcrypt.compare(password, user?.password);
      if (!passwordMatch)
        try {
          const promises = [loginRateLimit_IP_Email.consume(email_ip)];

          if (isDeviceTrusted === 'false')
            promises.push(
              loginRateLimit_IP.consume(ip),
              loginRateLimit_Email.consume(email)
            );

          await Promise.all(promises);
        } finally {
          return done(null, false);
        }

      try {
        await loginRateLimit_IP_Email.delete(email_ip);
      } finally {
        return done(null, user);
      }
    } catch (err) {
      return done(err);
    }
  })
);

export { httpsSignup };
