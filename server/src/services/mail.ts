import nodemailer from 'nodemailer';

import {
  EMAIL_APP_PASSWORD,
  EMAIL_SENDER,
  IS_PRODUCTION,
} from '../config/loadEnv.js';

async function sendEmail(receiver, subject, content) {
  if (!IS_PRODUCTION) return true;

  const html = `Hello ${receiver.username},

${content}

<p>Best regards,</p>
<p>The allbirds Team</p>`;

  try {
    const sender = EMAIL_SENDER;
    const options = { from: sender, to: receiver.email, subject, html };

    const transporter = nodemailer.createTransport({
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
  const content = `<p>Thank you for signing up with allbirds.</p>
<p>To verify your email please click <a href="${verificationLink}">here</a></p>

<p>If you did not create an account on allbirds, please ignore this email.</p>`;

  return await sendEmail(receiver, subject, content);
}

async function mailResetPassword(receiver, resetLink) {
  const subject = 'Reset Your Password';
  const content = `<p>We have received a request to reset the password for your account.</p>
  <p>If you did not initiate this request, please disregard this email.</p>

<p>To access the password reset page paease click <a href="${resetLink}">here</a></p>

<p>This link is valid for 1 Hour</p>`;

  return await sendEmail(receiver, subject, content);
}

export { mailVerifyAccount, mailResetPassword };
