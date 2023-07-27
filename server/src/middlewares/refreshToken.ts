import axios from 'axios';
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from '../utils/loadEnv.js';
import { updateAccessToken } from '../models/user/user.model.js';

async function refreshTokenMiddleware(req, res, next) {
  const expireUrl =
    'https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=';
  const { accessToken } = req.user.social;

  const {
    data: { error },
  } = await axios.get(expireUrl + accessToken);

  if (!error) return next();

  const refreshUrl = 'https://oauth2.googleapis.com/token';
  const { _id, refreshToken } = req.user.social;

  const {
    data: { access_token },
  } = await axios.post(refreshUrl, {
    grant_type: 'refresh_token',
    client_id: GOOGLE_CLIENT_ID,
    client_secret: GOOGLE_CLIENT_SECRET,
    refresh_token: refreshToken,
  });

  const user = await updateAccessToken(_id, access_token);
  if (!user) return res.json({ message: 'unable to save user' });

  next();
}

export { refreshTokenMiddleware };
