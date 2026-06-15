import { OrderStatus, OrderType, ShippingStatus } from '@prisma/client'
import { FILTERS } from 'app/lib/constants/order.constants'

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

export type OrderRow = {
  id: string
  type: string
  status: string
  shippingStatus: string | null
  totalAmount: number
  customerName: string | null
  customerEmail: string | null
  isRecurring: boolean
  itemCount: number
  createdAt: string
}

export type Filter = (typeof FILTERS)[number]

export type SerializedOrderItem = {
  id: string
  itemName: string | null
  itemImage: string | null
  price: number
  shippingPrice: number
  quantity: number | null
  subtotal: number | null
  totalPrice: number | null
  size: string | null
  isPhysical: boolean
  welcomeWienerId: string
}

export type SerializedOrder = {
  isRecurring: boolean
  recurringFrequency: string | null
  tierName: string | null
  nextBillingDate: string | null
  id: string
  type: string
  status: string
  shippingStatus: string | null
  totalAmount: number
  coverFees: boolean
  feesCovered: number
  customerName: string | null
  customerEmail: string | null
  paymentIntentId: string | null
  addressLine1: string | null
  addressLine2: string | null
  city: string | null
  state: string | null
  zipPostalCode: string | null
  country: string | null
  geoCity: string | null
  geoRegion: string | null
  geoCountry: string | null
  createdAt: string
  paidAt: string | null
  items: SerializedOrderItem[]
  user: { id: string; email: string | null; firstName: string | null; lastName: string | null } | null
}
