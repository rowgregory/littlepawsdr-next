import { useEffect } from 'react'

export function useInitializeForm(
  setForm: (data: any) => void,
  {
    session,
    savedCards,
    userName
  }: {
    session: any
    savedCards: any[]
    userName: { firstName?: string; lastName?: string } | null
  }
) {
  useEffect(() => {
    if (!session.data?.user?.email) return

    setForm({
      email: session.data.user.email,
      useNewCard: savedCards?.length === 0,
      selectedCardId: savedCards?.find((c) => c.isDefault)?.stripePaymentId ?? null,
      coverFees: true,
      firstName: userName?.firstName ?? '',
      lastName: userName?.lastName ?? ''
    })
  }, [savedCards, savedCards?.length, session.data?.user?.email, setForm, userName?.firstName, userName?.lastName])
}
