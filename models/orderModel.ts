import mongoose from 'mongoose'

import { Types } from 'mongoose'
import ShippingAddress, { IShippingAddress } from './shippingAddressModel'

export interface IOrder {
  _id?: Types.ObjectId
  user: Types.ObjectId

  products: Types.ObjectId[]
  dogBoosts: Types.ObjectId[]
  ecards: Types.ObjectId[]
  auctionItems: Types.ObjectId[]
  adoptFee?: Types.ObjectId

  paymentIntentId?: string

  shippingAddress?: Types.ObjectId | IShippingAddress
  shippingPrice?: number
  requiresShipping?: boolean

  subtotal?: number
  totalPrice: number
  totalItems?: number
  status?: string
  isPaid?: boolean

  isEcard?: boolean
  isDogBoost?: boolean
  isProduct?: boolean
  isAdoptFee?: boolean
  isAuctionItem?: boolean

  createdAt?: Date
  updatedAt?: Date
}

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ProductOrder'
      }
    ],
    dogBoosts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'DogBoostOrder'
      }
    ],
    ecards: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ECardOrder'
      }
    ],
    auctionItems: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AuctionItem'
      }
    ],
    adoptFee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AdoptionFee',
      required: false
    },

    paymentIntentId: { type: String },

    // physical product fields
    shippingAddress: mongoose.Schema.Types.ObjectId || ShippingAddress,
    shippingPrice: { type: Number },
    requiresShipping: { type: Boolean },

    subtotal: { type: Number },
    totalPrice: { type: Number, required: true, default: 0.0 },
    totalItems: { type: Number },
    status: { type: String },
    isPaid: { type: Boolean },

    isEcard: { type: Boolean },
    isDogBoost: { type: Boolean },
    isProduct: { type: Boolean },
    isAdoptFee: { type: Boolean },
    isAuctionItem: { type: Boolean }
  },
  {
    timestamps: true
  }
)

const Order = mongoose.models.Order || mongoose.model('Order', orderSchema)

export default Order
