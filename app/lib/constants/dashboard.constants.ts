import { OrderType } from '@prisma/client'
import { Dog, Gavel, Heart, Gift, RefreshCw, Package, Utensils } from 'lucide-react'

export const sourceMeta: Record<string, { label: string; icon: typeof Heart }> = {
  ADOPTION_FEE: { label: 'Adoption fees', icon: Heart },
  ONE_TIME_DONATION: { label: 'One-time donations', icon: Gift },
  RECURRING_DONATION: { label: 'Recurring donations', icon: RefreshCw },
  WELCOME_WIENER: { label: 'Welcome Wieners', icon: Dog },
  FEED_A_FOSTER: { label: 'Feed a Foster', icon: Utensils },
  PRODUCT: { label: 'Products', icon: Package },
  AUCTION_PURCHASE: { label: 'Auctions', icon: Gavel },
  MIXED: { label: 'Mixed', icon: Gift }
}

export const HISTORICAL_ADOPTION_FEES = 16185
export const HISTORICAL_AUCTIONS = 16317
export const HISTORICAL_ORDERS = 10622
export const HISTORICAL_ONE_TIME_DONATIONS = 49389

export const HISTORICAL_ADOPTION_COUNT = 0
export const HISTORICAL_AUCTION_COUNT = 0
export const HISTORICAL_ORDER_COUNT = 0
export const HISTORICAL_DONATION_COUNT = 0

export const HISTORICAL_BY_TYPE: { type: OrderType; total: number; count: number }[] = [
  { type: 'ADOPTION_FEE', total: HISTORICAL_ADOPTION_FEES, count: HISTORICAL_ADOPTION_COUNT },
  { type: 'AUCTION_PURCHASE', total: HISTORICAL_AUCTIONS, count: HISTORICAL_AUCTION_COUNT },
  { type: 'PRODUCT', total: HISTORICAL_ORDERS, count: HISTORICAL_ORDER_COUNT },
  { type: 'ONE_TIME_DONATION', total: HISTORICAL_ONE_TIME_DONATIONS, count: HISTORICAL_DONATION_COUNT }
]
