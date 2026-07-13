import { formatDate } from 'app/utils/_date.utils'
import { Package } from 'lucide-react'
import { motion } from 'framer-motion'
import { fadeUp } from 'app/lib/constants/motion.constants'
import { EmptyState } from './EmptyState'
import { StatusPill } from 'app/components/_primitives/StatusPill'
import { formatMoney } from 'app/utils/_currency.utils'
import Picture from 'app/components/_common/Picture'
import Link from 'next/link'

export function MerchAndWienerGifts({ merchAndWWOrders }) {
  return (
    <motion.section variants={fadeUp} initial="hidden" animate="show" custom={0} aria-labelledby="merch-wiener-heading">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <span className="block w-6 h-px bg-primary-light dark:bg-primary-dark shrink-0" aria-hidden="true" />
          <h2
            id="address-heading"
            className="text-xs font-mono tracking-[0.2em] uppercase text-primary-light dark:text-primary-dark"
          >
            Merch & Welcome Wieners
          </h2>
        </div>
        <Link
          href="/merch"
          className="flex items-center gap-1.5 text-[10px] font-mono tracking-widest uppercase px-3 py-1.5 border border-border-light dark:border-border-dark hover:border-primary-light dark:hover:border-primary-dark text-muted-light dark:text-muted-dark hover:text-primary-light dark:hover:text-primary-dark transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark"
          aria-label="Purchase merch or welcome wiener"
        >
          <Package className="w-3 h-3 shrink-0" aria-hidden="true" />
          Purchase
        </Link>
      </div>

      {merchAndWWOrders?.length === 0 ? (
        <EmptyState message="You haven't made any purchases yet." />
      ) : (
        <div className="border border-border-light dark:border-border-dark divide-y divide-border-light dark:divide-border-dark">
          {merchAndWWOrders?.slice(0, 3).map((order) => (
            <div key={order.id} className="p-4 sm:p-5">
              {/* Header */}
              <div className="flex items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-2">
                  <span className="block w-3 h-px bg-primary-light dark:bg-primary-dark" aria-hidden="true" />
                  <div>
                    <p className="text-[10px] font-mono tracking-[0.15em] uppercase text-muted-light dark:text-muted-dark">
                      {formatDate(order.createdAt, true)}
                    </p>
                    {order.customerName && (
                      <p className="text-xs font-mono text-text-light dark:text-text-dark mt-0.5">
                        {order.customerName}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[9px] font-mono tracking-[0.15em] uppercase px-2 py-0.5 border border-border-light dark:border-border-dark text-muted-light dark:text-muted-dark">
                    {order.type === 'MIXED'
                      ? 'Merch + Welcome Wiener'
                      : order.type === 'WELCOME_WIENER'
                        ? 'Welcome Wiener'
                        : 'Merch'}
                  </span>
                  <StatusPill status={order.status} />
                  {order.shippingStatus && <StatusPill status={order.shippingStatus} />}
                  <span className="font-quicksand font-black text-sm text-primary-light dark:text-primary-dark tabular-nums">
                    {formatMoney(order.totalAmount)}
                  </span>
                </div>
              </div>

              {/* Items */}
              <ul className="space-y-2" role="list" aria-label="Order items">
                {order.items.map((item) => (
                  <li key={item.id} className="flex items-center gap-3" role="listitem">
                    <div
                      className="shrink-0 w-8 h-8 bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark overflow-hidden"
                      aria-hidden="true"
                    >
                      {item.image ? (
                        <Picture
                          priority={false}
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-[9px] font-mono text-muted-light dark:text-muted-dark">?</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-mono text-text-light dark:text-text-dark truncate">{item.name}</p>
                      {item.quantity > 1 && (
                        <p className="text-[10px] font-mono text-muted-light dark:text-muted-dark">×{item.quantity}</p>
                      )}
                    </div>
                    <span className="text-[11px] font-mono text-muted-light dark:text-muted-dark tabular-nums shrink-0">
                      {formatMoney(item.price * item.quantity)}
                    </span>
                  </li>
                ))}
              </ul>

              {/* Shipping address */}
              {order.shippingAddress && (
                <div className="flex items-start gap-2 mt-3 pt-3 border-t border-border-light dark:border-border-dark">
                  <p className="text-[10px] font-mono tracking-[0.15em] uppercase text-muted-light dark:text-muted-dark shrink-0">
                    Ships to
                  </p>
                  <p className="text-[10px] font-mono text-muted-light dark:text-muted-dark leading-relaxed">
                    {order.shippingAddress.addressLine1}
                    {order.shippingAddress.addressLine2 && `, ${order.shippingAddress.addressLine2}`}
                    {', '}
                    {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipPostalCode}
                  </p>
                </div>
              )}

              {/* View confirmation */}
              <div className="mt-3 pt-3 border-t border-border-light dark:border-border-dark">
                <Link
                  href={`/order-confirmation/${order.id}`}
                  aria-label={`View order confirmation for ${formatDate(order.createdAt)}`}
                  className="text-[10px] font-mono tracking-[0.2em] uppercase text-muted-light dark:text-muted-dark hover:text-primary-light dark:hover:text-primary-dark transition-colors focus:outline-none focus-visible:underline"
                >
                  View confirmation →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* View all button — shown below the list too */}
      {merchAndWWOrders?.length > 5 && (
        <div className="mt-4">
          <Link
            href=" /my-pack/merch-and-ww"
            className="inline-flex items-center gap-2 px-4 py-2.5 border border-border-light dark:border-border-dark text-[10px] font-mono tracking-[0.2em] uppercase text-muted-light dark:text-muted-dark hover:border-primary-light dark:hover:border-primary-dark hover:text-primary-light dark:hover:text-primary-dark transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark"
          >
            View all {merchAndWWOrders?.length} orders →
          </Link>
        </div>
      )}
    </motion.section>
  )
}
