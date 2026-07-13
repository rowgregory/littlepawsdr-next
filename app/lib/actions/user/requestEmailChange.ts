'use server'

import { randomBytes } from 'crypto'
import prisma from 'prisma/client'
import { auth } from 'app/lib/auth'
import { resend } from 'app/lib/email/resend'
import { createLog } from '../log/createLog'
import { emailChangeVerificationTemplate } from 'app/lib/email/templates/email-change-verification.tempate'

const TOKEN_EXPIRY_HOURS = 24

export async function requestEmailChange(newEmail: string): Promise<{
  success: boolean
  error?: string
}> {
  try {
    const session = await auth()
    if (!session?.user?.id) return { success: false, error: 'Unauthorized' }

    const userId = session.user.id
    const normalizedEmail = newEmail.toLowerCase().trim()

    // Check email is actually different
    const currentUser = await prisma.user.findUnique({ where: { id: userId } })
    if (!currentUser) return { success: false, error: 'User not found' }
    if (currentUser.email === normalizedEmail) {
      return { success: false, error: 'That is already your current email address.' }
    }

    // Check new email is not already taken
    const existing = await prisma.user.findUnique({ where: { email: normalizedEmail } })
    if (existing) {
      return { success: false, error: 'That email address is already in use.' }
    }

    // Delete any existing pending token for this user
    await prisma.emailChangeToken.deleteMany({ where: { userId } })

    // Create new token
    const token = randomBytes(32).toString('hex')
    const expiresAt = new Date(Date.now() + TOKEN_EXPIRY_HOURS * 60 * 60 * 1000)

    await prisma.emailChangeToken.create({
      data: { userId, newEmail: normalizedEmail, token, expiresAt }
    })

    const verifyUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/verify-email-change?token=${token}`

    await resend.emails.send({
      from: 'Little Paws Dachshund Rescue <info@littlepawsdr.org>',
      to: normalizedEmail,
      subject: 'Verify your new email address',
      html: emailChangeVerificationTemplate({
        firstName: currentUser.firstName ?? currentUser.email.split('@')[0],
        currentEmail: currentUser.email,
        newEmail: normalizedEmail,
        verifyUrl
      })
    })

    await createLog('info', 'Email change requested', {
      userId,
      currentEmail: currentUser.email,
      newEmail: normalizedEmail
    })

    return { success: true }
  } catch (err) {
    await createLog('error', 'Failed to request email change', {
      error: err instanceof Error ? err.message : 'Unknown error'
    })
    return { success: false, error: 'Failed to send verification email. Please try again.' }
  }
}
