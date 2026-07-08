import { OrderType } from '@prisma/client'
import { CartItem } from 'app/lib/store/slices/cartSlice'

export function getOrderType(items: CartItem[]): OrderType {
  const hasWiener = items.some((i) => !i.isPhysicalProduct)
  const hasProduct = items.some((i) => i.isPhysicalProduct)

  if (hasWiener && hasProduct) return OrderType.MIXED
  if (hasWiener) return OrderType.WELCOME_WIENER
  return OrderType.PRODUCT
}
