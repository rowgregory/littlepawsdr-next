import prisma from 'prisma/client'
import { auth } from '../auth'
import { createLog } from './createLog'

export const getAccountData = async () => {
  try {
    const session = await auth()
    if (!session?.user?.id) return { success: false, error: 'Unauthorized', data: null }

    const [user, orders, auctionBids, paymentMethods, adoptionFees] = await Promise.all([
      prisma.user.findUnique({
        where: { id: session.user.id },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          phone: true,
          anonymousBidding: true,
          address: true,
          createdAt: true
        }
      }),
      prisma.order.findMany({
        where: { userId: session.user.id },
        include: { items: true, user: true },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.auctionBid.findMany({
        where: { userId: session.user.id },
        include: {
          auctionItem: {
            include: {
              photos: {
                orderBy: [{ isPrimary: 'desc' }, { sortOrder: 'asc' }],
                take: 1
              },
              winningBidder: {
                select: { userId: true, id: true, winningBidPaymentStatus: true, paidOn: true }
              }
            }
          },
          auction: {
            select: { id: true, title: true, status: true, endDate: true, customAuctionLink: true }
          }
        },
        orderBy: { createdAt: 'desc' },
        distinct: ['auctionItemId']
      }),
      prisma.paymentMethod.findMany({
        where: { userId: session.user.id },
        orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }]
      }),
      prisma.adoptionFee.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: 'desc' }
      })
    ])

    if (!user) return { success: false, error: 'User not found', data: null }

    const donations = orders
      .filter((o) => o.type === 'ONE_TIME_DONATION')
      .map((o) => ({
        id: o.id,
        amount: Number(o.totalAmount),
        createdAt: o.createdAt,
        status: o.status
      }))

    const subscriptions = orders
      .filter((o) => o.type === 'RECURRING_DONATION')
      .map((o) => ({
        id: o.id,
        tierName: o.items[0]?.itemName ?? 'Recurring Donation',
        amount: Number(o.totalAmount),
        interval: o.recurringFrequency ?? 'month',
        status: o.status,
        nextBillingDate: o.nextBillingDate
      }))

    const merchAndWWOrders = orders
      .filter((o) => o.type === 'PRODUCT' || o.type === 'WELCOME_WIENER' || o.type === 'MIXED')
      .map((o) => ({
        id: o.id,
        type: o.type,
        totalAmount: Number(o.totalAmount),
        createdAt: o.createdAt,
        status: o.status,
        shippingStatus: o.shippingStatus ?? null,
        customerName: o.customerName ?? null,
        items: o.items.map((item) => ({
          id: item.id,
          name: item.itemName ?? 'Item',
          image: item.itemImage ?? null,
          price: Number(item.price),
          quantity: item.quantity ?? 1,
          isPhysical: item.isPhysical
        })),
        shippingAddress: o.addressLine1
          ? {
              addressLine1: o.addressLine1,
              addressLine2: o.addressLine2 ?? null,
              city: o.city ?? null,
              state: o.state ?? null,
              zipPostalCode: o.zipPostalCode ?? null
            }
          : null
      }))

    const auctionParticipation = Object.values(
      auctionBids.reduce<
        Record<
          string,
          {
            auctionId: string
            auctionTitle: string
            auctionStatus: string
            auctionEndDate: Date | null
            customAuctionLink: string | null
            winningBidderPaymentLink: string
            winningBidPaymentStatus: string
            totalBids: number
            paidOn: Date
            bids: {
              id: string
              itemName: string
              itemImage: string | null
              bidAmount: number
              isWinner: boolean
            }[]
          }
        >
      >((acc, bid) => {
        const auctionId = bid.auction.id

        if (!acc[auctionId]) {
          acc[auctionId] = {
            auctionId,
            auctionTitle: bid.auction.title,
            auctionStatus: bid.auction.status.toLowerCase(),
            auctionEndDate: bid.auction.endDate,
            customAuctionLink: bid.auction.customAuctionLink,
            winningBidderPaymentLink:
              bid.auctionItem.winningBidder?.userId === session.user.id ? `/auctions/winner/${bid.auctionItem.winningBidder.id}` : null,
            winningBidPaymentStatus:
              bid.auctionItem.winningBidder?.userId === session.user.id
                ? bid.auctionItem.winningBidder.winningBidPaymentStatus // need to select this too
                : null,
            totalBids: 0,
            bids: [],
            paidOn: new Date()
          }
        }

        acc[auctionId].paidOn = bid.auctionItem.winningBidder.paidOn
        acc[auctionId].totalBids += 1
        acc[auctionId].bids.push({
          id: bid.id,
          itemName: bid.auctionItem.name,
          itemImage: bid.auctionItem.photos[0]?.url ?? null,
          bidAmount: Number(bid.bidAmount),
          isWinner: bid.auctionItem.winningBidder?.userId === session.user.id
        })

        return acc
      }, {})
    )

    return {
      success: true,
      data: {
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
          anonymousBidding: user.anonymousBidding,
          address: user.address,
          memberSince: user.createdAt,
          image: null
        },
        donations,
        subscriptions,
        merchAndWWOrders,
        auctionParticipation,
        paymentMethods,
        adoptionFees: adoptionFees.map((fee) => ({
          id: fee.id,
          firstName: fee.firstName,
          lastName: fee.lastName,
          feeAmount: fee.feeAmount ? Number(fee.feeAmount) : null,
          status: fee.status,
          expiresAt: fee.expiresAt,
          createdAt: fee.createdAt,
          bypassCode: fee.bypassCode
        }))
      }
    }
  } catch (error) {
    await createLog('error', 'Failed to fetch account data', {
      error: error instanceof Error ? error.message : 'Unknown error'
    })
    return { success: false, error: 'Failed to fetch account data', data: null }
  }
}
