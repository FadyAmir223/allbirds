// https://console.cloud.google.com/apis/credentials

import express from 'express'
import passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'

import {
  CLIENT_DOMAIN,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
} from '../../../config/env.js'
import { verifyCallback, socialCallback } from './_verifyCallback.js'

const AUTH_OPTIONS = {
  clientID: GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_CLIENT_SECRET,
  callbackURL: CLIENT_DOMAIN + '/api/auth/google/callback',
}

const googleStrategy = new GoogleStrategy(AUTH_OPTIONS, verifyCallback)

passport.use(googleStrategy)

const googleRoute = express.Router()

googleRoute.get(
  '/',
  passport.authenticate('google', {
    scope: ['email', 'profile'],
    accessType: 'offline',
  }),
)

googleRoute.get(
  '/callback',
  passport.authenticate('google', {
    failureRedirect: CLIENT_DOMAIN + '/login',
    session: true,
  }),
  socialCallback,
)

export default googleRoute
