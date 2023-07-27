import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcrypt';

import { getUser, getUserById } from '../../models/user/user.model.js';

passport.serializeUser(async (user, done) => {
  done(null, user);
});

passport.deserializeUser(async (id, done) => {
  const user = await getUserById(id);
  if (!user) return done(null, false);
  done(null, user);
});

passport.use(
  new LocalStrategy(async (email, password, done) => {
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
