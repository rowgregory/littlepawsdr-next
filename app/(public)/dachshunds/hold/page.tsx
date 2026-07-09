import { getDachshundsByStatus } from 'app/lib/actions/_rescue-groups/getDachshundsByStatus'
import IncomingDachshundsClient from './IncomingDachshundsClient'

export default async function IncomingDachshundsPage() {
  const data = await getDachshundsByStatus({ status: 'Hold', pageLimit: 250, currentPage: 1 })
  return <IncomingDachshundsClient data={data} />
}
