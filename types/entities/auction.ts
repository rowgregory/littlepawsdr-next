import { IAuctionAnomaly } from './auction-anomaly'
import { IAuctionBid } from './auction-bid'
import { IAuctionBidder } from './auction-bidder'
import { IAuctionItemInstantBuyer } from './auction-instant-buyer'
import { IAuctionItem } from './auction-item'
import { IAuctionWinningBidder } from './auction-winning-bidder'
import { IUser } from './user'

export type AuctionStatus = 'DRAFT' | 'ACTIVE' | 'ENDED'

export interface IAuction {
  bids?: IAuctionBid[]
  items?: IAuctionItem[]
  bidders?: IAuctionBidder[]
  instantBuyers?: IAuctionItemInstantBuyer[]
  winningBidders?: IAuctionWinningBidder[]
  anomalies?: IAuctionAnomaly[]
  id: string
  title: string
  status: AuctionStatus
  goal: number
  totalAuctionRevenue: number
  supporters: number
  supporterEmails: string[]
  customAuctionLink?: string | null
  startDate: Date
  endDate: Date
  createdAt: Date
  updatedAt: Date
  user?: IUser
}
