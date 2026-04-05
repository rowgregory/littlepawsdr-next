import { AuctionStatus } from '@prisma/client'

export function getAuctionStatusConfig(status: AuctionStatus) {
  switch (status) {
    case 'ACTIVE':
      return { label: 'Active', classes: 'bg-emerald-500/10 text-emerald-500' }
    case 'DRAFT':
      return { label: 'Draft', classes: 'bg-amber-500/10 text-amber-500' }
    case 'ENDED':
      return {
        label: 'Ended',
        classes: 'bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark text-muted-light dark:text-muted-dark'
      }
  }
}
