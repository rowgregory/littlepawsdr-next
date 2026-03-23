import PublicWelcomeWienerClient from 'app/components/pages/PublicWelcomeWienerClient'
import { getWelcomeWienerById } from 'app/lib/actions/getWelcomeWIenerById'

export default async function PublicWelcomeWienerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const result = await getWelcomeWienerById(id)
  return <PublicWelcomeWienerClient welcomeWiener={result?.data} />
}
