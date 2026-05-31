import PublicAuctionInstantBuyClient from 'app/components/pages/PublicAuctionInstantBuyClient'
import { getAuctionItemById } from 'app/lib/actions/auction/getAuctionItemById'
import { getSavedPaymentMethods } from 'app/lib/actions/stripe/getSavedPaymentMethods'
import { getUserAddress } from 'app/lib/actions/user/getUserAddress'
import { getUserName } from 'app/lib/actions/user/getUserName'
import { IAuctionItem } from 'types/entities/auction-item'

export default async function PublicAuctionInstantBuyPage({ params }: { params: Promise<{ auctionItemId: string }> }) {
  const { auctionItemId } = await params

  const [itemResult, cardsResult, userNameResult, userAddressResult] = await Promise.all([
    getAuctionItemById(auctionItemId),
    getSavedPaymentMethods(),
    getUserName(),
    getUserAddress()
  ])

  return (
    <PublicAuctionInstantBuyClient
      auctionItem={itemResult.auctionItem as unknown as IAuctionItem}
      savedCards={cardsResult.success ? (cardsResult.data ?? []) : []}
      initialFormData={{
        firstName: userNameResult.data?.firstName ?? '',
        lastName: userNameResult.data?.lastName ?? '',
        addressLine1: userAddressResult.data?.addressLine1 ?? '',
        addressLine2: userAddressResult.data?.addressLine2 ?? '',
        city: userAddressResult.data?.city ?? '',
        state: userAddressResult.data?.state ?? '',
        zipPostalCode: userAddressResult.data?.zipPostalCode ?? '',
        coverFees: true
      }}
    />
  )
}
