'use server'

import prisma from 'prisma/client'
import { createLog } from '../createLog'
import { SellingFormat } from '@prisma/client'
import { auth } from '../../auth'
import { pusherSuperuser } from 'app/utils/pusherTrigger'

interface CreateAuctionItemInput {
  auctionId: string
  name: string
  description?: string
  sellingFormat: SellingFormat
  startingPrice?: number
  buyNowPrice?: number
  totalQuantity?: number
  requiresShipping?: boolean
  shippingCosts?: number
  photos?: any
}

export const createAuctionItem = async (data: CreateAuctionItemInput) => {
  try {
    if (!data.name?.trim()) return { success: false, error: 'Name is required', data: null }
    if (!data.sellingFormat) return { success: false, error: 'Selling format is required', data: null }

    const [item, session] = await Promise.all([
      prisma.auctionItem.create({
        data: {
          auctionId: data.auctionId,
          name: data.name.trim(),
          description: data.description?.trim() || null,
          sellingFormat: data.sellingFormat,
          startingPrice: data.startingPrice ? Number(data.startingPrice) : null,
          buyNowPrice: data.buyNowPrice ? Number(data.buyNowPrice) : null,
          currentPrice: data.startingPrice ? Number(data.startingPrice) : null,
          currentBid: data.startingPrice ? Number(data.startingPrice) : null,
          minimumBid: data.startingPrice ? Number(data.startingPrice) : null,
          totalQuantity: data.sellingFormat === 'FIXED' ? data.totalQuantity : 1,
          requiresShipping: data.requiresShipping ?? true,
          shippingCosts: data.shippingCosts ? Number(data.shippingCosts) : null,
          isAuction: data.sellingFormat === 'AUCTION',
          isFixed: data.sellingFormat === 'FIXED',
          photos:
            data.photos?.length > 0
              ? {
                  create: data.photos.map((url: string, i: number) => ({
                    url,
                    isPrimary: i === 0,
                    sortOrder: i
                  }))
                }
              : undefined
        }
      }),
      auth()
    ])

    const sessionUser = await prisma.user.findUnique({
      where: { id: session?.user?.id },
      select: { firstName: true, lastName: true, email: true }
    })

    const createdBy = sessionUser?.firstName
      ? `${sessionUser.firstName}${sessionUser.lastName ? ` ${sessionUser.lastName}` : ''}`
      : (sessionUser?.email ?? 'Unknown')

    await createLog('info', 'Auction item created', {
      auctionItemId: item.id,
      auctionId: data.auctionId,
      name: data.name.trim(),
      sellingFormat: data.sellingFormat,
      createdBy
    })

    await pusherSuperuser('auction-item-created', {
      auctionItemId: item.id,
      auctionId: data.auctionId,
      name: data.name.trim(),
      sellingFormat: data.sellingFormat,
      createdBy
    })

    return { success: true }
  } catch (error) {
    await createLog('error', 'Failed to create auction item', {
      auctionId: data.auctionId,
      name: data.name,
      error: error instanceof Error ? error.message : 'Unknown error'
    })
    return { success: false, error: 'Failed to create auction item', data: null }
  }
}
