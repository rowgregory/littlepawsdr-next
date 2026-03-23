import { HomeClient } from './components/pages/HomeClient'
import { getDachshundsByStatus } from './lib/actions/getDachshundsByStatus'
import { getLiveWelcomeWieners } from './lib/actions/getLiveWelcomeWieners'

export default async function HomePage() {
  const dachshunds = await getDachshundsByStatus({ status: 'Available', pageLimit: 250, currentPage: 1 })
  const welcomeWieners = await getLiveWelcomeWieners()

  return <HomeClient dachshunds={dachshunds} welcomeWieners={welcomeWieners} />
}
