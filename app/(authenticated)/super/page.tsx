import SuperDashboardClient from 'app/(authenticated)/super/SuperDashboardClient'
import { getAdminUsers } from 'app/lib/actions/super-user/getAdminUsers'
import { getAuditLogs } from 'app/lib/actions/super-user/getAuditLogs'
import { getCronJobs } from 'app/lib/actions/super-user/getCronJobs'
import { getManagedUsers } from 'app/lib/actions/super-user/getManagedUsers'
import { getPulseStats } from 'app/lib/actions/super-user/getPulseStats'
import { getServiceHealth } from 'app/lib/actions/super-user/getServiceHealth'
import { auth } from 'app/lib/auth'
import { redirect } from 'next/navigation'

export default async function SuperDashboardPage() {
  const session = await auth()
  const role = session?.user?.role

  if (role !== 'SUPER_USER') {
    redirect(role === 'PACK_MEMBER' ? '/my-pack' : '/admin/dashboard')
  }

  const [services, cronJobs, pulseStats, adminUsers, auditLogs, managedUsers] = await Promise.all([
    getServiceHealth(),
    getCronJobs(),
    getPulseStats(),
    getAdminUsers(),
    getAuditLogs(),
    getManagedUsers()
  ])

  return (
    <SuperDashboardClient
      services={services}
      cronJobs={cronJobs}
      pulseStats={pulseStats}
      adminUsers={adminUsers}
      auditLogs={auditLogs.data}
      managedUsers={managedUsers}
    />
  )
}
