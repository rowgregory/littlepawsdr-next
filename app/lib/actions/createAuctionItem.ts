'use server'

import prisma from 'prisma/client'
import { createLog } from './createLog'
import { SellingFormat } from '@prisma/client'

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
  photos?: { name: string; url: string; size: string }[]
}

export const createAuctionItem = async (data: CreateAuctionItemInput) => {
  try {
    if (!data.auctionId || !data.name?.trim() || !data.sellingFormat) {
      return {
        success: false,
        error: 'Missing required fields',
        data: null
      }
    }

    const isAuction = data.sellingFormat === 'AUCTION'
    const isFixed = data.sellingFormat === 'FIXED'

    const auctionItem = await prisma.$transaction(async (tx) => {
      // Create auction item first
      const item = await tx.auctionItem.create({
        data: {
          auctionId: data.auctionId,
          name: data.name.trim(),
          description: data.description?.trim(),
          sellingFormat: data.sellingFormat,
          startingPrice: data.startingPrice,
          buyNowPrice: data.buyNowPrice,
          totalQuantity: data.totalQuantity,
          requiresShipping: data.requiresShipping ?? true,
          shippingCosts: data.shippingCosts,
          isAuction,
          isFixed,
          currentBid: isAuction ? data.startingPrice : null,
          minimumBid: isAuction ? data.startingPrice : null,
          totalBids: isAuction ? 0 : null
        }
      })

      // Then create photos with itemId
      if (data.photos && data.photos.length > 0) {
        await tx.auctionItemPhoto.createMany({
          data: data.photos.map((photo) => ({
            itemId: item.id,
            name: photo.name,
            url: photo.url,
            size: photo.size
          }))
        })
      }

      // Return item with photos
      return tx.auctionItem.findUnique({
        where: { id: item.id },
        include: { photos: true }
      })
    })

    await createLog('info', `Auction item created successfully`, {
      auctionItemId: auctionItem.id,
      auctionId: data.auctionId,
      itemName: auctionItem.name,
      photosCount: data.photos?.length ?? 0
    })

    return {
      success: true
    }
  } catch (error) {
    await createLog('error', 'Failed to create auction item', {
      error: error instanceof Error ? error.message : 'Unknown error',
      auctionId: data.auctionId,
      itemName: data.name
    })

    return {
      success: false,
      error: 'Failed to create auction item. Please try again.',
      data: null
    }
  }
}
