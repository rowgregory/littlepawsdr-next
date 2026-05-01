import { User as NextAuthUser } from 'next-auth'
import { createStripeCustomer } from '../actions/createStripeCustomer'
import { Account } from 'next-auth'
import { User, Account as PrismaAccount } from '@prisma/client'
import prisma from 'prisma/client'
import { createLog } from '../actions/createLog'
import { pusherSuperuser } from 'app/utils/pusherTrigger'

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

// User with accounts relation
type UserWithAccounts = User & {
  accounts: PrismaAccount[]
}

export async function handleGoogleCallback(user: NextAuthUser, account: Account, profile?: GoogleProfile): Promise<boolean | string> {
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

    if (!existingUser.stripeCustomerId) {
      await createStripeCustomer(existingUser.id, existingUser.email, `${existingUser.firstName} ${existingUser.lastName}`.trim())
    }

    user.id = existingUser.id

    await pusherSuperuser('user-signed-in', { email: existingUser.email, name: existingUser.firstName, userId: existingUser.id })
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
    await createStripeCustomer(newUser.id, newUser.email, `${newUser.firstName} ${newUser.lastName}`.trim())

    user.id = newUser.id

    await logNewGoogleUser(user, account)

    await pusherSuperuser('user-registered', { email: newUser.email, name: newUser.firstName, userId: newUser.id, method: 'google' })
  }

  return true
}

async function linkGoogleAccount(existingUser: User | UserWithAccounts, account: Account): Promise<void> {
  // Handle case where accounts might not be loaded (new user)
  const hasGoogleAccount =
    'accounts' in existingUser
      ? existingUser.accounts?.some((acc) => acc.provider === 'google' && acc.providerAccountId === account.providerAccountId) || false
      : false

  if (!hasGoogleAccount) {
    await prisma.account.create({
      data: {
        userId: existingUser.id,
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
  if (profile?.name && (!user.firstName || !user.lastName)) {
    const [firstName, lastName] = profile.name.split(' ')

    await prisma.user.update({
      where: { id: user.id },
      data: {
        firstName,
        lastName
      }
    })
  }
}

async function logNewGoogleUser(user: NextAuthUser, account: Account): Promise<void> {
  await createLog('info', 'New Google user - will be handled in JWT callback', {
    location: ['googleProvider.ts'],
    provider: 'google',
    userEmail: user.email,
    accountId: account.providerAccountId
  })
}
