import { User as NextAuthUser } from 'next-auth'
import { Account } from 'next-auth'
import { User } from '@prisma/client'
import prisma from 'prisma/client'
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
  __: Account,
  profile?: GoogleProfile
): Promise<boolean | string> {
  const existingUser = await prisma.user.findUnique({
    where: { email: user.email! }
  })

  // New user: let the adapter create the user + link the account.
  // Don't create anything here — just allow sign-in.
  if (!existingUser) {
    return true
  }

  // Existing user: enforce status + record login + notify.
  if (existingUser.status === 'SUSPENDED') return '/auth/suspended'
  if (existingUser.status === 'TERMINATED') return '/auth/terminated'

  await Promise.all([
    updateUserFromProfile(existingUser, profile),
    prisma.user.update({
      where: { id: existingUser.id },
      data: { lastLoginAt: new Date() }
    })
  ])

  await pusherSuperuser('user-signed-in', {
    email: existingUser.email,
    name: existingUser.firstName,
    userId: existingUser.id
  }).catch(console.error)

  return true
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
