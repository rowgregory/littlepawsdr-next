import { getAuctionItemById } from 'app/lib/actions/auction/getAuctionItemById'
import { getUserAddress } from 'app/lib/actions/user/getUserAddress'
import { getUserName } from 'app/lib/actions/user/getUserName'
import { IAuctionItem } from 'types/entities/auction-item'
import PublicAuctionInstantBuyClient from './PublicAuctionInstantBuyClient'
import { getSavedPaymentMethods } from 'app/lib/actions/_stripe/getSavedPaymentMethods'
import { auth } from 'app/lib/auth'

export const dynamic = 'force-dynamic'

export default async function PublicAuctionInstantBuyPage({ params }: { params: Promise<{ auctionItemId: string }> }) {
  const { auctionItemId } = await params
  const session = await auth()
  const isAuthed = !!session?.user?.id

  // The auction item is public — always fetch it.
  // User cards/name/address are private — only fetch when signed in.
  const [itemResult, cardsResult, userNameResult, userAddressResult] = await Promise.all([
    getAuctionItemById(auctionItemId).catch(() => ({ auctionItem: null })),
    isAuthed
      ? getSavedPaymentMethods().catch(() => ({ success: false, data: [] }))
      : Promise.resolve({ success: true, data: [] }),
    isAuthed
      ? getUserName().catch(() => ({ success: false, data: null }))
      : Promise.resolve({ success: true, data: null }),
    isAuthed
      ? getUserAddress().catch(() => ({ success: false, data: null }))
      : Promise.resolve({ success: true, data: null })
  ])

  return (
    <PublicAuctionInstantBuyClient
      auctionItem={itemResult.auctionItem as unknown as IAuctionItem}
      savedCards={cardsResult.success ? (cardsResult.data ?? []) : []}
      isAuthed={isAuthed}
      userId={session.user.id}
      userEmail={session.user.email}
      userName={userNameResult.data}
      userAddress={userAddressResult.data}
    />
  )
}
