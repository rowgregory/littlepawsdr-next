import mongoose, { Types } from 'mongoose'

export interface IEcardOrder {
  _id?: Types.ObjectId
  ecardId?: Types.ObjectId
  orderId?: Types.ObjectId
  recipientsFullName: string
  recipientsEmail: string
  name: string
  email: string
  message: string
  dateToSend: Date
  totalPrice: number
  image: string
  ecardtName?: string
  isSent?: boolean
  quantity?: number
  isPhysicalProduct?: boolean
  sendNow?: string
  status?: string

  // legacy attributes
  firstName?: string
  lastName?: string
  recipientsFirstName?: string
  subTotal?: number

  createdAt?: Date
  updatedAt?: Date
}

const ecardOrderSchema = new mongoose.Schema(
  {
    ecardId: { type: mongoose.Schema.Types.ObjectId, ref: 'Ecard' },
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
    recipientsFullName: { type: String, required: true },
    recipientsEmail: { type: String, required: true },
    name: { type: String },
    email: { type: String, required: true },
    message: { type: String, required: true },
    dateToSend: { type: Date, required: true },
    totalPrice: { type: Number, required: true, default: 0.0 },
    image: { type: String, required: true },
    ecardName: { type: String },
    isSent: { type: Boolean, default: false },
    quantity: { type: Number },
    isPhysicalProduct: { type: Boolean, default: false },
    sendNow: { type: String },
    status: { type: String, default: 'Not sent' },

    // legacy attributes
    firstName: { type: String },
    lastName: { type: String },
    recipientsFirstName: { type: String },
    subTotal: { type: Number }
  },
  {
    timestamps: true
  }
)

const EcardOrder = mongoose.models.EcardOrder || mongoose.model('EcardOrder', ecardOrderSchema)

export default EcardOrder
