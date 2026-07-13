import { IAuction } from './_auction'
import { IAuctionBid } from './_auction-bid'
import { IAuctionItemInstantBuyer } from './_auction-instant-buyer'
import { IAuctionItemPhoto } from './_auction-item-photo'
import { IAuctionWinningBidder } from './_auction-winning-bidder'

export type AuctionItemStatus = 'UNSOLD' | 'SOLD' | 'ACTIVE'
export type SellingFormat = 'AUCTION' | 'FIXED'

export interface IAuctionItem {
  id: string
  auctionId: string
  createdAt: Date
  updatedAt: Date

  // Details
  name: string
  description: string | null
  retailValue: string | null

  // Pricing (Decimal in DB — serialized to number)
  sellingFormat: SellingFormat
  startingPrice: number | null
  buyNowPrice: number | null
  currentPrice: number | null
  currentBid: number | null
  minimumBid: number | null
  soldPrice: number | null
  shippingCosts: number | null
  totalQuantity: number | null
  totalBids: number

  // Status
  status: AuctionItemStatus
  requiresShipping: boolean
  isAuction: boolean
  isFixed: boolean
  topBidder: string | null
  itemBtnText: string | null

  // Relations (present only when included in the query)
  auctionWinningBidderId: string | null
  winningBidder?: IAuctionWinningBidder | null
  photos?: IAuctionItemPhoto[]
  bids?: IAuctionBid[]
  instantBuyers?: IAuctionItemInstantBuyer[]
  auction?: Pick<IAuction, 'id' | 'title' | 'status' | 'startDate' | 'endDate' | 'customAuctionLink'>
  _count?: { bids: number }
}

export interface CreateAuctionItemInput {
  auctionId: string
  name: string
  description?: string
  sellingFormat: SellingFormat
  startingPrice?: number
  buyNowPrice?: number
  totalQuantity?: number
  requiresShipping?: boolean
  shippingCosts?: number
  photos?: any
}

export type UpdateAuctionItemInput = CreateAuctionItemInput
