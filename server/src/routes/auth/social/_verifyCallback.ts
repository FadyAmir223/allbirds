import { deviceIdSessionConfig } from '../../../config/auth.session.js';
import {
  addUserSecurity,
  createSocialUser,
} from '../../../models/user/user.model.js';
import { v4 as uuidv4 } from 'uuid';
import { CLIENT_URL } from '../../../utils/loadEnv.js';

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

async function socialCallback(req, res) {
  const userAgent = req.headers['user-agent'];

  let { deviceId } = req.cookies;
  if (!deviceId) {
    deviceId = uuidv4();
    res.cookie('deviceId', deviceId, deviceIdSessionConfig);
  }
  await addUserSecurity(req.user.id, userAgent, deviceId);

  // res.status(200).redirect(CLIENT_URL);
  res.status(200).json({ login: true });
}

export { verifyCallback, socialCallback };
