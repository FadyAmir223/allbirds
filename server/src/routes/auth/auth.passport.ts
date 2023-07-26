import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcrypt';

import { getUser } from '../../models/user/user.model.js';

passport.serializeUser((username, done) => {
  // await findOrCreateUser(user);
  done(null, username);
});

passport.deserializeUser(async (username, done) => {
  // const user = await getUser(id);
  // if (!user) return done(null, false);
  // know user authority
  done(null, username);
});

passport.use(
  new LocalStrategy(async (email, password, done) => {
    try {
      const user = await getUser(email);

      if (!user) return done(null, false);
      if (email !== user.email) return done(null, false);

      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) return done(null, false);

      return done(null, user.email);
    } catch (error) {
      if (error) return done(error);
    }
  })
);
