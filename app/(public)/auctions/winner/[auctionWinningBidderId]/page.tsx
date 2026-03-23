import AuctionWinnerPaymentClient from 'app/components/pages/AuctionWinnerPaymentClient'
import { getAuctionWinningBidderById } from 'app/lib/actions/getAuctionWinningBidderById'
import { getSavedPaymentMethods } from 'app/lib/actions/getSavedPaymentMethods'

export default async function AuctionWinnerPaymentPage({ params }: { params: Promise<{ auctionWinningBidderId: string }> }) {
  const { auctionWinningBidderId } = await params
  const result = await getAuctionWinningBidderById(auctionWinningBidderId)
  const paymentMethodsResult = await getSavedPaymentMethods()

  return <AuctionWinnerPaymentClient winningBidder={result?.data} savedCards={paymentMethodsResult.data} />
}
