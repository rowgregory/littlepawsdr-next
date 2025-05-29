import mongoose, { Types } from 'mongoose'

export interface IDogBoostOrder {
  _id?: Types.ObjectId
  dachshundId: string
  productImage: string
  dachshundName: string
  price: number
  productId?: Types.ObjectId
  productIcon: string
  productName: string
  quantity: number
  email?: string
  isPhysicalProduct?: boolean
  subtotal?: number
  totalPrice?: number
  orderId?: Types.ObjectId
  createdAt?: Date
  updatedAt?: Date
}

const DogBoostOrderSchema = new mongoose.Schema(
  {
    dachshundId: { type: String, required: true },
    productImage: { type: String, required: true },
    dachshundName: { type: String, required: true },
    price: { type: Number, required: true },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'DogBoostProduct'
    },
    productIcon: { type: String, required: true },
    productName: { type: String, required: true },
    quantity: { type: Number, required: true },
    email: { type: String },
    isPhysicalProduct: { type: Boolean, default: false },
    subtotal: { type: Number },
    totalPrice: { type: Number },
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' }
  },
  {
    timestamps: true
  }
)

const DogBoostOrder = mongoose.models.DogBoostOrder || mongoose.model('DogBoostOrder', DogBoostOrderSchema)

export default DogBoostOrder
