import prisma from 'prisma/client'
import { AdminOrdersClient } from './AdminOrdersClient'

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    include: { _count: { select: { items: true } } }
  })

  const serialized = orders.map((o) => ({
    id: o.id,
    type: o.type,
    status: o.status,
    shippingStatus: o.shippingStatus,
    totalAmount: Number(o.totalAmount),
    customerName: o.customerName,
    customerEmail: o.customerEmail,
    isRecurring: o.isRecurring,
    itemCount: o._count.items,
    createdAt: o.createdAt.toISOString()
  }))

  return <AdminOrdersClient orders={serialized} />
}
