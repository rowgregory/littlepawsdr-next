import { IAuction } from './auction'
import { IAuctionBid } from './auction-bid'
import { IAuctionItemPhoto } from './auction-item-photo'
import { IAuctionWinningBidder } from './auction-winning-bidder'

export type AuctionItemStatus = 'UNSOLD' | 'SOLD' | 'ACTIVE'
export type SellingFormat = 'AUCTION' | 'FIXED'

export interface IAuctionItem {
  id: string
  auctionId: string
  name: string
  description?: string | null
  sellingFormat: SellingFormat
  startingPrice?: number | null
  buyNowPrice?: number | null
  currentPrice?: number | null
  currentBid?: number | null
  minimumBid?: number | null
  highestBidAmount?: number | null
  soldPrice?: number | null
  totalQuantity?: number | null
  totalBids: number
  requiresShipping: boolean
  shippingCosts?: number | null
  status: AuctionItemStatus
  topBidder?: string | null
  itemBtnText?: string | null
  isAuction: boolean
  isFixed: boolean
  photos: IAuctionItemPhoto[]
  createdAt: Date
  updatedAt: Date

  winningBidder?: IAuctionWinningBidder | null
  winningBidderId?: string
  sortOrder?: number

  auction?: Pick<IAuction, 'id' | 'title' | 'status' | 'startDate' | 'endDate' | 'customAuctionLink'>
  bids?: IAuctionBid[]

  _count?: { bids: number }

  auctionWinningBidderId?: string | null
}
