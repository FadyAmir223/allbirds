import { createSocialUser } from '../../../models/user/user.model.js';

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

export default verifyCallback;
