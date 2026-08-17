import nodemailer from 'nodemailer'

export async function sendEmail({
   to,
   subject,
   html,
   text,
}: {
   to: string
   subject: string
   html?: string
   text?: string
}) {
   const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
         user: process.env.MAIL_SMTP_USER,
         pass: process.env.MAIL_SMTP_PASS,
      },
   })

   const info = await transporter.sendMail({
      from: process.env.MAIL_SMTP_USER,
      to,
      subject,
      text,
      html,
   })

   return info
}