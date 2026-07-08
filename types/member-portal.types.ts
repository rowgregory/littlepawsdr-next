import type { Address, OrderStatus, OrderType, ShippingStatus } from '@prisma/client'
import { IAdoptionFee } from './entities/adoption-fee'
import { IPaymentMethod } from './entities/payment-method.types'
import { IUser } from './entities/user'
import { TIERS } from 'app/lib/constants/subscriptions.constants'
import { Dispatch, SetStateAction } from 'react'

export type BillingInterval = 'MONTHLY' | 'YEARLY'

export interface Donation {
  id: string
  amount: number
  createdAt: Date
  status: OrderStatus
}

export interface Subscription {
  id: string
  tierName: string
  amount: number
  interval: BillingInterval
  status: OrderStatus
  nextBillingDate: Date | null
}

export interface MerchAndWWOrderItem {
  id: string
  name: string
  image: string | null
  price: number
  quantity: number
  isPhysical: boolean
}

export interface MerchAndWWOrder {
  id: string
  type: OrderType
  totalAmount: number
  createdAt: Date
  status: OrderStatus
  shippingStatus: ShippingStatus | null
  customerName: string | null
  items: MerchAndWWOrderItem[]
  shippingAddress: {
    addressLine1: string
    addressLine2: string | null
    city: string | null
    state: string | null
    zipPostalCode: string | null
  } | null
}

export interface ParticipationItem {
  auctionItemId: string
  itemName: string
  itemImage: string | null
  myHighestBid: number
  myBidCount: number
  lastBidAt: Date
  itemTotalBids: number
  isWinner: boolean
  status: string
}

export interface AuctionParticipation {
  auctionId: string
  auctionTitle: string
  auctionStatus: string
  auctionEndDate: Date | null
  customAuctionLink: string | null
  myBidCount: number
  paymentLink: string | null
  paymentStatus: string | null
  paidOn: Date | null
  items: ParticipationItem[]
}

export type PortalUser = Pick<
  IUser,
  'id' | 'firstName' | 'lastName' | 'email' | 'phone' | 'anonymousBidding' | 'createdAt'
> & {
  address: Address | null
}

export interface MemberPortalClientProps {
  user: PortalUser
  donations: Donation[]
  subscriptions: Subscription[]
  auctionParticipation: AuctionParticipation[]
  paymentMethods: IPaymentMethod[]
  adoptionFees: IAdoptionFee[]
  merchAndWWOrders: MerchAndWWOrder[]
}

export type Tier = (typeof TIERS)[number]
export type TierId = Tier['id']

export interface SubscriptionSelectorProps {
  billing: BillingInterval
  setBilling: Dispatch<SetStateAction<BillingInterval>>
  selected: TierId | null
  setSelected: Dispatch<SetStateAction<TierId | null>>
}
