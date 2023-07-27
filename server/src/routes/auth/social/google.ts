import express from 'express';
import passport from 'passport';
import { Strategy } from 'passport-google-oauth20';
// import refresh from 'passport-oauth2-refresh';

import {
  CLIENT_URL,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  SERVER_URL,
} from '../../../utils/loadEnv.js';
import { createSocialUser } from '../../../models/user/user.model.js';

const AUTH_OPTIONS = {
  clientID: GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_CLIENT_SECRET,
  callbackURL: SERVER_URL + '/api/auth/google/callback',
};

async function verifyCallback(accessToken, refreshToken, profile, done) {
  const { displayName, provider } = profile;
  const email = profile.emails[0].value;

  const user = await createSocialUser(
    displayName,
    email,
    provider,
    accessToken,
    refreshToken
  );

  return done(null, user);
}

const googleStrategy = new Strategy(AUTH_OPTIONS, verifyCallback);

passport.use(googleStrategy);

// refresh.use(googleStrategy);

const googleRoute = express.Router();

googleRoute.get(
  '/',
  passport.authenticate('google', {
    scope: ['email', 'profile'],
    accessType: 'offline',
  })
);

googleRoute.get(
  '/callback',
  passport.authenticate('google', {
    successRedirect: CLIENT_URL,
    failureRedirect: CLIENT_URL + '/login',
    session: true,
  })
);

export default googleRoute;
