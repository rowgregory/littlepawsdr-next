import NextAuth from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import prisma from 'prisma/client'
import type { AdapterUser } from '@auth/core/adapters'
import { Role } from '@prisma/client'
import { authConfig } from './auth.config'
import { handleMagicLinkCallback } from './callbacks/magic-link.callback'
import { handleGoogleCallback } from './callbacks/google.callback'
import { createLog } from './actions/log/createLog'
import { pusherSuperuser } from 'app/lib/pusher/pusher.utils'
import { cache } from 'react'
import { migrateMongoUser } from './actions/migrate/migrateMongoUser'
import { handleFacebookCallback } from './callbacks/facebook.callback'
import { googleProvider, facebookProvider, magicLinkProvider } from './auth/index'

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  debug: false,
  session: {
    strategy: 'database',
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60 // 24 hours
  },
  adapter: PrismaAdapter(prisma),
  providers: [googleProvider, magicLinkProvider, facebookProvider],
  callbacks: {
    ...authConfig.callbacks,

    async signIn({ user, account, profile }) {
      try {
        switch (account?.provider) {
          case 'email':
            return await handleMagicLinkCallback(user)
          case 'google':
            return await handleGoogleCallback(user, account, profile)
          case 'facebook':
            return await handleFacebookCallback(user, account, profile)
          default:
            return true
        }
      } catch (error) {
        await createLog('error', 'Sign-in callback failed', {
          provider: account?.provider,
          email: user?.email,
          error: error instanceof Error ? error.message : 'Unknown error'
        })
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

      return session
    }
  },
  events: {
    async signIn({ user }) {
      // Update lastLoginAt
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

      // Lazy Mongo migration — fires after user exists in DB
      if (user.email) {
        const mongoUser = await prisma.mongoUser.findUnique({
          where: { email: user.email.toLowerCase().trim() }
        })
        if (mongoUser) {
          migrateMongoUser(user.email, user.id).catch((err) =>
            createLog('error', 'Mongo migration failed silently', {
              email: user.email,
              error: err instanceof Error ? err.message : 'Unknown error'
            })
          )
        }
      }
    },

    async createUser({ user }) {
      // Google gives user.name ("First Last"); magic link gives nothing, so derive from email
      const emailName = user.email!.split('@')[0]
      const [firstName, ...rest] = (user.name ?? '').trim().split(' ').filter(Boolean)

      await prisma.user
        .update({
          where: { id: user.id },
          data: {
            firstName: firstName || emailName.charAt(0).toUpperCase() + emailName.slice(1),
            lastName: rest.length ? rest.join(' ') : null
          }
        })
        .catch((err) =>
          createLog('error', 'Failed to backfill new user name', {
            error: err instanceof Error ? err.message : 'Unknown error',
            userId: user.id
          })
        )

      await pusherSuperuser('user-registered', {
        email: user.email,
        userId: user.id
      }).catch(console.error)
    }
  }
})

export const getSession = cache(auth)
