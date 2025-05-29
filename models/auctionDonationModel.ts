import mongoose, { Types, Schema } from 'mongoose'

export interface IAuctionDonation {
  _id?: Types.ObjectId
  auctionId?: Types.ObjectId
  donor?: string
  email?: string
  donorPublicMessage?: string
  oneTimeDonationAmount?: number
  creditCardProcessingFee?: number
  paypalId?: string
  createdAt?: Date
  updatedAt?: Date
}

export const auctionDonationSchema = new Schema<IAuctionDonation>(
  {
    auctionId: {
      type: Schema.Types.ObjectId,
      ref: 'Auction'
    },
    donor: { type: String },
    email: { type: String },
    donorPublicMessage: { type: String },
    oneTimeDonationAmount: { type: Number },
    creditCardProcessingFee: { type: Number },
    paypalId: { type: String }
  },
  { timestamps: true }
)

const AuctionDonation = mongoose.models.AuctionDonation || mongoose.model<IAuctionDonation>('AuctionDonation', auctionDonationSchema)

export default AuctionDonation
