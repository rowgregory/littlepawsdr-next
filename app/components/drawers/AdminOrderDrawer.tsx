'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, CreditCard, Package, MapPin, Receipt } from 'lucide-react'
import { StatusPill } from '../ui/StatusPill'
import { formatDate } from 'app/utils/date.utils'
import Picture from '../common/Picture'
import { formatMoney } from 'app/utils/currency.utils'
import { store, useUiSelector } from 'app/lib/store/store'
import { setCloseOrderDrawer } from 'app/lib/store/slices/uiSlice'

const labelClass = `text-[10px] font-mono tracking-[0.15em] uppercase text-muted-light dark:text-muted-dark`
const valueClass = `text-sm font-mono text-text-light dark:text-text-dark`

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 py-3 border-b border-border-light dark:border-border-dark last:border-0">
      <span className={labelClass}>{label}</span>
      <div className="text-right">{value}</div>
    </div>
  )
}

function Section({ title, icon, children }: { title: string; icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="px-6 py-5 border-b border-border-light dark:border-border-dark">
      <div className="flex items-center gap-2 mb-4">
        {icon && <span className="text-muted-light dark:text-muted-dark">{icon}</span>}
        <p className="text-[10px] font-mono tracking-[0.2em] uppercase text-muted-light dark:text-muted-dark">{title}</p>
      </div>
      {children}
    </div>
  )
}

export function AdminOrderDrawer() {
  const { order } = useUiSelector()
  const hasPhysical = order?.type === 'PRODUCT' || order?.type === 'MIXED'
  const hasAddress = order?.addressLine1

  const onClose = () => store.dispatch(setCloseOrderDrawer())

  return (
    <AnimatePresence>
      {order && (
        <>
          {/* Overlay */}
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-40"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Drawer */}
          <motion.div
            key="drawer"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3, ease: 'easeInOut' }}
            className="fixed top-0 right-0 w-full sm:w-130 h-screen z-50 flex flex-col bg-bg-light dark:bg-bg-dark overflow-hidden"
            role="dialog"
            aria-modal="true"
            aria-label={`Order details for ${order.customerName}`}
          >
            {/* ── Header ── */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark shrink-0">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <span className="block w-4 h-px bg-primary-light dark:bg-primary-dark" aria-hidden="true" />
                  <p className="text-[10px] font-mono tracking-[0.2em] uppercase text-primary-light dark:text-primary-dark">Order Details</p>
                </div>
                <p className="text-xs font-mono text-muted-light dark:text-muted-dark pl-7">{order.id}</p>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close order details"
                className="text-muted-light dark:text-muted-dark hover:text-text-light dark:hover:text-text-dark transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark p-1"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>

            {/* ── Scrollable body ── */}
            <div className="flex-1 overflow-y-auto">
              {/* ── Summary ── */}
              <Section title="Summary" icon={<Receipt className="w-3.5 h-3.5" />}>
                <Row
                  label="Customer"
                  value={
                    <div>
                      <p className={valueClass}>{order.customerName}</p>
                      <p className="text-[10px] font-mono text-muted-light dark:text-muted-dark mt-0.5">{order.customerEmail}</p>
                    </div>
                  }
                />
                <Row
                  label="Type"
                  value={
                    <span className="text-[10px] font-mono tracking-[0.15em] uppercase text-muted-light dark:text-muted-dark">
                      {order.type.replace(/_/g, ' ')}
                    </span>
                  }
                />
                <Row label="Status" value={<StatusPill status={order.status} />} />
                {hasPhysical && order.shippingStatus && <Row label="Shipping" value={<StatusPill status={order.shippingStatus} />} />}
                <Row label="Date" value={<span className={valueClass}>{formatDate(order.createdAt)}</span>} />
                {order.paidAt && <Row label="Paid at" value={<span className={valueClass}>{formatDate(order.paidAt)}</span>} />}
                {order.isRecurring && order.recurringFrequency && (
                  <Row
                    label="Frequency"
                    value={<span className={valueClass}>{order.recurringFrequency === 'MONTHLY' ? 'Monthly' : 'Yearly'}</span>}
                  />
                )}
                {order.isRecurring && order.nextBillingDate && (
                  <Row label="Next billing" value={<span className={valueClass}>{formatDate(order.nextBillingDate)}</span>} />
                )}
              </Section>

              {/* ── Items ── */}
              {order.items?.length > 0 && (
                <Section title="Items" icon={<Package className="w-3.5 h-3.5" />}>
                  <ul className="space-y-3" role="list">
                    {order.items.map((item) => (
                      <li
                        key={item.id}
                        className="flex items-center gap-3 pb-3 border-b border-border-light dark:border-border-dark last:border-0 last:pb-0"
                        role="listitem"
                      >
                        {/* Image */}
                        <div
                          className="shrink-0 w-10 h-10 bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark overflow-hidden"
                          aria-hidden="true"
                        >
                          {item.itemImage ? (
                            <Picture priority={false} src={item.itemImage} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package className="w-3.5 h-3.5 text-muted-light dark:text-muted-dark" />
                            </div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-mono text-text-light dark:text-text-dark truncate">{item.itemName ?? 'Item'}</p>
                          {(item.quantity ?? 1) > 1 && (
                            <p className="text-[10px] font-mono text-muted-light dark:text-muted-dark">×{item.quantity}</p>
                          )}
                          {item.isPhysical && (
                            <p className="text-[9px] font-mono tracking-[0.15em] uppercase text-muted-light/60 dark:text-muted-dark/60 mt-0.5">
                              Physical
                            </p>
                          )}
                        </div>

                        <div className="text-right shrink-0">
                          <p className="text-xs font-mono text-text-light dark:text-text-dark tabular-nums">
                            {formatMoney(Number(item.price) * (item.quantity ?? 1))}
                          </p>
                          {Number(item.shippingPrice) > 0 && (
                            <p className="text-[10px] font-mono text-muted-light dark:text-muted-dark">
                              +{formatMoney(Number(item.shippingPrice))} ship
                            </p>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </Section>
              )}

              {/* ── Payment ── */}
              <Section title="Payment" icon={<CreditCard className="w-3.5 h-3.5" />}>
                <Row
                  label="Subtotal"
                  value={
                    <span className={valueClass}>
                      {formatMoney(
                        order.items?.length > 0
                          ? order.items.reduce((sum, i) => sum + Number(i.price) * (i.quantity ?? 1), 0)
                          : Number(order.totalAmount)
                      )}
                    </span>
                  }
                />
                {Number(order.feesCovered) > 0 && (
                  <Row label="Fees covered" value={<span className={valueClass}>{formatMoney(Number(order.feesCovered))}</span>} />
                )}
                {hasPhysical && order.items?.some((i) => Number(i.shippingPrice) > 0) && (
                  <Row
                    label="Shipping"
                    value={
                      <span className={valueClass}>
                        {formatMoney(order.items.reduce((sum, i) => sum + Number(i.shippingPrice) * (i.quantity ?? 1), 0))}
                      </span>
                    }
                  />
                )}
                <Row
                  label="Total"
                  value={
                    <span className="font-quicksand font-black text-base text-primary-light dark:text-primary-dark tabular-nums">
                      {formatMoney(Number(order.totalAmount))}
                    </span>
                  }
                />
                {order.paymentMethodId && (
                  <Row
                    label="Payment method"
                    value={<span className="text-[10px] font-mono text-muted-light dark:text-muted-dark">{order.paymentMethodId}</span>}
                  />
                )}
                {order.paymentIntentId && (
                  <Row
                    label="Payment intent"
                    value={<span className="text-[10px] font-mono text-muted-light dark:text-muted-dark break-all">{order.paymentIntentId}</span>}
                  />
                )}
                {order.stripeSubscriptionId && (
                  <Row
                    label="Subscription"
                    value={
                      <span className="text-[10px] font-mono text-muted-light dark:text-muted-dark break-all">{order.stripeSubscriptionId}</span>
                    }
                  />
                )}
              </Section>

              {/* ── Shipping address ── */}
              {hasAddress && (
                <Section title="Shipping Address" icon={<MapPin className="w-3.5 h-3.5" />}>
                  <address className="not-italic text-sm font-mono text-text-light dark:text-text-dark leading-relaxed">
                    {order.addressLine1}
                    {order.addressLine2 && (
                      <>
                        <br />
                        {order.addressLine2}
                      </>
                    )}
                    <br />
                    {order.city}, {order.state} {order.zipPostalCode}
                    {order.country && (
                      <>
                        <br />
                        {order.country}
                      </>
                    )}
                  </address>
                </Section>
              )}

              {/* ── Notes ── */}
              {order.notes && (
                <Section title="Notes">
                  <p className="text-sm font-mono text-muted-light dark:text-muted-dark leading-relaxed">{order.notes}</p>
                </Section>
              )}

              {/* ── Failure info ── */}
              {(order.failureReason || order.failureCode) && (
                <Section title="Failure Info">
                  {order.failureCode && (
                    <Row label="Code" value={<span className="text-[11px] font-mono text-red-500 dark:text-red-400">{order.failureCode}</span>} />
                  )}
                  {order.failureReason && (
                    <Row label="Reason" value={<span className="text-[11px] font-mono text-red-500 dark:text-red-400">{order.failureReason}</span>} />
                  )}
                </Section>
              )}
            </div>

            {/* ── Footer ── */}
            <div className="px-6 py-4 border-t border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark shrink-0">
              <p className="text-[10px] font-mono text-muted-light/60 dark:text-muted-dark/60 text-center">
                Created {formatDate(order.createdAt)} · Last updated {formatDate(order.updatedAt)}
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
