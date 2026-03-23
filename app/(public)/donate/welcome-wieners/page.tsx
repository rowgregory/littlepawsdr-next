import { PublicWelcomeWienersClient } from 'app/components/pages/PublicWelcomeWienersClient'
import { getLiveWelcomeWieners } from 'app/lib/actions/getLiveWelcomeWieners'

export default async function PublicWelcomeWienersPage() {
  const result = await getLiveWelcomeWieners()
  return <PublicWelcomeWienersClient welcomeWieners={result.data} />
}
