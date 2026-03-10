import { BidStatus } from '@prisma/client'

export interface IAuctionBid {
  id: string
  auctionId: string
  auctionItemId: string
  userId: string
  bidderId: string
  bidAmount: number
  bidderName?: string | null
  email?: string | null
  status: BidStatus
  sentWinnerEmail: boolean
  emailCount: number
  createdAt: Date
  updatedAt: Date
}
