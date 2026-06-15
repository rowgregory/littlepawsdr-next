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
        classes: 'bg-surface-light dark:bg-surface-dark text-muted-light dark:text-muted-dark border-border-light dark:border-border-dark'
      }
  }
}
