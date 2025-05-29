import mongoose, { Types, Schema } from 'mongoose'
import { AuctionItemStatusEnum, AuctionItemStatusEnumValues, SellingFormatEnum, SellingFormatEnumValues } from './campaignModel'

export interface IItem {
  _id: Types.ObjectId
  auction?: Types.ObjectId
  photos?: Types.ObjectId[]
  bids?: Types.ObjectId[]
  instantBuyers?: Types.ObjectId[]
  name?: string
  description?: string
  sellingFormat?: SellingFormatEnum
  startingPrice?: number
  buyNowPrice?: number
  currentPrice?: number
  totalQuantity?: number
  requiresShipping?: boolean
  shippingCosts?: number
  status?: AuctionItemStatusEnum
  currentBid?: number
  minimumBid?: number
  totalBids?: number
  retailValue?: string
  highestBidAmount?: number
  soldPrice?: number
  itemBtnText?: string
  topBidder?: string
  isAuction?: boolean
  isFixed?: boolean
  createdAt?: Date
  updatedAt?: Date
}

export const auctionItemSchema = new Schema<IItem>(
  {
    auction: {
      type: Schema.Types.ObjectId,
      ref: 'Auction'
    },
    photos: [
      {
        type: Schema.Types.ObjectId,
        ref: 'AuctionItemPhoto'
      }
    ],
    bids: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Bid'
      }
    ],
    instantBuyers: [
      {
        type: Schema.Types.ObjectId,
        ref: 'AuctionItemInstantBuyer'
      }
    ],
    name: { type: String },
    description: { type: String },
    sellingFormat: { type: String, enum: SellingFormatEnumValues },
    startingPrice: { type: Number },
    buyNowPrice: { type: Number },
    currentPrice: { type: Number },
    totalQuantity: { type: Number },
    requiresShipping: { type: Boolean, default: true },
    shippingCosts: { type: Number },
    status: { type: String, enum: AuctionItemStatusEnumValues, default: 'Unsold' },
    currentBid: { type: Number },
    minimumBid: { type: Number },
    totalBids: { type: Number },
    retailValue: { type: String },
    highestBidAmount: { type: Number },
    soldPrice: { type: Number },
    itemBtnText: { type: String },
    topBidder: { type: String },
    isAuction: { type: Boolean },
    isFixed: { type: Boolean }
  },
  { timestamps: true }
)

const AuctionItem = mongoose.models.AuctionItem || mongoose.model<IItem>('AuctionItem', auctionItemSchema)

export default AuctionItem
