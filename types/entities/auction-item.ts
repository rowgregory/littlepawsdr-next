import { AuctionItemStatus, SellingFormat } from '@prisma/client'

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
  retailValue?: string | null
  totalQuantity?: number | null
  totalBids: number
  requiresShipping: boolean
  shippingCosts?: number | null
  status: AuctionItemStatus
  topBidder?: string | null
  itemBtnText?: string | null
  isAuction: boolean
  isFixed: boolean
  createdAt: Date
  updatedAt: Date
}
