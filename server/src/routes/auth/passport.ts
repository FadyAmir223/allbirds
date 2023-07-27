import passport from 'passport';

import { getUserById } from '../../models/user/user.model.js';

passport.serializeUser(async (user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  const user = await getUserById(id);
  if (!user) return done(null, false);
  done(null, user);
});
