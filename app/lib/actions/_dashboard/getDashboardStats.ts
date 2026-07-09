import {
  HISTORICAL_ADOPTION_FEES,
  HISTORICAL_AUCTIONS,
  HISTORICAL_BY_TYPE,
  HISTORICAL_ONE_TIME_DONATIONS,
  HISTORICAL_ORDERS
} from 'app/lib/constants/dashboard.constants'
import prisma from 'prisma/client'
import { requireAdmin } from '../user/requireAdmin'

export async function getDashboardStats() {
  const gate = await requireAdmin()
  if (gate.ok === false) {
    return { success: false, error: gate.error, data: null }
  }

  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59)

  // Build last 6 months labels + date ranges
  const months = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1)
    return {
      label: d.toLocaleDateString('en-US', { month: 'short' }),
      start: d,
      end: new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59)
    }
  })

  // Last 16 weeks of AdoptionFee records grouped by day (workflow tracking, not revenue)
  const sixteenWeeksAgo = new Date()
  sixteenWeeksAgo.setDate(sixteenWeeksAgo.getDate() - 112)

  const [
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
    adoptionFeeRecords
  ] = await Promise.all([
    prisma.order
      .findMany({ where: { status: 'CONFIRMED' }, select: { totalAmount: true, createdAt: true } })
      .catch(() => []),
    prisma.order
      .findMany({
        where: { status: 'CONFIRMED', createdAt: { gte: startOfMonth } },
        select: { totalAmount: true }
      })
      .catch(() => []),
    prisma.order
      .findMany({
        where: { status: 'CONFIRMED', createdAt: { gte: startOfLastMonth, lte: endOfLastMonth } },
        select: { totalAmount: true }
      })
      .catch(() => []),
    prisma.auction.count({ where: { status: 'ACTIVE' } }).catch(() => 0),
    prisma.auctionWinningBidder
      .aggregate({ where: { winningBidPaymentStatus: 'PAID' }, _sum: { totalPrice: true } })
      .catch(() => ({ _sum: { totalPrice: null } })),
    prisma.user.count({ where: { role: 'SUPPORTER' } }).catch(() => 0),
    prisma.user.count({ where: { role: 'SUPPORTER', createdAt: { gte: startOfMonth } } }).catch(() => 0),
    prisma.order
      .findMany({
        where: { status: 'CONFIRMED' },
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
          where: { order: { status: 'CONFIRMED', type: 'WELCOME_WIENER' } },
          select: { totalPrice: true, quantity: true }
        }
      }
    }),
    // Adoption fee COUNTS (workflow metrics, not revenue)
    prisma.adoptionFee.count({ where: { status: 'ACTIVE' } }),
    prisma.adoptionFee.count({
      where: {
        status: 'ACTIVE',
        createdAt: { gte: new Date(now.getFullYear(), now.getMonth(), 1) }
      }
    }),
    prisma.adoptionFee.findMany({
      where: { createdAt: { gte: sixteenWeeksAgo }, status: 'ACTIVE' },
      select: { createdAt: true, feeAmount: true }
    })
  ])

  // Revenue by type — orders are the single source of truth (adoption fees,
  // products, auctions, donations all create orders when paid).
  const ordersByTypeRaw = await prisma.order.groupBy({
    by: ['type'],
    where: { status: 'CONFIRMED' },
    _count: { id: true },
    _sum: { totalAmount: true },
    orderBy: { _sum: { totalAmount: 'desc' } }
  })

  const ordersByType = ordersByTypeRaw.map((row) => ({
    type: row.type,
    count: row._count.id,
    total: Number(row._sum.totalAmount ?? 0)
  }))

  // Fold each historical bucket into its matching card (or create the card)
  for (const h of HISTORICAL_BY_TYPE) {
    if (h.total <= 0) continue
    const existing = ordersByType.find((o) => o.type === h.type)
    if (existing) {
      existing.total += h.total
      existing.count += h.count
    } else {
      ordersByType.push({ type: h.type, total: h.total, count: h.count })
    }
  }

  // Re-sort so the card lands in the right position by revenue
  ordersByType.sort((a, b) => b.total - a.total)

  // Adoption fee heatmap — count of applications per day (workflow tracking)
  const heatmapMap = new Map<string, { count: number; amount: number }>()
  for (const fee of adoptionFeeRecords) {
    const key = fee.createdAt.toISOString().slice(0, 10)
    const existing = heatmapMap.get(key) ?? { count: 0, amount: 0 }
    heatmapMap.set(key, {
      count: existing.count + 1,
      amount: existing.amount + Number(fee.feeAmount ?? 15)
    })
  }

  const adoptionFeeHeatmap = Array.from(heatmapMap.entries()).map(([date, { count, amount }]) => ({
    date,
    count,
    amount
  }))

  const welcomeWienerRevenue = wieners.map((w) => ({
    id: w.id,
    name: w.name ?? 'Unnamed',
    totalRaised: w.orderItems.reduce((sum, item) => sum + Number(item.totalPrice ?? 0), 0),
    sponsorCount: w.orderItems.length
  }))

  const sumOrders = (arr: { totalAmount?: unknown }[]) => arr.reduce((acc, r) => acc + Number(r.totalAmount ?? 0), 0)

  const HISTORICAL_TOTAL =
    HISTORICAL_ADOPTION_FEES + HISTORICAL_AUCTIONS + HISTORICAL_ORDERS + HISTORICAL_ONE_TIME_DONATIONS

  const totalRevenue = sumOrders(allOrders) + HISTORICAL_TOTAL

  const thisMonthRevenue = sumOrders(thisMonthOrders)
  const lastMonthRevenue = sumOrders(lastMonthOrders)
  const auctionRevenue = Number(totalAuctionRevenue._sum?.totalPrice ?? 0)

  // Adoption revenue as a derived slice of orders (for display only, already in totalRevenue)
  const totalAdoptionRevenue =
    ordersByType.find((o) => o.type === 'ADOPTION_FEE')?.total ?? 0 + HISTORICAL_ADOPTION_FEES

  const monthlyChange = lastMonthRevenue === 0 ? null : ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100

  // Monthly chart data — orders only (adoption fees are already orders)
  const monthlyData = await Promise.all(
    months.map(async (m) => {
      const orders = await prisma.order
        .findMany({
          where: { status: 'CONFIRMED', createdAt: { gte: m.start, lte: m.end } },
          select: { totalAmount: true }
        })
        .catch(() => [])
      return {
        label: m.label,
        total: sumOrders(orders)
      }
    })
  )

  return {
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
    adoptionFeesThisMonth: adoptionFeesThisMonthResult
  }
}
