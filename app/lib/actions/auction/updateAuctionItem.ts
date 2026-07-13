'use server'

import prisma from 'prisma/client'
import { createLog } from '../log/createLog'
import { getActor } from '../user/getActor'
import { getRequestContext, RequestContext } from 'app/utils/_log.server.utils'
import { auth } from 'app/lib/auth'
import { UpdateAuctionItemInput } from 'types/_auction-item'
import { buildLogMessage } from 'app/utils/_log.client.utils'

export const updateAuctionItem = async (id: string, data: UpdateAuctionItemInput) => {
  const [actor, context] = await Promise.all([
    getActor().catch(() => 'Unknown actor'),
    getRequestContext().catch(() => ({}) as RequestContext)
  ])

  try {
    // ── Guards ──
    const session = await auth()
    if (!session?.user || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPERUSER')) {
      return { success: false, error: 'Unauthorized', data: null }
    }

    if (!data.name?.trim()) return { success: false, error: 'Name is required', data: null }

    // One query: item state + parent auction status
    const item = await prisma.auctionItem.findUnique({
      where: { id },
      select: { totalBids: true, auction: { select: { status: true } } }
    })
    if (!item) return { success: false, error: 'Item not found', data: null }

    const isActive = item.auction.status === 'ACTIVE'
    const newStartingPrice = data.startingPrice != null ? Number(data.startingPrice) : null

    await prisma.auctionItem.update({
      where: { id },
      data: isActive
        ? {
            // Active auction — only name, description allowed
            name: data.name.trim(),
            description: data.description?.trim() || null
          }
        : {
            name: data.name.trim(),
            description: data.description?.trim() || null,
            sellingFormat: data.sellingFormat,
            startingPrice: newStartingPrice,
            buyNowPrice: data.buyNowPrice != null ? Number(data.buyNowPrice) : null,
            totalQuantity: data.totalQuantity ? Number(data.totalQuantity) : null,
            requiresShipping: data.requiresShipping ?? true,
            shippingCosts: data.shippingCosts != null ? Number(data.shippingCosts) : null,
            isAuction: data.sellingFormat === 'AUCTION',
            isFixed: data.sellingFormat === 'FIXED',

            // ── No bids yet → currentBid/minimumBid are still seeds; keep them synced ──
            ...(item.totalBids === 0 && newStartingPrice != null
              ? { currentBid: newStartingPrice, minimumBid: newStartingPrice }
              : {})
          }
    })

    // Append new photos (existing photos are managed via their own actions)
    if (data.photos?.length) {
      const [last, existingCount] = await Promise.all([
        prisma.auctionItemPhoto.findFirst({
          where: { itemId: id },
          orderBy: { sortOrder: 'desc' },
          select: { sortOrder: true }
        }),
        prisma.auctionItemPhoto.count({ where: { itemId: id } })
      ])

      await prisma.auctionItemPhoto.createMany({
        data: data.photos.map((url: string, i: number) => ({
          itemId: id,
          url,
          isPrimary: existingCount === 0 && i === 0,
          sortOrder: (last?.sortOrder ?? -1) + 1 + i
        }))
      })
    }

    await createLog('info', buildLogMessage(`updated auction item "${data.name.trim()}"`, actor, context), {
      auctionItemId: id,
      auctionId: data.auctionId,
      ...context
    })

    return { success: true, data: null, error: null }
  } catch (error) {
    await createLog('error', buildLogMessage('failed to update auction item', actor, context), {
      id,
      auctionId: data.auctionId,
      error: error instanceof Error ? error.message : 'Unknown error',
      ...context
    }).catch(console.error)

    return { success: false, error: 'Failed to update auction item', data: null }
  }
}
