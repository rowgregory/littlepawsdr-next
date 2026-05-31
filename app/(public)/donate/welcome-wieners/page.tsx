import { PublicWelcomeWienersClient } from 'app/components/pages/PublicWelcomeWienersClient'
import { getLiveWelcomeWieners } from 'app/lib/actions/welcome-wiener/getLiveWelcomeWieners'

export default async function PublicWelcomeWienersPage() {
  const result = await getLiveWelcomeWieners()
  return <PublicWelcomeWienersClient welcomeWieners={result.data} />
}
