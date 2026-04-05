import { formatDateTime, getDaysRemaining } from 'app/utils/date.utils'
import { IAuction } from 'types/entities/auction'
import { AdminAuctionStatCard } from './AdminAuctionStatCard'
import { formatMoney } from 'app/utils/currency.utils'
import { Clock, DollarSign, Gavel, Package, Users } from 'lucide-react'
import { motion } from 'framer-motion'
import Picture from '../common/Picture'

export function AdminAuctionOverviewTab({ auction }: { auction: IAuction }) {
  const pct = auction.goal > 0 ? Math.min(100, Math.round((auction.totalAuctionRevenue / auction.goal) * 100)) : 0
  const daysLeft = getDaysRemaining(auction.endDate)

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-border-light dark:bg-border-dark border border-border-light dark:border-border-dark">
        <AdminAuctionStatCard
          label="Revenue"
          value={formatMoney(auction.totalAuctionRevenue)}
          icon={DollarSign}
          iconColor="text-primary-light dark:text-primary-dark"
          iconBg="bg-primary-light/10 dark:bg-primary-dark/10"
          delay={0}
        />
        <AdminAuctionStatCard
          label="Items"
          value={String(auction.items.length)}
          icon={Package}
          iconColor="text-violet-500"
          iconBg="bg-violet-500/10"
          delay={0.06}
        />
        <AdminAuctionStatCard
          label="Bidders"
          value={String(auction.bidders.length)}
          icon={Users}
          iconColor="text-pink-500"
          iconBg="bg-pink-500/10"
          delay={0.12}
        />
        <AdminAuctionStatCard
          label="Total Bids"
          value={String(auction.bids.length)}
          icon={Gavel}
          iconColor="text-amber-500"
          iconBg="bg-amber-500/10"
          delay={0.18}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Goal progress */}
        <div className="border border-border-light dark:border-border-dark">
          <div className="px-5 py-4 border-b border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark">
            <div className="flex items-center gap-3">
              <span className="block w-4 h-px bg-primary-light dark:bg-primary-dark" aria-hidden="true" />
              <h2 className="text-[10px] font-mono tracking-[0.2em] uppercase text-primary-light dark:text-primary-dark">Goal Progress</h2>
            </div>
          </div>
          <div className="p-5 space-y-4">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-3xl font-black font-quicksand text-text-light dark:text-text-dark">{formatMoney(auction.totalAuctionRevenue)}</p>
                <p className="text-xs font-mono text-muted-light dark:text-muted-dark mt-1">of {formatMoney(auction.goal)} goal</p>
              </div>
              <p className="text-2xl font-black font-mono text-primary-light dark:text-primary-dark">{pct}%</p>
            </div>
            <div className="h-2 bg-surface-light dark:bg-surface-dark overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
                className={`h-full ${pct >= 100 ? 'bg-emerald-500' : 'bg-primary-light dark:bg-primary-dark'}`}
              />
            </div>
            <div className="grid grid-cols-2 gap-px bg-border-light dark:bg-border-dark border border-border-light dark:border-border-dark">
              <div className="bg-bg-light dark:bg-bg-dark px-4 py-3">
                <p className="text-[9px] font-mono tracking-widest uppercase text-muted-light dark:text-muted-dark mb-1">Start</p>
                <p className="text-xs font-mono text-text-light dark:text-text-dark">{formatDateTime(auction.startDate)}</p>
              </div>
              <div className="bg-bg-light dark:bg-bg-dark px-4 py-3">
                <p className="text-[9px] font-mono tracking-widest uppercase text-muted-light dark:text-muted-dark mb-1">End</p>
                <p className="text-xs font-mono text-text-light dark:text-text-dark">{formatDateTime(auction.endDate)}</p>
              </div>
            </div>
            {auction.status === 'ACTIVE' && daysLeft > 0 && (
              <div className="flex items-center gap-2 text-xs font-mono text-amber-500">
                <Clock size={12} aria-hidden="true" />
                {daysLeft} day{daysLeft !== 1 ? 's' : ''} remaining
              </div>
            )}
          </div>
        </div>

        {/* Top items */}
        <div className="border border-border-light dark:border-border-dark">
          <div className="px-5 py-4 border-b border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark">
            <div className="flex items-center gap-3">
              <span className="block w-4 h-px bg-primary-light dark:bg-primary-dark" aria-hidden="true" />
              <h2 className="text-[10px] font-mono tracking-[0.2em] uppercase text-primary-light dark:text-primary-dark">Top Items by Bids</h2>
            </div>
          </div>
          <div className="divide-y divide-border-light dark:divide-border-dark">
            {auction.items.length > 0 ? (
              [...auction.items]
                .sort((a, b) => b.totalBids - a.totalBids)
                .slice(0, 5)
                .map((item, i) => (
                  <div
                    key={item.id}
                    className="px-5 py-3.5 flex items-center gap-3 hover:bg-surface-light dark:hover:bg-surface-dark transition-colors"
                  >
                    <span className="text-[10px] font-mono text-muted-light dark:text-muted-dark w-4 shrink-0">{i + 1}</span>
                    {item.photos[0] ? (
                      <Picture
                        priority={false}
                        src={item.photos[0].url}
                        alt={item.name}
                        className="w-8 h-8 object-cover border border-border-light dark:border-border-dark shrink-0"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark flex items-center justify-center shrink-0">
                        <Package size={12} className="text-muted-light dark:text-muted-dark" aria-hidden="true" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-text-light dark:text-text-dark truncate">{item.name}</p>
                      <p className="text-[10px] font-mono text-muted-light dark:text-muted-dark">{item.totalBids} bids</p>
                    </div>
                    <p className="text-xs font-black font-mono text-text-light dark:text-text-dark shrink-0">
                      {formatMoney(item.highestBidAmount ?? item.currentBid)}
                    </p>
                  </div>
                ))
            ) : (
              <div className="px-5 py-12 text-center">
                <p className="text-xs font-mono text-muted-light dark:text-muted-dark">No items yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
