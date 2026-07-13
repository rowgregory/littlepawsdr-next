import { RoleFilter } from 'types/_user'

export const PAGE_SIZE = 25

export const ROLE_FILTERS = ['ALL', 'SUPERUSER', 'ADMIN', 'SUPPORTER'] as const

export const ROLE_FILTER_LABELS: Record<RoleFilter, string> = {
  ALL: 'All roles',
  SUPERUSER: 'Super User',
  ADMIN: 'Admin',
  SUPPORTER: 'Supporter'
}
