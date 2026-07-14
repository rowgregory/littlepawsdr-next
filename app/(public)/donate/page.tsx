import PublicDonateClient from 'app/(public)/donate/PublicDonateClient'
import { getSavedPaymentMethods } from 'app/lib/actions/_stripe/getSavedPaymentMethods'
import { getUserName } from 'app/lib/actions/my-pack/getUserName'
import { auth } from 'app/lib/auth'

export default async function PublicDonatePage() {
  const session = await auth()
  const user = session?.user
  const isAuthed = !!user?.id

  const [paymentMethodsResult, userNameResult] = isAuthed
    ? await Promise.all([
        getSavedPaymentMethods().catch(() => ({ success: false, data: [] })),
        getUserName().catch(() => ({ success: false, data: null }))
      ])
    : [
        { success: true, data: [] },
        { success: true, data: null }
      ]

  return (
    <PublicDonateClient
      savedCards={paymentMethodsResult.data ?? []}
      userName={userNameResult.data ?? null}
      isAuthed={isAuthed}
      email={user?.email ?? null}
      userId={user?.id ?? null}
    />
  )
}
