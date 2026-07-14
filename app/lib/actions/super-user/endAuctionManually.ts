'use server'

import { createLog } from 'app/lib/actions/log/createLog'
import { endAuctionCore } from 'app/api/cron/end-auction/route'
import { requireSuper, SuperFailure } from '../auth/requireSuper'

export async function endAuctionManually(auctionId: string) {
  const gate = await requireSuper()
  if (gate.ok === false) return { success: false, error: (gate as SuperFailure).error }

  await createLog('info', 'Auction ended manually', { auctionId, by: gate.userId })
  return endAuctionCore(auctionId)
}
