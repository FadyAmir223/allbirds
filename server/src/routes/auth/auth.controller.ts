import bcrypt from 'bcrypt';

import { createUser, getEmail } from '../../models/user/user.model.js';

async function httpsSignup(req, res) {
  const { firstName, lastName, email, password, confirmPassword } = req.body;

  if (!(firstName && lastName && email && password && confirmPassword))
    return res.status(400).json({ message: 'empty field' });

  if (password !== confirmPassword)
    return res.status(400).json({ message: 'unmatched passwords' });

  const emailExist = await getEmail(email);
  if (emailExist) return res.status(409).json({ message: 'email aleady used' });

  const hashPassword = await bcrypt.hash(password, 10);

  const { status, message } = await createUser(
    firstName,
    lastName,
    email,
    hashPassword
  );

  req.login(email, (err) => {
    if (err) return res.status(500).json({ message: 'error during login' });
    return res.status(status).json({ message });
  });
}

async function httpsLogin(req, res) {
  return res.status(200).json({ login: true });
}

async function htppsLogout(req, res) {
  req.logout((err) => {
    if (err)
      return res
        .status(500)
        .json({ logout: false, message: 'error during logout' });

    return res.status(200).json({ logout: true });
  });
}

async function htppsSecret(req, res) {
  return res.status(200).json({ seret: 42 });
}

export { httpsSignup, httpsLogin, htppsLogout, htppsSecret };
