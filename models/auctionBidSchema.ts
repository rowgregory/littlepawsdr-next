import mongoose, { Document, Schema, Types } from 'mongoose'

export interface IAuctionBid extends Document {
  auction: Types.ObjectId
  user: Types.ObjectId
  auctionItem: Types.ObjectId
  bidAmount?: number
  bidder?: string
  email?: string
  status: 'Outbid' | 'Top Bid'
  sentWinnerEmail: boolean
  emailCount: number
  createdAt?: Date
  updatedAt?: Date
}

export const auctionBidSchema = new Schema<IAuctionBid>(
  {
    auction: {
      type: Schema.Types.ObjectId,
      ref: 'Auction',
      required: true
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    auctionItem: {
      type: Schema.Types.ObjectId,
      ref: 'AuctionItem',
      required: true
    },
    bidAmount: { type: Number },
    bidder: { type: String },
    email: { type: String },
    status: { type: String, enum: ['Outbid', 'Top Bid'], default: 'Top Bid' },
    sentWinnerEmail: { type: Boolean, default: false },
    emailCount: { type: Number, default: 0 }
  },
  { timestamps: true }
)

const AuctionBid = mongoose.models.AuctionBid || mongoose.model<IAuctionBid>('AuctionBid', auctionBidSchema)

export default AuctionBid
