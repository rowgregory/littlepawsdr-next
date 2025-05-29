import mongoose from 'mongoose'
import {
  AuctionItemPaymentStatusEnum,
  AuctionItemPaymentStatusEnumValues,
  WinningBidPaymentStatusEnum,
  WinningBidPaymentStatusValues
} from './campaignModel'

export interface IAuctionWinningBidder {
  _id?: mongoose.Types.ObjectId
  auction: mongoose.Types.ObjectId
  user: mongoose.Types.ObjectId
  auctionItems: mongoose.Types.ObjectId[]
  winningBidPaymentStatus: WinningBidPaymentStatusEnum
  auctionItemPaymentStatus: AuctionItemPaymentStatusEnum
  auctionPaymentNotificationEmailHasBeenSent: boolean
  emailNotificationCount: number
  elapsedTimeSinceAuctionItemWon?: string
  processingFee?: number
  totalPrice?: number
  shipping?: number
  shippingStatus?: string
  shippingProvider?: string
  itemSoldPrice?: number
  trackingNumber?: string
  payPalId?: string
  paidOn?: Date
  createdAt?: Date
  updatedAt?: Date
}

const auctionWinningBidderSchema = new mongoose.Schema<IAuctionWinningBidder>(
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
    auctionItems: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AuctionItem',
        required: true
      }
    ],
    winningBidPaymentStatus: {
      type: String,
      enum: WinningBidPaymentStatusValues,
      default: 'Awaiting Payment'
    },
    auctionItemPaymentStatus: {
      type: String,
      enum: AuctionItemPaymentStatusEnumValues,
      default: 'Pending'
    },
    auctionPaymentNotificationEmailHasBeenSent: {
      type: Boolean,
      default: false
    },
    emailNotificationCount: {
      type: Number,
      default: 0
    },
    elapsedTimeSinceAuctionItemWon: {
      type: String
    },
    processingFee: {
      type: Number
    },
    totalPrice: {
      type: Number
    },
    shipping: {
      type: Number
    },
    shippingStatus: {
      type: String,
      default: 'Pending Payment Confirmation'
    },
    shippingProvider: {
      type: String
    },
    itemSoldPrice: {
      type: Number
    },
    trackingNumber: {
      type: String
    },
    payPalId: {
      type: String
    },
    paidOn: {
      type: Date
    }
  },
  { timestamps: true }
)

const AuctionWinningBidder =
  mongoose.models.AuctionWinningBidder || mongoose.model<IAuctionWinningBidder>('AuctionWinningBidder', auctionWinningBidderSchema)

export default AuctionWinningBidder
