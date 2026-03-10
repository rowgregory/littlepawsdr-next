import IncomingDachshundsClient from 'app/components/pages/IncomingDachshundsClient'
import { getDachshundsByStatus } from 'app/lib/actions/getDachshundsByStatus'

export default async function IncomingDachshundsPage() {
  const data = await getDachshundsByStatus({ status: 'Hold', pageLimit: 250, currentPage: 1 })
  return <IncomingDachshundsClient data={data} />
}
