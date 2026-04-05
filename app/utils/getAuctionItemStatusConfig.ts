import { AuctionItemStatus } from 'types/entities/auction-item'

export function getAuctionItemStatusConfig(status: AuctionItemStatus) {
  switch (status) {
    case 'SOLD':
      return { label: 'Sold', classes: 'bg-emerald-500/10 text-emerald-500' }
    case 'UNSOLD':
      return {
        label: 'Unsold',
        classes: 'bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark text-muted-light dark:text-muted-dark'
      }
  }
}
