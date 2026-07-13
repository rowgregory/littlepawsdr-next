import { fadeUp } from 'app/lib/constants/motion.constants'
import { motion } from 'framer-motion'
import { Repeat } from 'lucide-react'
import Link from 'next/link'
import { EmptyState } from './EmptyState'
import { StatusPill } from 'app/components/_primitives/StatusPill'
import { formatMoney } from 'app/utils/_currency.utils'
import { formatDate } from 'app/utils/_date.utils'

export function Subscriptions({ subscriptions }) {
  return (
    <motion.section
      variants={fadeUp}
      initial="hidden"
      animate="show"
      custom={4}
      aria-labelledby="subscriptions-heading"
    >
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <span className="block w-6 h-px bg-primary-light dark:bg-primary-dark shrink-0" aria-hidden="true" />
          <h2 className="text-xs font-mono tracking-[0.2em] uppercase text-primary-light dark:text-primary-dark">
            Subscriptions
          </h2>
        </div>
        <Link
          href="/subscriptions"
          className="flex items-center gap-1.5 text-[10px] font-mono tracking-widest uppercase px-3 py-1.5 border border-border-light dark:border-border-dark hover:border-primary-light dark:hover:border-primary-dark text-muted-light dark:text-muted-dark hover:text-primary-light dark:hover:text-primary-dark transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark"
        >
          <Repeat className="w-3 h-3 shrink-0" aria-hidden="true" />
          Subscribe
        </Link>
      </div>
      {subscriptions?.length === 0 ? (
        <EmptyState message="No active subscriptions." />
      ) : (
        <ul
          className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-border-light dark:bg-border-dark border border-border-light dark:border-border-dark"
          role="list"
        >
          {subscriptions.map((sub) => {
            const isCancelled = sub.status === 'CANCELLED'
            return (
              <li key={sub.id} className={`bg-bg-light dark:bg-bg-dark p-5 ${isCancelled ? 'opacity-60' : ''}`}>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="min-w-0">
                    <p className="font-quicksand font-black text-base text-text-light dark:text-text-dark leading-snug truncate">
                      {sub.tierName}
                    </p>
                    {isCancelled && (
                      <p className="text-[9px] font-mono tracking-[0.15em] uppercase text-red-500 dark:text-red-400 mt-0.5">
                        Cancelled
                      </p>
                    )}
                  </div>
                  <StatusPill status={sub.status} />
                </div>

                <p
                  className={`font-quicksand font-black text-2xl ${isCancelled ? 'text-muted-light dark:text-muted-dark' : 'text-primary-light dark:text-primary-dark'}`}
                >
                  {formatMoney(sub.amount)}
                  <span className="text-xs font-mono font-normal text-muted-light dark:text-muted-dark ml-1">
                    / {sub.interval}
                  </span>
                </p>

                {sub.nextBillingDate && sub.status === 'CONFIRMED' && (
                  <p className="text-[10px] font-mono text-muted-light dark:text-muted-dark mt-2">
                    Next billing {formatDate(sub.nextBillingDate)}
                  </p>
                )}

                {sub.nextBillingDate && isCancelled && (
                  <p className="text-[10px] font-mono text-red-500/70 dark:text-red-400/70 mt-2">
                    Active until {formatDate(sub.nextBillingDate)}
                  </p>
                )}

                <div className="mt-3 pt-3 border-t border-border-light dark:border-border-dark">
                  <Link
                    href={` /my-pack/subscription/${sub.id}`}
                    aria-label={`View details for ${sub.tierName} subscription`}
                    className="text-[10px] font-mono tracking-[0.2em] uppercase text-muted-light dark:text-muted-dark hover:text-primary-light dark:hover:text-primary-dark transition-colors focus:outline-none focus-visible:underline"
                  >
                    View details →
                  </Link>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </motion.section>
  )
}
