import { DefaultSession, DefaultUser } from 'next-auth'

declare module '@auth/core/adapters' {
  interface AdapterUser {
    role: 'ADMIN' | 'SUPERUSER' | 'SUPPORTER'
    firstName: string | null
    lastName: string | null
  }
}

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email: string
      role: 'ADMIN' | 'SUPERUSER' | 'SUPPORTER'
    } & DefaultSession['user']
  }

  interface User extends DefaultUser {
    id: string
    role: 'ADMIN' | 'SUPERUSER' | 'SUPPORTER'
  }
}
