import mongoose, { Types, Schema } from 'mongoose'
import { AuctionItemPaymentStatusEnumValues } from './campaignModel'

export interface IAuctionItemInstantBuyer {
  _id?: Types.ObjectId
  auction?: Types.ObjectId
  auctionItem?: Types.ObjectId
  user?: Types.ObjectId
  name?: string
  email?: string
  paymentStatus?: (typeof AuctionItemPaymentStatusEnumValues)[number] // 'Pending' | 'Paid'
  shippingStatus?: string
  shippingProvider?: string
  trackingNumber?: string
  totalPrice?: number
  createdAt?: Date
  updatedAt?: Date
}

export const auctionItemInstantBuyerSchema = new Schema<IAuctionItemInstantBuyer>(
  {
    auction: {
      type: Schema.Types.ObjectId,
      ref: 'Auction'
    },
    auctionItem: {
      type: Schema.Types.ObjectId,
      ref: 'AuctionItem'
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    name: { type: String },
    email: { type: String },
    paymentStatus: {
      type: String,
      enum: AuctionItemPaymentStatusEnumValues,
      default: 'Paid'
    },
    shippingStatus: { type: String, default: 'Pending Fulfillment' },
    shippingProvider: { type: String },
    trackingNumber: { type: String },
    totalPrice: { type: Number }
  },
  { timestamps: true }
)

const AuctionItemInstantBuyer =
  mongoose.models.AuctionItemInstantBuyer || mongoose.model<IAuctionItemInstantBuyer>('AuctionItemInstantBuyer', auctionItemInstantBuyerSchema)

export default AuctionItemInstantBuyer
