import nodemailer from 'nodemailer'

import {
  EMAIL_APP_PASSWORD,
  EMAIL_SENDER,
  IS_PRODUCTION,
} from '../config/env.js'

async function sendEmail(receiver, subject, content) {
  // if (!IS_PRODUCTION) return true;

  try {
    const sender = EMAIL_SENDER
    const options = { from: sender, to: receiver.email, subject, html: content }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: sender, pass: EMAIL_APP_PASSWORD },
      tls: { rejectUnauthorized: false },
    })

    const res = await transporter.sendMail(options)
    if (res?.error) return false
    return res?.accepted.length !== 0
  } catch (err) {
    return false
  }
}

async function mailVerifyAccount(receiver, verificationLink) {
  const subject = 'Verify Your Account'
  const content = `
Hello ${receiver.username},

<p>Thank you for signing up with allbirds.</p>

<a
href="${verificationLink}"
style="
  text-align: center;
  display: inline-block;
  width: 200px;
  color: white;
  background-color: black;
  padding: 0.75rem;
  font-size: 12px;
  font-weight: bold;
  text-transform: uppercase;
  text-decoration: none;
"
>
  verify your email
</a>

<p>If you did not create an account on allbirds, please ignore this email.</p>

<p>Best regards,</p>
<p>The allbirds Team</p>
`

  return await sendEmail(receiver, subject, content)
}

async function mailResetPassword(receiver, resetLink) {
  const subject = 'Reset Your Password'
  const content = `
<div style="text-align: center">
  <p>Hi ${receiver.username},</p>
  <p style="margin-top: 1rem; margin-bottom: 1rem">
    Forget your password? No sweat. It happens to the best of us.
  </p>
  <a
    href="${resetLink}"
    style="
      display: inline-block;
      width: 200px;
      color: white;
      background-color: black;
      padding: 0.75rem;
      font-size: 12px;
      font-weight: bold;
      text-transform: uppercase;
      text-decoration: none;
    "
  >
    reset password
  </a>
</div>
`

  return await sendEmail(receiver, subject, content)
}

export { mailVerifyAccount, mailResetPassword }
