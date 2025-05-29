import mongoose from 'mongoose'

export interface IAuctionSettings {
  startDate: Date
  endDate: Date
  isAuctionPublished: boolean
  anonymousBidding: boolean
  hasBegun: boolean
  hasEnded: boolean
  auctionStatus: string
  status: string
}

export interface IAuction {
  _id?: mongoose.Types.ObjectId
  campaign?: mongoose.Types.ObjectId
  items?: mongoose.Types.ObjectId[]
  donations?: mongoose.Types.ObjectId[]
  bidders?: mongoose.Types.ObjectId[]
  winningBids?: mongoose.Types.ObjectId[]
  settings?: IAuctionSettings
  createdAt?: Date
  updatedAt?: Date
}

const auctionSchema = new mongoose.Schema<IAuction>(
  {
    campaign: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Campaign'
    },
    items: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AuctionItem',
        default: []
      }
    ],
    donations: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AuctionDonation',
        default: []
      }
    ],
    bidders: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AuctionBidder',
        default: []
      }
    ],
    winningBids: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AuctionWinningBidder',
        default: []
      }
    ],
    settings: {
      type: Object,
      default: () => {
        const startDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 1 week from now
        const endDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) // 2 weeks from now
        endDate.setHours(17, 0, 0, 0) // 5:00 PM
        startDate.setHours(9, 0, 0, 0) // 9:00 AM
        return {
          startDate,
          endDate,
          isAuctionPublished: true,
          anonymousBidding: true,
          hasBegun: false,
          hasEnded: false,
          auctionStatus: 'Bidding opens',
          status: 'UPCOMING'
        }
      }
    }
  },
  { timestamps: true }
)

const Auction = mongoose.models.Auction || mongoose.model<IAuction>('Auction', auctionSchema)

export default Auction
