import { Request, Response } from 'express';

import {
  verifyUser,
  requestResetPassword,
  verifyResetToken,
  resetPassword,
} from '../../models/user/user.model.js';
import { isPasswordComplex } from '../../utils/authProtection.js';

async function htppsLogout(req: Request, res: Response) {
  req.logout(function (err) {
    if (err)
      return res
        .status(500)
        .json({ logout: false, message: 'error during logout' });

    return res.status(200).json({ logout: true });
    // return res.status(302).redirect(CLIENT_URL);
  });
}

async function httpsVerifyUser(req: Request, res: Response): Promise<Response> {
  const { verifyToken } = req.params;

  if (verifyToken.length !== 36)
    return res.status(400).json({ message: 'invalid verification id' });

  const { status, message, verified } = await verifyUser(verifyToken);
  res.status(status).json({ verified, message });
}

async function httpsRequestResetPassword(
  req: Request,
  res: Response
): Promise<Response> {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'no email provided' });

  const { status, message } = await requestResetPassword(email);
  res.status(status).json({ message });
}

async function httpsVerifyResetToken(
  req: Request,
  res: Response
): Promise<Response> {
  const { uid, token } = req.body;
  if (!(uid && token))
    return res.status(400).json({ message: 'some fields not provided' });

  const { status, verified } = await verifyResetToken(uid, token);
  res.status(status).json({ verified });
}

async function httpsResetPassword(
  req: Request,
  res: Response
): Promise<Response> {
  const { uid, token, password, confirmPassword } = req.body;

  if (!(uid && token && password && confirmPassword))
    return res.status(400).json({ message: 'some fields are empty' });

  if (password !== confirmPassword)
    return res.status(400).json({ message: 'non matched passwords' });

  if (!isPasswordComplex(password))
    return res.status(400).json({ message: 'password not complex enough' });

  if (token.length !== 36)
    return res.status(400).json({ message: 'invalid token' });

  const { status, message } = await resetPassword(uid, token, password);
  res.status(status).json({ message });
}

export {
  htppsLogout,
  httpsVerifyUser,
  httpsRequestResetPassword,
  httpsVerifyResetToken,
  httpsResetPassword,
};
