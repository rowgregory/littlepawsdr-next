import { RecurringFrequency } from '@prisma/client'
import { IPaymentMethod } from './entities/payment-method.types'

export type Tier = {
  id: string
  name: string
  price: { MONTHLY: number; YEARLY: number }
  badge: string | null
  tier: 'bronze' | 'silver' | 'gold' | 'elite'
}

export type SubscriptionPaymentFormProps = {
  tier: Tier
  billing: RecurringFrequency
  savedCards: IPaymentMethod[]
  userName: { firstName: string; lastName: string }
}

export type TierKey = 'bronze' | 'silver' | 'gold' | 'elite'
