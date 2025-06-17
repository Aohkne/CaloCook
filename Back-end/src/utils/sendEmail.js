import nodemailer from 'nodemailer'
import { env } from '@/config/environment'

const sendEmail = async (to, subject, text) => {
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: env.GMAIL_USER,
      pass: env.GMAIL_PASS
    }
  })

  await transporter.sendMail({
    from: env.GMAIL_USER,
    to,
    subject,
    html: text
  })
}

export default sendEmail
