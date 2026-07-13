'use client'

import {
  OrderCustomerSection,
  OrderFailureBanner,
  OrderFulfillmentSection,
  OrderItemsSection,
  OrderPaymentSection,
  OrderSubscriptionHistory,
  OrderTopbar
} from 'app/components/admin/orders'
import { SerializedOrder, SerializedSubscriptionOrder } from 'types/_order.types'

type Props = {
  order: SerializedOrder
  subscriptionOrders: SerializedSubscriptionOrder[]
}

export function AdminOrderDetailsClient({ order, subscriptionOrders }: Props) {
  const hasPhysical = order.items.some((i) => i.isPhysical)
  const hasSubscriptionHistory = subscriptionOrders?.length > 1

  return (
    <main id="main-content" className="min-h-screen w-full bg-bg-light dark:bg-bg-dark">
      <OrderTopbar order={order} />
      <OrderFailureBanner order={order} />

      <div className="w-full px-4 sm:px-6 py-6 grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-6 items-start">
        {/* Left */}
        <div className="space-y-6 min-w-0">
          <OrderItemsSection order={order} />
          {hasSubscriptionHistory && <OrderSubscriptionHistory orders={subscriptionOrders} currentOrderId={order.id} />}
        </div>

        {/* Right */}
        <div className="space-y-6">
          {hasPhysical && <OrderFulfillmentSection order={order} />}
          <OrderCustomerSection order={order} />
          <OrderPaymentSection order={order} />
        </div>
      </div>
    </main>
  )
}
