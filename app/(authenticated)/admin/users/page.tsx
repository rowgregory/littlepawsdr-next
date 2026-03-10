import AdminUsersClient from 'app/components/pages/AdminUsersClient'
import getUsers from 'app/lib/actions/getUsers'

export default async function AdminUsersPage() {
  const data = await getUsers()
  return <AdminUsersClient users={data} />
}
