import { fadeUp } from 'app/lib/constants/motion.constants'
import { SectionLabel } from './SectionLabel'
import { EmptyState } from './EmptyState'
import { motion } from 'framer-motion'
import { StatusPill } from 'app/components/ui/StatusPill'
import { formatMoney } from 'app/utils/currency.utils'
import { formatDate } from 'app/utils/date.utils'
import { Link } from 'lucide-react'

export function AdoptionFees({ adoptionFees }) {
  return (
    <motion.section
      variants={fadeUp}
      initial="hidden"
      animate="show"
      custom={3}
      aria-labelledby="adoption-fees-heading"
    >
      <SectionLabel label="Adoption Fees" />
      {adoptionFees?.length === 0 ? (
        <EmptyState message="No adoption fees on file." />
      ) : (
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
                      href="/adopt/application/apply"
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
      )}
    </motion.section>
  )
}
