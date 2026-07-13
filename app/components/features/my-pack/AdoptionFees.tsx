import { fadeUp } from 'app/lib/constants/motion.constants'
import { motion } from 'framer-motion'
import { StatusPill } from 'app/components/_primitives/StatusPill'
import { formatMoney } from 'app/utils/_currency.utils'
import { formatDate } from 'app/utils/_date.utils'
import { Dog } from 'lucide-react'
import Link from 'next/link'
import { EmptyState } from './EmptyState'

export function AdoptionFees({ adoptionFees }) {
  return (
    <motion.section
      variants={fadeUp}
      initial="hidden"
      animate="show"
      custom={3}
      aria-labelledby="adoption-fees-heading"
    >
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <span className="block w-6 h-px bg-primary-light dark:bg-primary-dark shrink-0" aria-hidden="true" />
          <h2 className="text-xs font-mono tracking-[0.2em] uppercase text-primary-light dark:text-primary-dark">
            Adoption Fees
          </h2>
        </div>
        <Link
          href="/adopt"
          className="flex items-center gap-1.5 text-[10px] font-mono tracking-widest uppercase px-3 py-1.5 border border-border-light dark:border-border-dark hover:border-primary-light dark:hover:border-primary-dark text-muted-light dark:text-muted-dark hover:text-primary-light dark:hover:text-primary-dark transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark"
        >
          <Dog className="w-3 h-3 shrink-0" aria-hidden="true" />
          Adopt
        </Link>
      </div>
      {adoptionFees?.length > 0 ? (
        <ul
          className="grid grid-cols-1 xs:grid-cols-2 gap-px bg-border-light dark:bg-border-dark border border-border-light dark:border-border-dark"
          role="list"
        >
          {adoptionFees?.map((fee) => (
            <li key={fee.id} className="bg-bg-light dark:bg-bg-dark p-4">
              <div className="flex items-start justify-between gap-3 mb-2">
                <p className="font-quicksand font-black text-sm text-text-light dark:text-text-dark">
                  {[fee.firstName, fee.lastName].filter(Boolean).join(' ') || 'Adoption Fee'}
                </p>
                <StatusPill status={fee.status} />
              </div>
              <div className="space-y-1">
                {fee.feeAmount != null && (
                  <p className="font-quicksand font-black text-lg text-primary-light dark:text-primary-dark">
                    {formatMoney(Number(fee.feeAmount))}
                  </p>
                )}
                {fee.bypassCode && (
                  <p className="text-[10px] font-mono text-muted-light dark:text-muted-dark flex items-center">
                    Bypass code used:
                    <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </p>
                )}
                {fee.expiresAt && (
                  <p className="text-[10px] font-mono text-muted-light dark:text-muted-dark">
                    Expires {formatDate(fee.expiresAt)}
                  </p>
                )}
                <p className="text-[10px] font-mono text-muted-light dark:text-muted-dark">
                  Created {formatDate(fee.createdAt)}
                </p>
                {fee.status === 'ACTIVE' && (
                  <p className="mt-1 text-[10px] font-mono text-muted-light dark:text-muted-dark leading-relaxed">
                    You have an active application window. Note: the application must be completed in one sitting —
                    progress cannot be saved.{' '}
                    <Link
                      href="/adopt/application"
                      className="text-primary-light dark:text-primary-dark hover:text-secondary-light dark:hover:text-secondary-dark transition-colors focus-visible:outline-none underline"
                    >
                      Begin application →
                    </Link>
                  </p>
                )}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState message="No adoption fees on file." />
      )}
    </motion.section>
  )
}
