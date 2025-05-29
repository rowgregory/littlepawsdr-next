import mongoose, { Types } from 'mongoose'
import { IShippingAddress } from './shippingAddressModel'

export interface IAuctionItemOrder {
  orderId: Types.ObjectId
  auctionItems: {
    itemId: Types.ObjectId
    name?: string
    quantity?: number
    price?: number
    subtotal?: number
    requiresShipping?: boolean
    shippingPrice?: number
  }[]
  email: string
  totalPrice: number
  shippingAddress?: Types.ObjectId | IShippingAddress
  status: string
  createdAt?: Date
  updatedAt?: Date
}

const auctionItemOrderSchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      required: true
    },
    auctionItems: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AuctionItem',
        required: true
      }
    ],
    email: { type: String, required: true },
    totalPrice: { type: Number, required: true },
    shippingAddress: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ShippingAddress',
      required: false
    },
    status: { type: String, default: 'Pending' }
  },
  { timestamps: true }
)

const AuctionItemOrder = mongoose.models.AuctionItemOrder || mongoose.model('AuctionItemOrder', auctionItemOrderSchema)

export default AuctionItemOrder
