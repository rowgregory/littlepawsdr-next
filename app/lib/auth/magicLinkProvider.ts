import type { EmailConfig } from 'next-auth/providers/email'
import { resend } from '../resend'
import { createLog } from '../actions/createLog'
import { magicLinkTemplate } from '../email-templates/magic-link'

export const magicLinkProvider: EmailConfig = {
  id: 'email',
  name: 'Email',
  type: 'email',
  maxAge: 15 * 60, // 15 mins
  from: process.env.RESEND_FROM_EMAIL!,
  sendVerificationRequest: async ({ identifier: email, url, provider }) => {
    try {
      const result = await resend.emails.send({
        from: `Little Paws Dachshund Rescue <${provider.from!}>`,
        to: email,
        subject: 'Sign in to Little Paws Dachshund Rescue',
        html: magicLinkTemplate(url)
      })
      await createLog('info', 'Magic link sent successfully', {
        location: ['magicLinkProvider.ts'],
        email,
        messageId: result.data?.id
      })
    } catch (error) {
      await createLog('error', 'Failed to send magic link email', {
        location: ['magicLinkProvider.ts'],
        email,
        error: error instanceof Error ? error.message : 'Unknown error'
      })
      throw error
    }
  }
}
