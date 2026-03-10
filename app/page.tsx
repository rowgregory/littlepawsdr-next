import { HomeClient } from './components/pages/HomeClient'
import { getDachshundsByStatus } from './lib/actions/getDachshundsByStatus'
import { getWelcomeWieners } from './lib/actions/getWelcomeWieners'

export default async function HomePage() {
  const dachshunds = await getDachshundsByStatus({ status: 'Available', pageLimit: 250, currentPage: 1 })
  const welcomeWieners = await getWelcomeWieners()
  const data = {
    dachshunds,
    welcomeWieners
  }

  console.log('HOME PAGE: ', data)
  return <HomeClient data={data} />
}
