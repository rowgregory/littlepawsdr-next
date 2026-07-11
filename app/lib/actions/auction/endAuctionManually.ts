'use server'

import { requireAdmin } from 'app/lib/actions/user/requireAdmin'
import { createLog } from 'app/lib/actions/log/createLog'
import { endAuctionCore } from 'app/api/cron/end-auction/route'

export async function endAuctionManually(auctionId: string) {
  await requireAdmin()
  await createLog('info', '[ADMIN] end-auction-manually', { auctionId })
  return endAuctionCore(auctionId)
}
