import { UserStatus } from '@prisma/client'
import { IAddress } from './address'
import { IAdoptionFee } from './adoption-fee'
import { IAuctionBid } from './auction-bid'
import { IAuctionBidder } from './auction-bidder'
import { IAuctionItemInstantBuyer } from './auction-instant-buyer'
import { IAuctionWinningBidder } from './auction-winning-bidder'
import { IOrder } from './order.types'
import { IPaymentMethod } from './payment-method.types'

export type UserRole = 'ADMIN' | 'SUPPORTER' | 'SUPERUSER'
export type RoleFilter = 'ALL' | UserRole

export interface IUser {
  id: string
  createdAt: Date
  updatedAt: Date

  // Identity
  email: string
  role: UserRole
  status: UserStatus
  emailVerified: Date | null
  lastLoginAt: Date | null

  // Person info
  firstName: string | null
  lastName: string | null
  phone: string | null

  // Preferences / billing
  anonymousBidding: boolean
  autoPay: boolean
  autoPayCoverFees: boolean
  stripeCustomerId: string | null
  metadata: Record<string, unknown> | null

  // Last-known geo
  lastGeoLatitude: number | null
  lastGeoLongitude: number | null
  lastGeoCity: string | null
  lastGeoRegion: string | null
  lastGeoCountry: string | null

  // Relations (present only when included)
  address?: IAddress | null
  paymentMethods?: IPaymentMethod[]
  orders?: IOrder[]
  bids?: IAuctionBid[]
  bidder?: IAuctionBidder[]
  winningBids?: IAuctionWinningBidder[]
  instantBuys?: IAuctionItemInstantBuyer[]
  adoptionFees?: IAdoptionFee[]
}
