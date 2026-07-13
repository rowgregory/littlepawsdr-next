'use server'

import prisma from 'prisma/client'
import { createLog } from '../log/createLog'
import { resend } from 'app/lib/email/resend'
import { emailChangeNotificationTemplate } from 'app/lib/email/templates/email-change-notification.template'

export async function verifyEmailChange(token: string): Promise<{
  success: boolean
  error?: string
}> {
  try {
    const record = await prisma.emailChangeToken.findUnique({ where: { token } })

    if (!record) return { success: false, error: 'Invalid or expired verification link.' }
    if (record.expiresAt < new Date()) {
      await prisma.emailChangeToken.delete({ where: { token } })
      return { success: false, error: 'This verification link has expired. Please request a new one.' }
    }

    const user = await prisma.user.findUnique({ where: { id: record.userId } })
    if (!user) return { success: false, error: 'User not found.' }

    // Check new email still not taken
    const existing = await prisma.user.findUnique({ where: { email: record.newEmail } })
    if (existing) {
      await prisma.emailChangeToken.delete({ where: { token } })
      return { success: false, error: 'That email address is already in use.' }
    }

    const oldEmail = user.email

    // Update email and delete token in one transaction
    await prisma.$transaction([
      prisma.user.update({
        where: { id: record.userId },
        data: { email: record.newEmail }
      }),
      prisma.emailChangeToken.delete({ where: { token } })
    ])

    // Notify old email
    await resend.emails.send({
      from: 'Little Paws Dachshund Rescue <info@littlepawsdr.org>',
      to: oldEmail,
      subject: 'Your email address has been changed',
      html: emailChangeNotificationTemplate({
        firstName: user.firstName ?? oldEmail.split('@')[0],
        oldEmail,
        newEmail: record.newEmail
      })
    })

    await createLog('info', 'Email changed successfully', {
      userId: record.userId,
      oldEmail,
      newEmail: record.newEmail
    })

    return { success: true }
  } catch (err) {
    await createLog('error', 'Failed to verify email change', {
      error: err instanceof Error ? err.message : 'Unknown error'
    })
    return { success: false, error: 'Something went wrong. Please try again.' }
  }
}
