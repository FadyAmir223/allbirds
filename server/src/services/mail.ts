import nodemailer from 'nodemailer';

import {
  EMAIL_APP_PASSWORD,
  EMAIL_SENDER,
  IS_PRODUCTION,
} from '../utils/loadEnv.js';

async function sendEmail(receiver, subject, content) {
  if (!IS_PRODUCTION) return true;

  const text = `Hello ${receiver.username},

${content}

Best regards,
The allbirds Team`;

  try {
    const sender = EMAIL_SENDER;
    const options = { from: sender, to: receiver.email, subject, text };

    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: sender, pass: EMAIL_APP_PASSWORD },
      tls: { rejectUnauthorized: false },
    });

    const res = await transporter.sendMail(options);
    if (res?.error) return false;
    return res?.accepted.length !== 0;
  } catch (err) {
    return false;
  }
}

async function mailVerifyAccount(receiver, verificationLink) {
  const subject = 'Verify Your Account';
  const content = `Thank you for signing up with allbirds.
To complete your account registration, please click the link below to verify your email address:

Verification Link: ${verificationLink}

If you did not create an account on allbirds, please ignore this email.`;

  return await sendEmail(receiver, subject, content);
}

async function mailResetPassword(receiver, resetLink) {
  const subject = 'Reset Your Password';
  const content = `We hope this email finds you well. We have received a request to reset the password for your account. If you did not initiate this request, please disregard this email.

To proceed with the password reset, please follow the instructions below:

Click on the following link to access the password reset page: ${resetLink}

On the password reset page, you will be prompted to enter a new password for your account. Please choose a strong and unique password to ensure the security of your account.

After setting the new password, click on the "Reset Password" button to confirm the change.

Note: This password reset link is valid for "1 Hour" from the time of this email. If you do not reset your password within this period, you may need to request another password reset.`;

  return await sendEmail(receiver, subject, content);
}

export { mailVerifyAccount, mailResetPassword };
