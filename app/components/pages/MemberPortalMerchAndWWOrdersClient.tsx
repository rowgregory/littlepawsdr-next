'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, ChevronUp } from 'lucide-react'
import Link from 'next/link'
import { fadeUp } from 'app/lib/constants/motion'
import { formatDate } from 'app/utils/date.utils'
import { StatusPill } from '../ui/StatusPill'
import { formatMoney } from 'app/utils/currency.utils'
import Picture from '../common/Picture'
import { MerchAndWWOrder } from 'types/member-portal'

function PurchaseRow({ order, index }: { order: MerchAndWWOrder; index: number }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate="show"
      custom={index}
      className="border-b border-border-light dark:border-border-dark last:border-0"
    >
      {/* ── Summary row ── */}
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        aria-expanded={expanded}
        aria-controls={`order-${order.id}`}
        className="w-full flex items-center gap-3 px-4 sm:px-5 py-4 text-left hover:bg-surface-light dark:hover:bg-surface-dark transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark"
      >
        {/* Date + name */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="block w-3 h-px bg-primary-light dark:bg-primary-dark shrink-0" aria-hidden="true" />
            <p className="text-[10px] font-mono tracking-[0.15em] uppercase text-muted-light dark:text-muted-dark truncate">
              {formatDate(order.createdAt, true)}
            </p>
          </div>
          {order.customerName && <p className="text-xs font-mono text-text-light dark:text-text-dark pl-5 truncate">{order.customerName}</p>}
          {/* Items preview — collapsed only */}
          {!expanded && (
            <p className="text-[10px] font-mono text-muted-light dark:text-muted-dark pl-5 truncate mt-0.5">
              {order.items.map((i) => i.name).join(', ')}
            </p>
          )}
        </div>

        {/* Status + amount + chevron */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <div className="hidden sm:flex items-center gap-2">
            <StatusPill status={order.status} />
            {order.shippingStatus && <StatusPill status={order.shippingStatus} />}
          </div>
          <span className="font-quicksand font-black text-sm text-primary-light dark:text-primary-dark tabular-nums">
            {formatMoney(order.totalAmount)}
          </span>
          {expanded ? (
            <ChevronUp className="w-3.5 h-3.5 text-muted-light dark:text-muted-dark shrink-0" aria-hidden="true" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5 text-muted-light dark:text-muted-dark shrink-0" aria-hidden="true" />
          )}
        </div>
      </button>

      {/* ── Expanded detail ── */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            id={`order-${order.id}`}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-4 sm:px-5 pb-5 space-y-4 border-t border-border-light dark:border-border-dark pt-4">
              {/* Status pills — mobile */}
              <div className="flex items-center gap-2 sm:hidden">
                <StatusPill status={order.status} />
                {order.shippingStatus && <StatusPill status={order.shippingStatus} />}
              </div>

              {/* Items */}
              <ul className="space-y-2.5" role="list" aria-label="Order items">
                {order.items.map((item) => (
                  <li key={item.id} className="flex items-center gap-3" role="listitem">
                    <div
                      className="shrink-0 w-10 h-10 bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark overflow-hidden"
                      aria-hidden="true"
                    >
                      {item.image ? (
                        <Picture priority={true} src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-[9px] font-mono text-muted-light dark:text-muted-dark">?</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-mono text-text-light dark:text-text-dark truncate">{item.name}</p>
                      {item.quantity > 1 && <p className="text-[10px] font-mono text-muted-light dark:text-muted-dark">×{item.quantity}</p>}
                    </div>
                    <span className="text-[11px] font-mono text-muted-light dark:text-muted-dark tabular-nums shrink-0">
                      {formatMoney(item.price * item.quantity)}
                    </span>
                  </li>
                ))}
              </ul>

              {/* Shipping address */}
              {order.shippingAddress && (
                <div className="pt-3 border-t border-border-light dark:border-border-dark flex items-start gap-2">
                  <p className="text-[10px] font-mono tracking-[0.15em] uppercase text-muted-light dark:text-muted-dark shrink-0 mt-px">Ships to</p>
                  <p className="text-[10px] font-mono text-muted-light dark:text-muted-dark leading-relaxed">
                    {order.shippingAddress.addressLine1}
                    {order.shippingAddress.addressLine2 && `, ${order.shippingAddress.addressLine2}`}
                    {', '}
                    {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipPostalCode}
                  </p>
                </div>
              )}

              {/* Order total breakdown */}
              <div className="pt-3 border-t border-border-light dark:border-border-dark space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono tracking-[0.15em] uppercase text-muted-light dark:text-muted-dark">Subtotal</span>
                  <span className="text-[11px] font-mono text-muted-light dark:text-muted-dark tabular-nums">
                    {formatMoney(order.items.reduce((sum, i) => sum + i.price * i.quantity, 0))}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono tracking-[0.15em] uppercase text-muted-light dark:text-muted-dark">Total</span>
                  <span className="font-quicksand font-black text-base text-primary-light dark:text-primary-dark tabular-nums">
                    {formatMoney(order.totalAmount)}
                  </span>
                </div>
              </div>

              {/* View confirmation */}
              <div className="pt-3 border-t border-border-light dark:border-border-dark">
                <Link
                  href={`/order-confirmation/${order.id}`}
                  aria-label={`View order confirmation for order on ${formatDate(order.createdAt)}`}
                  className="text-[10px] font-mono tracking-[0.2em] uppercase text-muted-light dark:text-muted-dark hover:text-primary-light dark:hover:text-primary-dark transition-colors focus:outline-none focus-visible:underline"
                >
                  View confirmation →
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// ─────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────

export default function MemberPortalMerchAndWWOrdersClient({ orders }: { orders: MerchAndWWOrder[] }) {
  return (
    <main id="main-content" className="min-h-screen bg-bg-light dark:bg-bg-dark text-text-light dark:text-text-dark">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-12 sm:pt-16 pb-24 sm:pb-32">
        {/* ── Header ── */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={0} className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <span className="block w-6 h-px bg-primary-light dark:bg-primary-dark shrink-0" aria-hidden="true" />
            <p className="text-xs font-mono tracking-[0.2em] uppercase text-primary-light dark:text-primary-dark">Member Portal</p>
          </div>
          <div className="flex items-start justify-between gap-4">
            <h1 className="font-quicksand text-4xl sm:text-5xl font-black text-text-light dark:text-text-dark leading-tight">
              My <span className="font-light text-muted-light dark:text-muted-dark">Purchases</span>
            </h1>
            <Link
              href="/member/portal"
              className="shrink-0 text-[10px] font-mono tracking-[0.2em] uppercase text-muted-light dark:text-muted-dark hover:text-primary-light dark:hover:text-primary-dark transition-colors focus:outline-none focus-visible:underline mt-2"
            >
              ← Portal
            </Link>
          </div>
          <p className="text-[10px] font-mono tracking-[0.15em] uppercase text-muted-light dark:text-muted-dark mt-3">
            {orders.length} order{orders.length !== 1 ? 's' : ''}
          </p>
        </motion.div>

        {/* ── List ── */}
        {orders.length === 0 ? (
          <motion.div variants={fadeUp} initial="hidden" animate="show" custom={1} className="py-16 text-center" role="status" aria-live="polite">
            <p className="text-sm font-mono text-muted-light dark:text-muted-dark">You haven&apos;t made any orders yet.</p>
            <Link
              href="/merch"
              className="inline-block mt-4 text-[10px] font-mono tracking-[0.2em] uppercase text-primary-light dark:text-primary-dark hover:text-secondary-light dark:hover:text-secondary-dark transition-colors focus:outline-none focus-visible:underline"
            >
              Browse the store →
            </Link>
          </motion.div>
        ) : (
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={1}
            className="border border-border-light dark:border-border-dark"
            role="list"
            aria-label="Purchase history"
          >
            {orders.map((order, i) => (
              <div key={order.id} role="listitem">
                <PurchaseRow order={order} index={i} />
              </div>
            ))}
          </motion.div>
        )}
      </div>
    </main>
  )
}
