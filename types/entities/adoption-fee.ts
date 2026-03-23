import { AdoptionFeeStatus } from '@prisma/client'

export interface IAdoptionFee {
  id: string
  firstName: string | null
  lastName: string | null
  feeAmount: number | null
  emailAddress: string
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
