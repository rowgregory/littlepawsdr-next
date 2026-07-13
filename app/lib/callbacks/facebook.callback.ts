import type { User, Account, Profile } from 'next-auth'
import { createLog } from '../actions/log/createLog'
import prisma from 'prisma/client'

export async function handleFacebookCallback(user: User, account: Account, profile: Profile): Promise<boolean> {
  if (!user.email) {
    await createLog('warn', 'Facebook sign-in missing email', { profile })
    return false
  }

  try {
    const existing = await prisma.user.findUnique({
      where: { email: user.email },
      include: { accounts: true }
    })

    if (existing) {
      const hasFacebookAccount = existing.accounts.some((a) => a.provider === 'facebook')

      if (!hasFacebookAccount) {
        await prisma.account.create({
          data: {
            userId: existing.id,
            type: account.type,
            provider: account.provider,
            providerAccountId: account.providerAccountId,
            access_token: account.access_token,
            token_type: account.token_type,
            scope: account.scope
          }
        })
      }
    }

    return true
  } catch (error) {
    await createLog('error', 'Facebook callback failed', {
      email: user.email,
      error: error instanceof Error ? error.message : 'Unknown error'
    })
    return false
  }
}
