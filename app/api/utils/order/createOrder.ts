import mongoose from 'mongoose'
import Order from 'models/orderModel'
import ProductOrder from 'models/productOrderModel'
import DogBoostOrder from 'models/dogBoostOrderModel'
import createAdoptionApplicationFee from '../adopt/createAdoptionApplicationFee'
import EcardOrder from 'models/ecardOrderModel'
import AuctionItem from 'models/auctionItemModel'

export type CreateOrderParams = {
  name: string
  email: string
  user: string
  paymentIntentId: string
  shippingAddress?: any
  shippingPrice?: number
  requiresShipping?: boolean
  subtotal?: number
  totalPrice: number
  products?: any[]
  ecards?: any[]
  dogBoosts?: any[]
  auctionItems?: any[]
  adoptFee?: any
  hasPhysicalItems?: boolean | null
  isPaid: boolean
}

const createOrder = async (baseOrderData: CreateOrderParams, session: mongoose.ClientSession) => {
  try {
    const {
      products,
      ecards,
      dogBoosts,
      auctionItems,
      adoptFee,
      hasPhysicalItems,
      shippingAddress,
      shippingPrice,
      requiresShipping,
      ...mainOrderFields
    } = baseOrderData

    const orderData: any = { ...mainOrderFields }

    if (hasPhysicalItems) {
      orderData.shippingAddress = JSON.parse(shippingAddress)
      orderData.shippingPrice = Number(shippingPrice) || 0
      orderData.requiresShipping = requiresShipping ?? false
    }

    // Create base order
    const [order] = await Order.create([mainOrderFields], { session })

    let totalItems = 0

    // Create related child documents
    if (products?.length) {
      const created = await ProductOrder.create(
        products.map((p) => ({ ...p, orderId: order._id })),
        { session }
      )
      order.products = created.map((p) => p._id)
      order.isProduct = true
      totalItems += created.length
    }

    if (ecards?.length) {
      const created = await EcardOrder.create(
        ecards.map((e) => ({ ...e, orderId: order._id })),
        { session }
      )
      order.ecards = created.map((e) => e._id)
      order.isEcard = true
      totalItems += created.length
    }

    if (dogBoosts?.length) {
      const created = await DogBoostOrder.create(
        dogBoosts.map((d) => ({ ...d, orderId: order._id })),
        { session }
      )
      order.dogBoosts = created.map((d) => d._id)
      order.isDogBoost = true
      totalItems += created.length
    }

    if (auctionItems?.length) {
      const created = await AuctionItem.create(
        auctionItems.map((a) => ({ ...a, orderId: order._id })),
        { session }
      )
      order.auctionItems = created.map((a) => a._id)
      totalItems += created.length
    }

    if (adoptFee) {
      const created = await createAdoptionApplicationFee(adoptFee, order._id, session)
      order.adoptFee = created._id
      order.isAdoptFee = true
      totalItems += 1
    }

    order.totalItems = totalItems

    // IMPORTANT: Use unset to remove empty array fields
    if (!products?.length) order.products = undefined
    if (!ecards?.length) order.ecards = undefined
    if (!dogBoosts?.length) order.dogBoosts = undefined
    if (!auctionItems?.length) order.auctionItems = undefined
    if (!adoptFee) order.adoptFee = undefined

    if (!order?.isProduct && !order?.isAuction) delete order.subtotal
    if (!shippingAddress) delete order.shippingAddress
    if (!shippingPrice) delete order.shippingPrice
    if (requiresShipping === undefined || requiresShipping === null) delete order.requiresShipping

    await order.save({ session })

    return order
  } catch (err) {
    await session.abortTransaction()
    session.endSession()
    throw err
  }
}

export default createOrder
