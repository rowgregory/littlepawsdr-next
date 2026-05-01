import { AdoptionFeeStatus } from '@prisma/client'
import { Decimal } from '@prisma/client/runtime/library'

export interface IAdoptionFee {
  id: string
  firstName: string | null
  lastName: string | null
  feeAmount: number | Decimal | null
  email: string
  state?: string
  bypassCode?: string
  status: AdoptionFeeStatus
  expiresAt: Date | null
  createdAt: Date
}

export interface UpdateAdoptionFeeInputs {
  adoptionFeeId: string
  firstName: string
  lastName: string
  email: string
  state: string
}
