import NextAuth from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import prisma from 'prisma/client'
import type { AdapterUser } from '@auth/core/adapters'
import { Role } from '@prisma/client'
import { authConfig } from './auth.config'
import googleProvider from './auth/googleProvider'
import { magicLinkProvider } from './auth/magicLinkProvider'
import { handleMagicLinkCallback } from './callbacks/magic-link.callback'
import { handleGoogleCallback } from './callbacks/google.callback'
import { createLog } from './actions/log/createLog'

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  debug: false,
  session: {
    strategy: 'database',
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60 // 24 hours
  },
  adapter: PrismaAdapter(prisma),
  providers: [googleProvider, magicLinkProvider],
  callbacks: {
    ...authConfig.callbacks,

    async signIn({ user, account, profile }) {
      try {
        switch (account?.provider) {
          case 'email':
            return await handleMagicLinkCallback(user)
          case 'google':
            return await handleGoogleCallback(user, account, profile)
          default:
            return true
        }
      } catch {
        return false
      }
    },

    async session({ session, user }) {
      const dbUser = user as AdapterUser & {
        firstName: string | null
        lastName: string | null
      }

      session.user.id = dbUser.id
      session.user.role = dbUser.role as Role

      if (dbUser.firstName && dbUser.lastName) {
        session.user.name = `${dbUser.firstName} ${dbUser.lastName}`.trim()
      }

      // fire-and-forget lastLoginAt
      prisma.user
        .update({
          where: { id: user.id },
          data: { lastLoginAt: new Date() }
        })
        .catch((err) =>
          createLog('error', 'Failed to update lastLoginAt', {
            error: err instanceof Error ? err.message : 'Unknown error',
            userId: user.id
          })
        )

      return session
    }
  }
})
