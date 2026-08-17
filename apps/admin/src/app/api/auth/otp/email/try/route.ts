import config from '@/config/site'
import Mail from '@/emails/verify'
import prisma from '@/lib/prisma'
import { generateSerial } from '@/lib/serial'
import { getErrorResponse } from '@/lib/utils'
import { isEmailValid } from '@persepolis/regex'
import { render } from '@react-email/render'
import { NextRequest, NextResponse } from 'next/server'
import { ZodError } from 'zod'
import { sendEmail } from '@/lib/mail'

export async function POST(req: NextRequest) {
   try {
      const { email } = await req.json()

      if (!isEmailValid(email)) {
         return getErrorResponse(400, 'Incorrect Email')
      }

      const OTP = generateSerial({})

      await prisma.owner.update({
         where: { email },
         data: { OTP },
      })

      const emailHtml = await render(Mail({ code: OTP, name: config.name }))

      await sendEmail({
         to: email,
         subject: 'Verify your email.',
         html: emailHtml,
      })

      return new NextResponse(
         JSON.stringify({
            status: 'success',
            email,
         }),
         {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
         }
      )
   } catch (error: any) {
      if (error instanceof ZodError) {
         return getErrorResponse(400, 'failed validations', error)
      }

      return getErrorResponse(500, error.message)
   }
}