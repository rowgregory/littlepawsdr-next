import mongoose from 'mongoose'

import { Types } from 'mongoose'

export interface IAdoptionFee {
  orderId: Types.ObjectId
  firstName?: string
  lastName?: string
  emailAddress?: string
  state?: string
  feeAmount?: number // defaults to 15 if not provided
  token?: string
  confirmationEmailHasBeenSent?: boolean
  bypassCode?: string
  exp?: number
  tokenStatus?: string // defaults to "Valid"
  applicationStatus?: string // defaults to "Active"
  customerId?: string
  paymentMethodId?: string
  createdAt?: Date
  updatedAt?: Date
}

const adoptionFeeSchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      required: true
    },
    firstName: {
      type: String
    },
    lastName: {
      type: String
    },
    emailAddress: {
      type: String,
      unique: false
    },
    state: {
      type: String
    },
    feeAmount: {
      type: Number,
      default: 15
    },
    token: {
      type: String
    },
    confirmationEmailHasBeenSent: {
      type: Boolean
    },
    bypassCode: {
      type: String
    },
    exp: {
      type: Number
    },
    tokenStatus: { type: String, default: 'Valid' },
    applicationStatus: { type: String, default: 'Active' },
    customerId: { type: String },
    paymentMethodId: { type: String }
  },
  {
    timestamps: true
  }
)

const AdoptionFee = mongoose.models.AdoptionFee || mongoose.model('AdoptionFee', adoptionFeeSchema)

export default AdoptionFee
