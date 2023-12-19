import { Request, Response } from 'express'

import { deviceIdSessionConfig } from '../../../config/auth.session.js'
import {
  addUserSecurity,
  createSocialUser,
} from '../../../models/user/user.model.js'
import { v4 as uuidv4 } from 'uuid'
import { CLIENT_DOMAIN } from '../../../config/env.js'

async function verifyCallback(accessToken, refreshToken, profile, done) {
  const { displayName, provider } = profile
  const email = profile.emails[0].value

  const user = await createSocialUser(
    displayName,
    email,
    provider,
    accessToken,
    refreshToken,
  )

  return done(null, user)
}

async function socialCallback(req: Request, res: Response) {
  const userAgent = req.headers['user-agent']
  console.log(req.headers)

  let { deviceId } = req.cookies
  if (!deviceId) {
    deviceId = uuidv4()
    res.cookie('deviceId', deviceId, deviceIdSessionConfig)
  }
  await addUserSecurity(req.user.id, userAgent, deviceId)

  if (req.headers['referer']?.includes(CLIENT_DOMAIN))
    return res.status(200).json({ login: true })

  res.status(302).redirect(CLIENT_DOMAIN + '/account?social')
}

export { verifyCallback, socialCallback }
