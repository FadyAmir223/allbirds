import passport from 'passport';
import { Strategy } from 'passport-local';
import bcrypt from 'bcrypt';

import {
  createLocalUser,
  getEmail,
  getUser,
} from '../../../models/user/user.model.js';

async function httpsSignup(req, res) {
  const { firstName, lastName, email, password, confirmPassword } = req.body;

  if (!(firstName && lastName && email && password && confirmPassword))
    return res.status(400).json({ message: 'empty field' });

  if (password !== confirmPassword)
    return res.status(400).json({ message: 'unmatched passwords' });

  const emailExist = await getEmail(email);
  if (emailExist) return res.status(409).json({ message: 'email aleady used' });

  const username = `${firstName} ${lastName}`;
  const hashPassword = await bcrypt.hash(password, 10);

  const { status, id, message } = await createLocalUser(
    username,
    email,
    hashPassword
  );

  req.login(id, (err) => {
    if (err) return res.status(500).json({ message: 'error during login' });
    return res.status(status).json({ message });
  });
}

async function httpsLogin(req, res) {
  return res.status(200).json({ login: true });
}

passport.use(
  new Strategy(async (email, password, done) => {
    try {
      const user = await getUser(email);

      if (!user) return done(null, false);
      if (email !== user?.email) return done(null, false);

      const passwordMatch = await bcrypt.compare(password, user?.password);
      if (!passwordMatch) return done(null, false);

      return done(null, user);
    } catch (error) {
      if (error) return done(error);
    }
  })
);

export { httpsSignup, httpsLogin };