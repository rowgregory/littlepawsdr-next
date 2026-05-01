import NextAuth from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import prisma from 'prisma/client'
import googleProvider from './auth/googleProvider'
import { magicLinkProvider } from './auth/magicLinkProvider'
import { handleEmailCallback } from './callbacks/handleEmailCallback'
import { handleGoogleCallback } from './callbacks/handleGoogleCallback'
import { createLog } from './actions/createLog'
import { Role } from '@prisma/client'

export const { handlers, auth, signIn, signOut } = NextAuth({
  debug: false,
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60 // 24 hours
  },
  adapter: PrismaAdapter(prisma),
  pages: {
    signIn: '/auth/login',
    error: '/auth/error'
  },

  providers: [googleProvider, magicLinkProvider],

  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        switch (account?.provider) {
          case 'email':
            return await handleEmailCallback(user)

          case 'google':
            return await handleGoogleCallback(user, account, profile)

          default:
            return true
        }
      } catch (error) {
        return false
      }
    },

    async jwt({ token, user }) {
      if (user) {
        try {
          const dbUser = await prisma.user.findUnique({
            where: { email: user.email! },
            select: {
              id: true,
              role: true,
              firstName: true,
              lastName: true
            }
          })

          if (dbUser) {
            token.userId = dbUser.id
            token.role = dbUser.role
            if (dbUser.firstName && dbUser.lastName) {
              token.name = `${dbUser.firstName} ${dbUser.lastName}`.trim()
            }

            await prisma.user.update({
              where: { email: user.email! },
              data: { lastLoginAt: new Date() }
            })
          }
        } catch (error) {
          await createLog('error', 'JWT callback error', {
            error: error instanceof Error ? error.message : 'Unknown error',
            email: user.email
          })
        }
      }
      return token
    },

    async session({ session, token }) {
      if (token.userId && typeof token.userId === 'string') {
        session.user.id = token.userId
        session.user.role = token.role as Role
      } else {
        await createLog('error', 'Session callback error - missing userId', {
          email: session.user.email
        })
      }

      return session
    }
  }
})
