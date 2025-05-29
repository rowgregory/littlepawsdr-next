import mongoose from 'mongoose'
import { BidderStatusEnumValues } from './campaignModel'

export type BidderStatusEnum = (typeof BidderStatusEnumValues)[number]

const auctionBidderSchema = new mongoose.Schema(
  {
    auction: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Auction',
      required: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    bids: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Bid'
      }
    ],
    status: {
      type: String,
      enum: BidderStatusEnumValues,
      default: 'Registered'
    }
  },
  { timestamps: true }
)

const AuctionBidder = mongoose.models.AuctionBidder || mongoose.model('AuctionBidder', auctionBidderSchema)

export default AuctionBidder
