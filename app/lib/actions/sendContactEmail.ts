'use server'

import { Resend } from 'resend'
import prisma from 'prisma/client'
import { contactEmailTemplate } from '../email-templates/contact-email'

const resend = new Resend(process.env.RESEND_API_KEY)

export default async function sendContactEmail({ name, email, subject, message }: { name: string; email: string; subject: string; message: string }) {
  try {
    await resend.emails.send({
      from: 'Little Paws DR <noreply@littlepawsdr.org>',
      to: 'sqysh@sqysh.io',
      //   to: 'lpdr@littlepawsdr.org',
      replyTo: email,
      subject: `[Contact] ${subject}`,
      html: contactEmailTemplate({ name, email, subject, message })
    })

    await prisma.log.create({
      data: {
        level: 'info',
        message: 'Contact email sent',
        metadata: JSON.stringify({ name, email, subject })
      }
    })

    return { success: true }
  } catch (error) {
    await prisma.log.create({
      data: {
        level: 'error',
        message: 'Failed to send contact email',
        metadata: JSON.stringify({
          error: error instanceof Error ? error.message : 'Unknown error',
          name,
          email,
          subject
        })
      }
    })

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}
