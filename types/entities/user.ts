export interface IUser {
  id: string
  firstName: string | null
  lastName: string | null
  email: string | null
  role: string
  createdAt: Date
  anonymousBidding: boolean

  address?: null
}

export type RoleFilter = 'ALL' | 'ADMIN' | 'SUPPORTER' | 'SUPERUSER'
