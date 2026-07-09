import { User as NextAuthUser } from 'next-auth'
import { Account } from 'next-auth'
import { User } from '@prisma/client'
import prisma from 'prisma/client'
import { createLog } from '../actions/log/createLog'
import { pusherSuperuser } from 'app/utils/pusher.utils'

// Google OAuth Profile type - match NextAuth's Profile structure
interface GoogleProfile {
  sub?: string | null
  name?: string | null
  given_name?: string | null
  family_name?: string | null
  email?: string | null
  email_verified?: boolean | null
  picture?: string | null
  locale?: string | null
}

export async function handleGoogleCallback(
  user: NextAuthUser,
  account: Account,
  profile?: GoogleProfile
): Promise<boolean | string> {
  const existingUser = await prisma.user.findUnique({
    where: { email: user.email! },
    include: { accounts: true }
  })

  if (existingUser) {
    if (existingUser.status === 'SUSPENDED') return '/auth/suspended'
    if (existingUser.status === 'TERMINATED') return '/auth/terminated'

    await Promise.all([
      linkGoogleAccount(existingUser, account),
      updateUserFromProfile(existingUser, profile),
      prisma.user.update({
        where: { id: existingUser.id },
        data: { lastLoginAt: new Date() }
      })
    ])

    user.id = existingUser.id

    await pusherSuperuser('user-signed-in', {
      email: existingUser.email,
      name: existingUser.firstName,
      userId: existingUser.id
    })
  } else {
    const newUser = await prisma.user.create({
      data: {
        email: user.email!,
        firstName: profile?.given_name || '',
        lastName: profile?.family_name || '',
        role: 'SUPPORTER',
        status: 'ACTIVE',
        lastLoginAt: new Date()
      }
    })

    await linkGoogleAccount(newUser, account)

    user.id = newUser.id

    await logNewGoogleUser(user, account)

    await pusherSuperuser('user-registered', {
      email: newUser.email,
      name: newUser.firstName,
      userId: newUser.id,
      method: 'google'
    })
  }

  return true
}

async function linkGoogleAccount(user: User, account: Account): Promise<void> {
  const hasGoogleAccount = await prisma.account.findFirst({
    where: { userId: user.id, provider: 'google', providerAccountId: account.providerAccountId }
  })

  if (!hasGoogleAccount) {
    await prisma.account.create({
      data: {
        userId: user.id,
        type: account.type,
        provider: account.provider,
        providerAccountId: account.providerAccountId,
        access_token: account.access_token,
        expires_at: account.expires_at,
        id_token: account.id_token,
        refresh_token: account.refresh_token,
        scope: account.scope,
        token_type: account.token_type
      }
    })
  }
}

async function updateUserFromProfile(user: User, profile?: GoogleProfile): Promise<void> {
  if (!user.firstName || !user.lastName) {
    await prisma.user.update({
      where: { id: user.id },
      data: {
        firstName: profile?.given_name || user.firstName,
        lastName: profile?.family_name || user.lastName
      }
    })
  }
}

async function logNewGoogleUser(user: NextAuthUser, account: Account): Promise<void> {
  await createLog('info', 'New Google user', {
    location: ['googleProvider.ts'],
    provider: 'google',
    userEmail: user.email,
    accountId: account.providerAccountId
  })
}
