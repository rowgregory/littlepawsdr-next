import { AdoptionFeeStatus } from '@prisma/client'

export interface IAdoptionFee {
  id: string
  firstName?: string | null
  lastName?: string | null
  emailAddress?: string | null
  state?: string | null
  feeAmount?: number | null
  paypalOrderId?: string | null
  bypassCode?: string | null
  expiresAt?: Date | null
  status: AdoptionFeeStatus
  createdAt: Date
  updatedAt: Date
}
