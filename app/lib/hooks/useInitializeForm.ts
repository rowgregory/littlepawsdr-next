import { useEffect } from 'react'
import { IAddress } from 'types/entities/address'

export function useInitializeForm(
  setForm: (data: any) => void,
  {
    session,
    savedCards,
    userName,
    userAddress
  }: {
    session: any
    savedCards: any[]
    userName: { firstName?: string; lastName?: string } | null
    userAddress?: IAddress
  }
) {
  useEffect(() => {
    if (!session.data?.user?.email) return

    setForm({
      email: session.data.user.email,
      useNewCard: savedCards?.length === 0,
      selectedCardId: savedCards?.find((c) => c.isDefault)?.stripePaymentId ?? null,
      coverFees: true,
      ...userName,
      ...userAddress
    })
  }, [savedCards, session.data?.user?.email, setForm, userAddress, userName])
}
