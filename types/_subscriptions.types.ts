export type Tier = {
  id: string
  name: string
  price: { MONTHLY: number; YEARLY: number }
  badge: string | null
  tier: 'bronze' | 'silver' | 'gold' | 'elite'
}

export type TierKey = 'bronze' | 'silver' | 'gold' | 'elite'
