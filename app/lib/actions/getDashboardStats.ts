import prisma from 'prisma/client'

export async function getDashboardStats() {
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

  // ─── Adoption fee heatmap ────────────────────────────────────────────────────
  // Last 16 weeks of AdoptionFee records grouped by day

  const sixteenWeeksAgo = new Date()
  sixteenWeeksAgo.setDate(sixteenWeeksAgo.getDate() - 112)

  const [
    allOrders,
    thisMonthOrders,
    lastMonthOrders,
    adoptionFees,
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
    prisma.order.findMany({ where: { status: 'CONFIRMED' }, select: { totalAmount: true, createdAt: true } }).catch(() => []),
    prisma.order.findMany({ where: { status: 'CONFIRMED', createdAt: { gte: startOfMonth } }, select: { totalAmount: true } }).catch(() => []),
    prisma.order
      .findMany({ where: { status: 'CONFIRMED', createdAt: { gte: startOfLastMonth, lte: endOfLastMonth } }, select: { totalAmount: true } })
      .catch(() => []),
    prisma.adoptionFee.findMany({ where: { status: 'ACTIVE' }, select: { feeAmount: true, createdAt: true } }).catch(() => []),
    prisma.auction.count({ where: { status: 'ACTIVE' } }).catch(() => 0),
    // Auction revenue = orders that have auctionItemId in metadata — approximate via AuctionWinningBidder paid
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
          where: {
            order: {
              status: 'CONFIRMED',
              type: 'WELCOME_WIENER'
            }
          },
          select: {
            totalPrice: true,
            quantity: true
          }
        }
      }
    }),
    prisma.adoptionFee.count({ where: { status: 'ACTIVE' } }),
    prisma.adoptionFee.count({
      where: {
        status: 'ACTIVE',
        createdAt: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
        }
      }
    }),
    prisma.adoptionFee.findMany({
      where: {
        createdAt: { gte: sixteenWeeksAgo },
        status: 'ACTIVE'
      },
      select: { createdAt: true, feeAmount: true }
    })
  ])

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

  // Group by YYYY-MM-DD
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

  const sumOrders = (arr: { totalAmount?: any }[]) => arr.reduce((acc, r) => acc + Number(r.totalAmount ?? 0), 0)
  const sumFees = (arr: { feeAmount?: any }[]) => arr.reduce((acc, r) => acc + Number(r.feeAmount ?? 0), 0)

  const totalOrderRevenue = sumOrders(allOrders)
  const totalAdoptionRevenue = sumFees(adoptionFees)
  const auctionRevenue = Number(totalAuctionRevenue._sum?.totalPrice ?? 0)
  const totalRevenue = totalOrderRevenue + totalAdoptionRevenue
  const thisMonthRevenue = sumOrders(thisMonthOrders)
  const lastMonthRevenue = sumOrders(lastMonthOrders)
  const monthlyChange = lastMonthRevenue === 0 ? null : ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100

  // Monthly chart data
  const monthlyData = await Promise.all(
    months.map(async (m) => {
      const [orders, fees] = await Promise.all([
        prisma.order
          .findMany({ where: { status: 'CONFIRMED', createdAt: { gte: m.start, lte: m.end } }, select: { totalAmount: true } })
          .catch(() => []),
        prisma.adoptionFee
          .findMany({ where: { status: 'ACTIVE', createdAt: { gte: m.start, lte: m.end } }, select: { feeAmount: true } })
          .catch(() => [])
      ])
      return {
        label: m.label,
        orders: sumOrders(orders),
        adoptions: sumFees(fees)
      }
    })
  )

  return {
    totalRevenue,
    totalOrderRevenue,
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
      name: o.user?.firstName && o.user?.lastName ? `${o.user.firstName} ${o.user.lastName}` : (o.user?.email ?? 'Unknown')
    })),
    welcomeWienerRevenue,
    ordersByType,
    adoptionFeeHeatmap,
    totalAdoptionFees: totalAdoptionFeesResult,
    adoptionFeesThisMonth: adoptionFeesThisMonthResult
  }
}
