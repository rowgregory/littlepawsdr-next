import { UserStatus } from '@prisma/client'
import { IAddress } from './_address.types'
import { IAdoptionFee } from './_adoption-fee'
import { IAuctionBid } from './_auction-bid'
import { IAuctionBidder } from './_auction-bidder'
import { IAuctionItemInstantBuyer } from './_auction-instant-buyer'
import { IAuctionWinningBidder } from './_auction-winning-bidder'
import { IOrder } from './_order.types'
import { IPaymentMethod } from './_payment-method.types'

export type UserRole = 'ADMIN' | 'SUPPORTER' | 'SUPER_USER'
export type RoleFilter = 'ALL' | UserRole

export interface IUser {
  migrationStatus: string
  pendingMigrationCount?: number
  id: string
  createdAt: Date
  updatedAt: Date

  // Identity
  email: string
  image?: string
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

  paymentMethodCount?: number

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
