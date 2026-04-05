import Link from 'next/link'
import { formatMoney } from 'app/utils/currency.utils'
import { formatDate, getDaysRemaining } from 'app/utils/date.utils'
import { Gavel, Calendar, Users, TrendingUp, ChevronRight, Clock, Package as Package2 } from 'lucide-react'
import { IAuction } from 'types/entities/auction'
import { motion } from 'framer-motion'
import { getAuctionStatusConfig } from 'app/utils/getAuctionStatusConfig'

function getProgressPct(revenue: number, goal: number) {
  if (!goal) return 0
  return Math.min(100, Math.round((revenue / goal) * 100))
}

export function AdminAuctionCard({ auction, index }: { auction: IAuction; index: number }) {
  const statusConfig = getAuctionStatusConfig(auction.status)
  const pct = getProgressPct(Number(auction.totalAuctionRevenue), Number(auction.goal))
  const daysLeft = getDaysRemaining(auction.endDate)
  const isActive = auction.status === 'ACTIVE'

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.06, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <Link
        href={`/admin/auctions/${auction.id}`}
        className="group block border border-border-light dark:border-border-dark bg-bg-light dark:bg-bg-dark hover:border-primary-light/50 dark:hover:border-primary-dark/50 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark"
        aria-label={`Open ${auction.title} auction`}
      >
        {/* Card header */}
        <div className="px-5 py-4 border-b border-border-light dark:border-border-dark flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1.5">
              <span className={`text-[9px] font-black tracking-widest uppercase px-2 py-0.5 ${statusConfig.classes}`}>{statusConfig.label}</span>
              {isActive && daysLeft > 0 && (
                <span className="flex items-center gap-1 text-[9px] font-mono text-muted-light dark:text-muted-dark">
                  <Clock size={9} aria-hidden="true" />
                  {daysLeft}d left
                </span>
              )}
            </div>
            <h2 className="font-quicksand font-black text-base text-text-light dark:text-text-dark leading-snug truncate">{auction.title}</h2>
          </div>
          <ChevronRight
            size={16}
            className="text-muted-light dark:text-muted-dark group-hover:text-primary-light dark:group-hover:text-primary-dark group-hover:translate-x-0.5 transition-all duration-150 shrink-0 mt-1"
            aria-hidden="true"
          />
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-px bg-border-light dark:bg-border-dark border-b border-border-light dark:border-border-dark">
          {[
            { icon: Package2, label: 'Items', value: auction.items?.length ?? 0 },
            { icon: Users, label: 'Bidders', value: auction.bidders?.length ?? 0 },
            { icon: Gavel, label: 'Bids', value: auction.bids?.length ?? 0 }
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="bg-bg-light dark:bg-bg-dark px-4 py-3 flex items-center gap-2.5">
              <Icon size={13} className="text-muted-light dark:text-muted-dark shrink-0" aria-hidden="true" />
              <div>
                <p className="text-sm font-black font-mono text-text-light dark:text-text-dark leading-none">{value}</p>
                <p className="text-[9px] font-mono text-muted-light dark:text-muted-dark mt-0.5 uppercase tracking-wider">{label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Revenue + goal */}
        <div className="px-5 py-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <TrendingUp size={12} className="text-primary-light dark:text-primary-dark" aria-hidden="true" />
              <span className="text-xs font-black font-mono text-text-light dark:text-text-dark">
                {formatMoney(Number(auction.totalAuctionRevenue))}
              </span>
            </div>
            <span className="text-[10px] font-mono text-muted-light dark:text-muted-dark">
              {pct}% of {formatMoney(Number(auction.goal))} goal
            </span>
          </div>
          {/* Progress bar */}
          <div className="h-1 bg-surface-light dark:bg-surface-dark overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.7, delay: index * 0.06 + 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
              className={`h-full ${pct >= 100 ? 'bg-emerald-500' : 'bg-primary-light dark:bg-primary-dark'}`}
            />
          </div>
        </div>

        {/* Dates footer */}
        <div className="px-5 pb-4 flex items-center gap-1.5 text-[10px] font-mono text-muted-light dark:text-muted-dark">
          <Calendar size={10} aria-hidden="true" />
          {formatDate(auction.startDate)} — {formatDate(auction.endDate)}
        </div>
      </Link>
    </motion.div>
  )
}
