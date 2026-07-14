import prisma from 'prisma/client'
import { PendingShipmentData } from 'types/_dashboard.types'
import { lastNMonths, monthRange } from 'app/utils/_date.utils'
import { sumAmount } from 'app/utils/_math.utils'
import { AdminFailure, requireAdmin } from '../../auth/requireAdmin'

export async function getDashboardData() {
  const gate = await requireAdmin()
  if (!gate.ok) return { success: false, error: (gate as AdminFailure).error, data: null }

  const now = new Date()
  const thisMonth = monthRange(now.getFullYear(), now.getMonth())
  const lastMonth = monthRange(now.getFullYear(), now.getMonth() - 1)
  const sixteenWeeksAgo = new Date(now.getTime() - 112 * 24 * 60 * 60 * 1000)
  const months = lastNMonths(6)

  const [
    pendingShipmentsRaw,
    allOrders,
    thisMonthOrders,
    lastMonthOrders,
    activeAuctions,
    totalAuctionRevenue,
    totalUsers,
    newThisMonth,
    recentOrders,
    newsletterCount,
    welcomeWienerCount,
    productCount,
    bypassCode,
    wieners,
    totalAdoptionFeesResult,
    adoptionFeesThisMonthResult,
    adoptionFeeRecords,
    ordersByTypeRaw,
    // Single grouped monthly query replaces 6 individual queries
    monthlyOrdersRaw
  ] = await Promise.all([
    prisma.order.findMany({
      where: { status: 'CONFIRMED', source: 'SITE', shippingStatus: 'PENDING_FULFILLMENT' },
      include: {
        items: {
          where: { isPhysical: true },
          select: { itemName: true, quantity: true }
        }
      },
      orderBy: { createdAt: 'asc' }
    }),
    prisma.order
      .findMany({ where: { status: 'CONFIRMED', source: 'SITE' }, select: { totalAmount: true, createdAt: true } })
      .catch(() => []),
    prisma.order
      .findMany({
        where: { status: 'CONFIRMED', source: 'SITE', createdAt: { gte: thisMonth.start } },
        select: { totalAmount: true }
      })
      .catch(() => []),
    prisma.order
      .findMany({
        where: { status: 'CONFIRMED', source: 'SITE', createdAt: { gte: lastMonth.start, lte: lastMonth.end } },
        select: { totalAmount: true }
      })
      .catch(() => []),
    prisma.auction.count({ where: { status: 'ACTIVE' } }).catch(() => 0),
    prisma.auctionWinningBidder
      .aggregate({ where: { winningBidPaymentStatus: 'PAID' }, _sum: { totalPrice: true } })
      .catch(() => ({ _sum: { totalPrice: null } })),
    prisma.user.count({ where: { role: 'PACK_MEMBER' } }).catch(() => 0),
    prisma.user.count({ where: { role: 'PACK_MEMBER', createdAt: { gte: thisMonth.start } } }).catch(() => 0),
    prisma.order
      .findMany({
        where: { status: 'CONFIRMED', source: 'SITE' },
        orderBy: { createdAt: 'desc' },
        take: 8,
        select: {
          id: true,
          totalAmount: true,
          createdAt: true,
          user: { select: { firstName: true, lastName: true, email: true } }
        }
      })
      .catch(() => []),
    prisma.newsletter.count().catch(() => 0),
    prisma.welcomeWiener.count().catch(() => 0),
    prisma.product.count({ where: { isLive: true } }).catch(() => 0),
    prisma.adoptionApplicationBypassCode
      .findFirst({
        select: { bypassCode: true, updatedAt: true, nextRotationAt: true },
        orderBy: { updatedAt: 'desc' }
      })
      .catch(() => null),
    prisma.welcomeWiener.findMany({
      where: { isLive: true },
      select: {
        id: true,
        name: true,
        orderItems: {
          where: { order: { status: 'CONFIRMED' }, itemType: 'WELCOME_WIENER' },
          select: { totalPrice: true, quantity: true }
        }
      }
    }),
    prisma.adoptionFee.count({ where: { status: 'ACTIVE' } }),
    prisma.adoptionFee.count({ where: { status: 'ACTIVE', createdAt: { gte: thisMonth.start } } }),
    prisma.adoptionFee.findMany({
      where: { createdAt: { gte: sixteenWeeksAgo }, status: 'ACTIVE' },
      select: { createdAt: true, feeAmount: true }
    }),
    prisma.order.groupBy({
      by: ['type'],
      where: { status: 'CONFIRMED' },
      _count: { id: true },
      _sum: { totalAmount: true },
      orderBy: { _sum: { totalAmount: 'desc' } }
    }),
    // Fetch all orders in the 6-month window in one query, bucket in JS
    prisma.order
      .findMany({
        where: { status: 'CONFIRMED', createdAt: { gte: months[0].start, lte: months[months.length - 1].end } },
        select: { totalAmount: true, createdAt: true }
      })
      .catch(() => [])
  ])

  // ── Pending shipments ──────────────────────────────────────────────────

  const pendingShipments: PendingShipmentData[] = pendingShipmentsRaw.map((o) => ({
    id: o.id,
    name: o.customerName || o.customerEmail,
    items:
      o.items
        .map((i) => `${i.itemName ?? 'Item'}${i.quantity && i.quantity > 1 ? ` ×${i.quantity}` : ''}`)
        .join(', ') || 'Physical item',
    total: Number(o.totalAmount),
    createdAt: o.createdAt.toISOString(),
    address:
      [o.addressLine1, o.addressLine2, o.city, o.state, o.zipPostalCode, o.country].filter(Boolean).join(', ') ||
      'No address on file'
  }))

  // ── Orders by type ─────────────────────────────────────────────────────

  const ordersByType = ordersByTypeRaw.map((row) => ({
    type: row.type,
    count: row._count.id,
    total: Number(row._sum.totalAmount ?? 0)
  }))

  // ── Monthly chart — bucket single query result by month ────────────────

  const monthlyData = months.map(({ label, start, end }) => ({
    label,
    total: sumAmount(
      monthlyOrdersRaw.filter((o) => {
        const t = o.createdAt.getTime()
        return t >= start.getTime() && t <= end.getTime()
      })
    )
  }))

  // ── Adoption fee heatmap ───────────────────────────────────────────────

  const heatmapMap = new Map<string, { count: number; amount: number }>()
  for (const fee of adoptionFeeRecords) {
    const key = fee.createdAt.toISOString().slice(0, 10)
    const prev = heatmapMap.get(key) ?? { count: 0, amount: 0 }
    heatmapMap.set(key, { count: prev.count + 1, amount: prev.amount + Number(fee.feeAmount ?? 15) })
  }
  const adoptionFeeHeatmap = Array.from(heatmapMap.entries()).map(([date, { count, amount }]) => ({
    date,
    count,
    amount
  }))

  // ── Revenue totals ─────────────────────────────────────────────────────

  const totalRevenue = sumAmount(allOrders)
  const thisMonthRevenue = sumAmount(thisMonthOrders)
  const lastMonthRevenue = sumAmount(lastMonthOrders)
  const auctionRevenue = Number(totalAuctionRevenue._sum?.totalPrice ?? 0)
  const totalAdoptionRevenue = ordersByType.find((o) => o.type === 'ADOPTION_FEE')?.total ?? 0
  const monthlyChange = lastMonthRevenue === 0 ? null : ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100

  // ── Welcome wiener revenue ─────────────────────────────────────────────

  const welcomeWienerRevenue = wieners.map((w) => ({
    id: w.id,
    name: w.name ?? 'Unnamed',
    totalRaised: w.orderItems.reduce((sum, item) => sum + Number(item.totalPrice ?? 0), 0),
    sponsorCount: w.orderItems.length
  }))

  return {
    pendingShipments,
    totalRevenue,
    totalAdoptionRevenue,
    auctionRevenue,
    thisMonthRevenue,
    lastMonthRevenue,
    monthlyChange,
    activeAuctions,
    totalUsers,
    newThisMonth,
    newsletterCount,
    welcomeWienerCount,
    productCount,
    bypassCode: bypassCode?.bypassCode ?? null,
    bypassCodeRotatesAt: bypassCode?.nextRotationAt?.toISOString() ?? null,
    monthlyData,
    recentOrders: recentOrders.map((o) => ({
      id: o.id,
      total: Number(o.totalAmount),
      createdAt: o.createdAt.toISOString(),
      name:
        o.user?.firstName && o.user?.lastName ? `${o.user.firstName} ${o.user.lastName}` : (o.user?.email ?? 'Unknown')
    })),
    welcomeWienerRevenue,
    ordersByType,
    adoptionFeeHeatmap,
    totalAdoptionFees: totalAdoptionFeesResult,
    adoptionFeesThisMonth: adoptionFeesThisMonthResult,
    liveRevenue: sumAmount(allOrders)
  }
}
