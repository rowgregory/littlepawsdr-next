import { useEffect } from 'react'
import { useSession } from 'next-auth/react'

export function useDefaultCard(savedCards: any[], setSelectedCardId: (id: string) => void) {
  const session = useSession()

  useEffect(() => {
    if (session?.status !== 'authenticated') return
    const defaultCard = savedCards?.find((c) => c.isDefault)
    if (defaultCard) setSelectedCardId(defaultCard.stripePaymentId)
  }, [savedCards, session?.status, setSelectedCardId])
}
