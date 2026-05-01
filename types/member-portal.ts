import { OrderStatus, OrderType, ShippingStatus } from '@prisma/client'
import { IAddress } from './entities/address'
import { IAdoptionFee } from './entities/adoption-fee'
import { IPaymentMethod } from './entities/payment-method.types'

export interface Donation {
  id: string
  amount: number
  createdAt: Date
  status: string
}

export interface Subscription {
  id: string
  tierName: string
  amount: number
  interval: 'month' | 'year'
  status: OrderStatus
  nextBillingDate?: Date
}

export interface AuctionBid {
  id: string
  itemName: string
  itemImage: string | null
  bidAmount: number
  isWinner: boolean
  auctionEndDate: Date
  status: 'active' | 'ended'
}

export interface User {
  id: string
  firstName: string | null
  lastName: string | null
  email: string | null
  image: string | null
  address: IAddress
}

interface AuctionParticipationGroup {
  auctionId: string
  auctionTitle: string
  auctionStatus: string
  auctionEndDate: Date | null
  customAuctionLink: string | null
  winningBidderPaymentLink: string | null
  winningBidPaymentStatus: string
  totalBids: number
  paidOn: Date | null
  bids: {
    lastBidAt: Date
    totalBids: number
    auctionItemId: any
    status: string
    id: string
    itemName: string
    itemImage: string | null
    bidAmount: number
    isWinner: boolean
  }[]
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
    addressLine1: string | null
    addressLine2: string | null
    city: string | null
    state: string | null
    zipPostalCode: string | null
  } | null
}

export interface MemberPortalPageProps {
  user: User
  donations: Donation[]
  subscriptions: Subscription[]
  auctionParticipation: AuctionParticipationGroup[]
  paymentMethods: IPaymentMethod[]
  adoptionFees: IAdoptionFee[]
  merchAndWWOrders: MerchAndWWOrder[]
}
