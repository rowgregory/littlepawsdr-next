'use server'

import prisma from 'prisma/client'
import { contactEmailTemplate } from './templates/contact-email.template'
import { resend } from 'app/lib/email/resend'

export default async function sendContactEmail({
  name,
  email,
  subject,
  message
}: {
  name: string
  email: string
  subject: string
  message: string
}) {
  try {
    await resend.emails.send({
      from: 'Little Paws DR <noreply@littlepawsdr.org>',
      to: 'greg@sqysh.com',
      // ToDo
      // Swith back to the corret email
      // to: 'lpdr@littlepawsdr.org',
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
