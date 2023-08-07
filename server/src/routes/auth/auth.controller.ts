import {
  verifyUser,
  requestResetPassword,
  verifyResetToken,
  resetPassword,
} from '../../models/user/user.model.js';
import { isPasswordComplex } from '../../utils/authProtection.js';

function htppsLogout(req, res) {
  req.logout((err) => {
    if (err)
      return res
        .status(500)
        .json({ logout: false, message: 'error during logout' });

    res.status(200).json({ logout: true });
  });
}

async function httpsVerifyUser(req, res) {
  const { verifyToken } = req.params;
  if (verifyToken.length !== 36)
    return res.status(400).json({ message: 'invalid verification id' });
  const { status, message, verified } = await verifyUser(verifyToken);
  res.status(status).json({ verified, message });
}

async function httpsRequestResetPassword(req, res) {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'no email provided' });

  const { status, message } = await requestResetPassword(email);
  res.status(status).json({ message });
}

async function httpsVerifyResetToken(req, res) {
  const { token } = req.body;
  const { status, verified } = await verifyResetToken(token);
  res.status(status).json({ verified });
}

async function httpsResetPassword(req, res) {
  const { token, password, confirmPassword } = req.body;

  if (!(password && confirmPassword))
    return res.status(400).json({ message: 'some fields are empty' });

  if (password !== confirmPassword)
    return res.status(400).json({ message: 'non matched passwords' });

  if (!isPasswordComplex(password))
    return res.status(400).json({ message: 'password not complex enough' });

  const { status, message } = await resetPassword(token, password);
  res.status(status).json({ message });
}

export {
  htppsLogout,
  httpsVerifyUser,
  httpsRequestResetPassword,
  httpsVerifyResetToken,
  httpsResetPassword,
};
