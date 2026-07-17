import { notFound } from 'next/navigation'
import AdminUserDetailsClient from './AdminUserDetailsClient'
import { getUserById } from 'app/lib/actions/admin/user/getUserById'
import { checkMigrationStatus } from 'app/lib/actions/admin/user/checkMigrationStatus'

export const dynamic = 'force-dynamic'

export default async function AdminUserDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const result = await getUserById(id)

  if (!result.success || !result.data) {
    notFound()
  }

  const migrationResult = result.data.email ? await checkMigrationStatus(result.data.email) : null

  return (
    <AdminUserDetailsClient
      user={result.data}
      migrationStatus={migrationResult?.success ? migrationResult.data : null}
    />
  )
}
