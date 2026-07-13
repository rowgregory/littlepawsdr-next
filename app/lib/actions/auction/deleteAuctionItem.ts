'use server'

import prisma from 'prisma/client'
import { getActor } from '../user/getActor'
import { getRequestContext } from 'app/utils/_log.server.utils'
import { auth } from 'app/lib/auth'
import { createLog } from '../log/createLog'
import { buildLogMessage } from 'app/utils/_log.client.utils'

export const deleteAuctionItem = async (id: string, auctionId: string) => {
  const [actor, context] = await Promise.all([getActor().catch(() => 'Unknown actor'), getRequestContext()])

  try {
    const session = await auth()
    if (!session?.user || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPERUSER')) {
      return { success: false, error: 'Unauthorized', data: null }
    }

    const item = await prisma.auctionItem.findUnique({
      where: { id },
      select: { name: true, totalBids: true, auction: { select: { status: true } } }
    })
    if (!item) return { success: false, error: 'Item not found', data: null }

    if (item.auction.status === 'ACTIVE') {
      return { success: false, error: 'Items cannot be deleted while the auction is live', data: null }
    }

    await prisma.auctionItem.delete({ where: { id } })

    await createLog('info', buildLogMessage(`deleted auction item "${item.name}"`, actor, context), {
      auctionItemId: id,
      auctionId,
      name: item.name,
      totalBids: item.totalBids,
      ...context
    })

    return { success: true, data: null, error: null }
  } catch (error) {
    await createLog('error', buildLogMessage('failed to delete auction item', actor, context), {
      id,
      auctionId,
      error: error instanceof Error ? error.message : 'Unknown error',
      ...context
    }).catch(console.error)

    return { success: false, error: 'Failed to delete auction item', data: null }
  }
}
