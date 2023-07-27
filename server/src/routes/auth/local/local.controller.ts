import bcrypt from 'bcrypt';

import { createLocalUser, getEmail } from '../../../models/user/user.model.js';

async function httpsSignup(req, res) {
  const { firstName, lastName, email, password, confirmPassword } = req.body;

  if (!(firstName && lastName && email && password && confirmPassword))
    return res.status(400).json({ message: 'empty field' });

  if (password !== confirmPassword)
    return res.status(400).json({ message: 'unmatched passwords' });

  const emailExist = await getEmail(email);
  if (emailExist) return res.status(409).json({ message: 'email aleady used' });

  const username = `${firstName} ${lastName}`;
  const hashPassword = await bcrypt.hash(password, 10);

  const { status, id, message } = await createLocalUser(
    username,
    email,
    hashPassword
  );

  req.login(id, (err) => {
    if (err) return res.status(500).json({ message: 'error during login' });
    return res.status(status).json({ message });
  });
}

async function httpsLogin(req, res) {
  return res.status(200).json({ login: true });
}

export { httpsSignup, httpsLogin };
