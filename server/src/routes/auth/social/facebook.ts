// https://developers.facebook.com/apps

import express from 'express'
import passport from 'passport'
import { Strategy as FacebookStrategy } from 'passport-facebook'

import {
  CLIENT_DOMAIN,
  FACEBOOK_APP_ID,
  FACEBOOK_APP_SECRET,
} from '../../../config/env.js'
import { verifyCallback, socialCallback } from './_verifyCallback.js'

const AUTH_OPTIONS = {
  clientID: FACEBOOK_APP_ID,
  clientSecret: FACEBOOK_APP_SECRET,
  callbackURL: CLIENT_DOMAIN + '/api/auth/facebook/callback',
  profileFields: ['displayName', 'email'], // 'id', 'photos'
  scope: ['email'], // 'user_photos'
}

passport.use(new FacebookStrategy(AUTH_OPTIONS, verifyCallback))

const facebookRoute = express.Router()

facebookRoute.get('/', passport.authenticate('facebook'))

facebookRoute.get(
  '/callback',
  passport.authenticate('facebook', {
    failureRedirect: CLIENT_DOMAIN + '/login',
    session: true,
  }),
  socialCallback,
)

/*
  useEffect(() => {
    if (location.hash === '#_=_')
      history.pushState('', document.title, location.pathname);
  }, []);
*/

export default facebookRoute
