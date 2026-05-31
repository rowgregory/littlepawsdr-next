import DachshundsClient from 'app/components/pages/DachshundsClient'
import { getDachshundsByStatus } from 'app/lib/actions/rescue-groups/getDachshundsByStatus'

export default async function DachshundsPage() {
  const data = await getDachshundsByStatus({ status: 'Available', pageLimit: 250, currentPage: 1 })
  return <DachshundsClient data={data} />
}
