import { AuctionStatus } from '@prisma/client'

export interface IAuction {
  id: string
  title: string
  status: AuctionStatus
  goal: number
  totalAuctionRevenue: number
  supporters: number
  supporterEmails: string[]
  customAuctionLink?: string | null
  anonymousBidding: boolean
  startDate: Date
  endDate: Date
  createdAt: Date
  updatedAt: Date
}
