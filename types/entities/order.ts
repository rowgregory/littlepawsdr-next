import { OrderStatus, OrderType, ShippingStatus } from '@prisma/client'

export interface IOrderItem {
  shippingPrice: any
  id: string
  price: number
  quantity: number | null
  subtotal: number | null
  totalPrice: number | null
  isPhysical: boolean
  itemName: string | null
  itemImage: string | null
  images: string[]
  createdAt: Date
}

export interface IOrder {
  shippingStatus: ShippingStatus
  id: string
  type: OrderType
  status: OrderStatus
  createdAt: Date
  updatedAt: Date
  totalAmount: number
  paymentMethodId: string | null
  paymentIntentId: string | null
  paidAt: Date | null
  customerEmail: string
  customerName: string
  customerPhone: string | null
  coverFees: boolean
  feesCovered: number
  notes: string | null
  failureReason: string | null
  failureCode: string | null
  userId: string | null
  isRecurring: boolean
  recurringFrequency: string | null
  stripeSubscriptionId: string | null
  nextBillingDate: Date | null
  addressLine1: string | null
  addressLine2: string | null
  city: string | null
  state: string | null
  zipPostalCode: string | null
  country: string | null
  isPhysical: boolean
  items: IOrderItem[]
  user?: {
    firstName: string | null
    lastName: string | null
    email: string | null
  } | null
}
