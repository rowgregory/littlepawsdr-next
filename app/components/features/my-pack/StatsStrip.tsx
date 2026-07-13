import { formatMoney } from 'app/utils/_currency.utils'
import { AuctionParticipation, AuctionPurchase, MultiItemOrder, Subscription } from 'types/_my-pack.types'

type Props = {
  subscriptions: Subscription[]
  multiItemOrders: MultiItemOrder[]
  auctionParticipation: AuctionParticipation[]
  auctionPurchases: AuctionPurchase[]
  totalGiven: number
}

export function StatsStrip({
  totalGiven,
  subscriptions,
  multiItemOrders,
  auctionParticipation,
  auctionPurchases
}: Props) {
  const totalAuctions = new Set([
    ...(auctionParticipation ?? []).map((a) => a.auctionId),
    ...(auctionPurchases ?? []).map((p) => p.auctionId).filter(Boolean)
  ]).size

  return (
    <div className="grid grid-cols-2 xs:grid-cols-4 gap-px bg-border-light dark:bg-border-dark border border-border-light dark:border-border-dark">
      {[
        { label: 'Total Given', value: formatMoney(Number(totalGiven)) },
        { label: 'Subscriptions', value: String(subscriptions.filter((s) => s.status === 'CONFIRMED').length) },
        { label: 'Orders', value: String(multiItemOrders.length) },
        { label: 'Auctions', value: String(totalAuctions) }
      ].map(({ label, value }) => (
        <div key={label} className="bg-bg-light dark:bg-bg-dark px-3 py-2.5">
          <p className="text-[8px] font-mono tracking-[0.18em] uppercase text-muted-light dark:text-muted-dark mb-0.5">
            {label}
          </p>
          <p className="font-quicksand font-black text-base text-text-light dark:text-text-dark tabular-nums">
            {value}
          </p>
        </div>
      ))}
    </div>
  )
}
