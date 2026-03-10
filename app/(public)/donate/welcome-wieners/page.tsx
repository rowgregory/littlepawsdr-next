import WelcomeWienersClient from 'app/components/pages/WelcomeWienersClient'

export default async function WelcomeWienersPage() {
  const data = []
  return <WelcomeWienersClient dogs={data} />
}
