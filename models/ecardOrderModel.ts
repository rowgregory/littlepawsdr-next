import mongoose, { Types, Document, Model, Schema } from 'mongoose'

export interface IEcardOrder extends Document {
  _id: Types.ObjectId
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
  ecardName?: string
  isSent?: boolean
  quantity?: number
  isPhysicalProduct?: boolean
  sendNow?: string
  status?: string

  subMessage?: string
  recipientName?: string
  senderName?: string
  theme?: string
  background?: string
  textColor?: string
  fontSize?: string
  font?: string
  icon?: string

  firstName?: string
  lastName?: string
  recipientsFirstName?: string
  subTotal?: number

  createdAt?: Date
  updatedAt?: Date

  updatePersonalization: (data: Partial<IEcardOrder>) => Promise<IEcardOrder>
  personalization: {
    message: string
    subMessage?: string
    recipientName?: string
    senderName?: string
    theme?: string
    background?: string
    textColor?: string
    fontSize?: string
    font?: string
    icon?: string
  }
}

export interface IEcardOrderModel extends Model<IEcardOrder> {
  createWithPersonalization: (orderData: Partial<IEcardOrder>, personalizationData: Partial<IEcardOrder>) => Promise<IEcardOrder>
}

const ecardOrderSchema = new Schema<IEcardOrder, IEcardOrderModel>(
  {
    ecardId: { type: Schema.Types.ObjectId, ref: 'Ecard' },
    orderId: { type: Schema.Types.ObjectId, ref: 'Order' },
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

    subMessage: { type: String, default: 'Hope your day is wonderful!' },
    recipientName: {
      type: String,
      default: function (this: IEcardOrder) {
        return this.recipientsFullName || 'Friend'
      }
    },
    senderName: {
      type: String,
      default: function (this: IEcardOrder) {
        return this.name || 'Your Name'
      }
    },
    theme: {
      type: String,
      enum: ['birthday', 'love', 'celebration', 'nature', 'cozy', 'music'],
      default: 'birthday'
    },
    background: {
      type: String,
      enum: ['gradient-sunset', 'gradient-ocean', 'gradient-forest', 'gradient-lavender', 'gradient-golden', 'gradient-night'],
      default: 'gradient-sunset'
    },
    textColor: {
      type: String,
      default: '#ffffff',
      validate: {
        validator: function (v: string) {
          return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(v)
        },
        message: 'Text color must be a valid hex color'
      }
    },
    fontSize: {
      type: String,
      enum: ['small', 'medium', 'large', 'extra-large'],
      default: 'large'
    },
    font: {
      type: String,
      enum: ['elegant', 'modern', 'playful', 'script'],
      default: 'elegant'
    },
    icon: {
      type: String,
      enum: ['gift', 'heart', 'star', 'sparkles', 'sun', 'moon', 'flower', 'coffee', 'music'],
      default: 'gift'
    },

    firstName: { type: String },
    lastName: { type: String },
    recipientsFirstName: { type: String },
    subTotal: { type: Number }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
)

ecardOrderSchema.index({ ecardId: 1, orderId: 1 })
ecardOrderSchema.index({ recipientsEmail: 1, dateToSend: 1 })
ecardOrderSchema.index({ status: 1, isSent: 1 })

ecardOrderSchema.virtual('personalization').get(function (this: IEcardOrder) {
  return {
    message: this.message,
    subMessage: this.subMessage,
    recipientName: this.recipientName,
    senderName: this.senderName,
    theme: this.theme,
    background: this.background,
    textColor: this.textColor,
    fontSize: this.fontSize,
    font: this.font,
    icon: this.icon
  }
})

ecardOrderSchema.methods.updatePersonalization = async function (personalizationData: Partial<IEcardOrder>) {
  const allowedFields = ['message', 'subMessage', 'recipientName', 'senderName', 'theme', 'background', 'textColor', 'fontSize', 'font', 'icon']

  allowedFields.forEach((field) => {
    if (personalizationData[field as keyof IEcardOrder] !== undefined) {
      this[field as keyof IEcardOrder] = personalizationData[field as keyof IEcardOrder]
    }
  })

  return this.save()
}

ecardOrderSchema.statics.createWithPersonalization = function (orderData: Partial<IEcardOrder>, personalizationData: Partial<IEcardOrder>) {
  return this.create({
    ...orderData,
    ...personalizationData
  })
}

const EcardOrder = (mongoose.models.EcardOrder as IEcardOrderModel) || mongoose.model<IEcardOrder, IEcardOrderModel>('EcardOrder', ecardOrderSchema)

export default EcardOrder
