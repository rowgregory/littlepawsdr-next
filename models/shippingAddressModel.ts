import mongoose, { Types } from 'mongoose'

export interface IShippingAddress {
  _id?: Types.ObjectId
  street?: string
  city?: string
  state?: string
  zip?: string
  country?: string
  createdAt?: Date
  updatedAt?: Date
}

const shippingAddressSchema = new mongoose.Schema(
  {
    street: { type: String },
    city: { type: String },
    state: { type: String },
    zip: { type: String },
    country: { type: String }
  },
  { timestamps: true }
)

const ShippingAddress = mongoose.models.ShippingAddress || mongoose.model('ShippingAddress', shippingAddressSchema)

export default ShippingAddress
