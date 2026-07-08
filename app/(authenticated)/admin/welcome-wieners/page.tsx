import AdminWelcomeWienersClient from 'app/(authenticated)/admin/welcome-wieners/AdminWelcomeWienersClient'
import { getWelcomeWieners } from 'app/lib/actions/welcome-wiener/getWelcomeWieners'

export default async function AdminWelcomeWienersPage() {
  const result = await getWelcomeWieners()
  return <AdminWelcomeWienersClient welcomeWieners={result.success ? result.data : []} />
}
