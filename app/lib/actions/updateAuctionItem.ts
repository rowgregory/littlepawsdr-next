'use server'

import prisma from 'prisma/client'
import { createLog } from './createLog'

export const updateAuctionItem = async (id: string, data: any) => {
  try {
    if (!data.name?.trim()) return { success: false, error: 'Name is required', data: null }

    // Check auction status to restrict fields
    const auction = await prisma.auction.findFirst({
      where: { items: { some: { id } } },
      select: { status: true }
    })

    const isActive = auction?.status === 'ACTIVE'

    await prisma.auctionItem.update({
      where: { id },
      data: isActive
        ? {
            // Active auction — only name, description allowed
            name: data.name.trim(),
            description: data.description?.trim() || null
          }
        : {
            // Draft — all fields
            name: data.name.trim(),
            description: data.description?.trim() || null,
            sellingFormat: data.sellingFormat,
            startingPrice: data.startingPrice ? Number(data.startingPrice) : null,
            buyNowPrice: data.buyNowPrice ? Number(data.buyNowPrice) : null,
            totalQuantity: data.totalQuantity ? Number(data.totalQuantity) : null,
            requiresShipping: data.requiresShipping ?? true,
            shippingCosts: data.shippingCosts ? Number(data.shippingCosts) : null,
            isAuction: data.sellingFormat === 'AUCTION',
            isFixed: data.sellingFormat === 'FIXED'
          }
    })

    // Upload and attach new photos if any
    if (data.photos?.length > 0) {
      const last = await prisma.auctionItemPhoto.findFirst({
        where: { itemId: id },
        orderBy: { sortOrder: 'desc' },
        select: { sortOrder: true }
      })

      const existingCount = await prisma.auctionItemPhoto.count({ where: { itemId: id } })

      await prisma.auctionItemPhoto.createMany({
        data: data.photos.map((url: string, i: number) => ({
          itemId: id,
          url,
          isPrimary: existingCount === 0 && i === 0,
          sortOrder: (last?.sortOrder ?? -1) + 1 + i
        }))
      })
    }

    return { success: true }
  } catch (error) {
    await createLog('error', 'Failed to update auction item', {
      id,
      auctionId: data.auctionId,
      error: error instanceof Error ? error.message : 'Unknown error'
    })
    return { success: false, error: 'Failed to update auction item', data: null }
  }
}
