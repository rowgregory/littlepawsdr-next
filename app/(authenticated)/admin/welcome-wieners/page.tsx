import AdminWelcomeWienersClient from 'app/components/pages/AdminWelcomeWienersClient'
import { getWelcomeWieners } from 'app/lib/actions/getWelcomeWieners'

export default async function AdminWelcomeWienersPage() {
  const result = await getWelcomeWieners()
  return <AdminWelcomeWienersClient welcomeWieners={result} />
}
