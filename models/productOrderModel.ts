import mongoose, { Types } from 'mongoose'

export interface IProductOrder {
  _id?: Types.ObjectId
  price: number
  productId?: string
  productImage?: string
  productName?: string
  quantity?: number
  size?: string
  email?: string
  isPhysicalProduct?: boolean
  subtotal?: number
  orderId?: Types.ObjectId
  status?: string
  createdAt?: Date
  updatedAt?: Date
}

const productOrderSchema = new mongoose.Schema(
  {
    price: { type: Number, required: true },
    productId: { type: String },
    productImage: { type: String },
    productName: { type: String },
    quantity: { type: Number },
    size: { type: String },
    email: { type: String },
    isPhysicalProduct: { type: Boolean, default: true },
    subtotal: { type: Number },
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order'
    },
    status: { type: String, default: 'Pending Fulfillment' }
  },
  {
    timestamps: true
  }
)

const ProductOrder = mongoose.models.ProductOrder || mongoose.model('ProductOrder', productOrderSchema)

export default ProductOrder
