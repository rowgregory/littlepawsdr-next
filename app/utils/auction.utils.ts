import { AuctionStatus } from '@prisma/client'
import { AuctionItemStatus } from 'types/entities/auction-item'

export function getItemStatusConfig(status: AuctionItemStatus) {
  switch (status) {
    case 'SOLD':
      return { label: 'Sold', classes: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' }
    case 'ACTIVE':
      return {
        label: 'Active',
        classes:
          'bg-primary-light/10 dark:bg-primary-dark/10 text-primary-light dark:text-primary-dark border-primary-light/20 dark:border-primary-dark/20'
      }
    case 'UNSOLD':
      return {
        label: 'Unsold',
        classes:
          'bg-surface-light dark:bg-surface-dark text-muted-light dark:text-muted-dark border-border-light dark:border-border-dark'
      }
  }
}

export function getAuctionStatusConfig(status: AuctionStatus) {
  switch (status) {
    case 'ACTIVE':
      return { label: 'Active', classes: 'bg-emerald-500/10 text-emerald-500' }
    case 'DRAFT':
      return { label: 'Draft', classes: 'bg-amber-500/10 text-amber-500' }
    case 'ENDED':
      return {
        label: 'Ended',
        classes:
          'bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark text-muted-light dark:text-muted-dark'
      }
  }
}
