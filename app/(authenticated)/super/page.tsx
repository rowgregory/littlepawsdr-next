import SuperDashboardClient from 'app/components/pages/SuperDashboardClient'
import getActiveAuctionForSuperuser from 'app/lib/actions/getActiveAuctionForSuperUser'
import { getServiceHealth } from 'app/lib/actions/getServiceHealth'
import { getAdminUsers } from 'app/lib/actions/super-user/getAdminUsers'
import { getAuditLogs } from 'app/lib/actions/super-user/getAuditLogs'
import { getCronJobs } from 'app/lib/actions/super-user/getCronJobs'
import { getManagedUsers } from 'app/lib/actions/super-user/getManagedUsers'
import { getPulseStats } from 'app/lib/actions/super-user/getPulseStats'

export default async function SuperDashboardPage() {
  const [services, cronJobs, pulseStats, adminUsers, auditLogs, managedUsers, auction] = await Promise.all([
    getServiceHealth(),
    getCronJobs(),
    getPulseStats(),
    getAdminUsers(),
    getAuditLogs(),
    getManagedUsers(),
    getActiveAuctionForSuperuser() // your existing auction fetch
  ])

  return (
    <SuperDashboardClient
      services={services}
      cronJobs={cronJobs}
      pulseStats={pulseStats}
      adminUsers={adminUsers}
      auditLogs={auditLogs}
      managedUsers={managedUsers}
      auction={auction.data}
    />
  )
}
