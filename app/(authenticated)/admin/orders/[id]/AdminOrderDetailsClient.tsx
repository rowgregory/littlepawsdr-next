'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Package, Truck, CheckCircle, MapPin, User, CreditCard, Heart, ChevronRight } from 'lucide-react'
import { updateOrderShippingStatus } from 'app/lib/actions/order/updateOrderShippingStatus'
import { useState } from 'react'
import { store } from 'app/lib/store/store'
import { showToast } from 'app/lib/store/slices/toastSlice'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { SerializedOrder } from 'types/entities/order.types'
import { STATUS_STYLES } from 'app/lib/constants/order.constants'

function Label({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] font-mono tracking-[0.2em] uppercase text-muted-light dark:text-muted-dark">{children}</p>
  )
}

function money(n: number) {
  return `$${n.toFixed(2)}`
}

export function AdminOrderDetailsClient({ order }: { order: SerializedOrder }) {
  const hasPhysical = order.items.some((i) => i.isPhysical)

  const address = [order.addressLine1, order.addressLine2, order.city, order.state].filter(Boolean).join(', ')
  const [shipLoading, setShipLoading] = useState(false)
  const [shippedLocally, setShippedLocally] = useState(false)
  const router = useRouter()

  const itemCount = order.items.reduce((s, i) => s + (i.quantity ?? 1), 0)
  const destination = [order.city, order.state].filter(Boolean).join(', ')

  const handleMarkShipped = async () => {
    setShipLoading(true)
    try {
      const result = await updateOrderShippingStatus({ id: order.id, shippingStatus: 'SHIPPED' })
      if (!result.success) throw new Error(result.error ?? 'Failed to update')

      setShippedLocally(true)
      store.dispatch(
        showToast({
          type: 'success',
          message: `Order #${order.id.slice(-8)} marked as shipped`,
          description:
            [order.customerName, `${itemCount} item${itemCount === 1 ? '' : 's'}`, destination]
              .filter(Boolean)
              .join(' · ') || undefined,
          duration: 5000
        })
      )
      router.refresh()
    } catch (err) {
      store.dispatch(
        showToast({
          type: 'error',
          message: `Couldn't mark order #${order.id.slice(-8)} as shipped`,
          description: err instanceof Error ? err.message : 'Something went wrong — please try again',
          duration: 6000
        })
      )
    } finally {
      setShipLoading(false)
    }
  }

  const isShipped = order.shippingStatus === 'SHIPPED' || shippedLocally

  const DONATION_TYPES = new Set(['ONE_TIME_DONATION', 'RECURRING_DONATION', 'ADOPTION_FEE', 'FEED_A_FOSTER'])

  const typeLabel =
    {
      ONE_TIME_DONATION: 'One-time donation',
      RECURRING_DONATION: 'Recurring donation',
      ADOPTION_FEE: 'Adoption fee',
      FEED_A_FOSTER: 'Feed a Foster'
    }[order.type] ?? order.type.replaceAll('_', ' ')

  return (
    <main id="main-content" className="min-h-screen w-full bg-bg-light dark:bg-bg-dark">
      {/* ── Topbar ── */}
      <header className="sticky top-0 z-10 w-full border-b border-border-light dark:border-border-dark bg-bg-light/90 dark:bg-bg-dark/90 backdrop-blur px-4 h-10 flex items-center justify-between">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 min-w-0">
          <span className="text-[9px] font-mono text-border-light dark:text-border-dark" aria-hidden="true">
            /
          </span>
          <Link
            href="/admin/orders"
            className="text-[9px] font-mono tracking-[0.2em] uppercase text-muted-light dark:text-muted-dark hover:text-primary-light dark:hover:text-primary-dark transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark"
          >
            Orders
          </Link>
          <span className="text-[9px] font-mono text-border-light dark:text-border-dark" aria-hidden="true">
            /
          </span>
          <p
            className="text-[9px] font-mono tracking-[0.15em] uppercase text-text-light dark:text-text-dark truncate"
            aria-current="page"
          >
            #{order.id.slice(-8)}
          </p>
        </nav>

        <span
          className={`shrink-0 inline-flex items-center px-2 py-0.5 border text-[8px] font-mono tracking-[0.2em] uppercase ${
            STATUS_STYLES[order.status] ??
            'border-border-light dark:border-border-dark text-muted-light dark:text-muted-dark'
          }`}
        >
          {order.status}
        </span>
      </header>

      {/* ── Body — full bleed, three columns on wide ── */}
      <div className="w-full px-4 sm:px-6 py-6 grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-6 items-start">
        {/* ════ Left: items + totals ════ */}
        <div className="space-y-6 min-w-0">
          {/* Items / Donation details */}
          <section
            aria-labelledby="items-heading"
            className="border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-border-light dark:border-border-dark">
              <h2
                id="items-heading"
                className="flex items-center gap-2 font-quicksand font-black text-sm text-text-light dark:text-text-dark"
              >
                <Package className="w-4 h-4 text-primary-light dark:text-primary-dark" aria-hidden="true" />
                {order.items.length === 0 ? 'Donation' : 'Items'}
              </h2>
              {order.items.length > 0 && (
                <Label>
                  {order.items.length} line{order.items.length === 1 ? '' : 's'}
                </Label>
              )}
            </div>

            {DONATION_TYPES.has(order.type) ? (
              /* ── Pure donation — no item lines ── */
              <div className="px-4 py-5 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="shrink-0 w-10 h-10 flex items-center justify-center border border-primary-light/30 dark:border-primary-dark/30 bg-primary-light/10 dark:bg-primary-dark/10">
                    <Heart className="w-4 h-4 text-primary-light dark:text-primary-dark" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-sm font-nunito text-text-light dark:text-text-dark">{typeLabel}</p>
                    <p className="text-[10px] font-mono text-muted-light dark:text-muted-dark mt-0.5">
                      {order.type.replaceAll('_', ' ')}
                      {order.isRecurring && order.recurringFrequency && ` · ${order.recurringFrequency}`}
                      {order.tierName && ` · ${order.tierName}`}
                    </p>
                  </div>
                </div>

                <dl className="space-y-1.5 border-t border-border-light dark:border-border-dark pt-3">
                  <div className="flex justify-between">
                    <dt className="text-[10px] font-mono tracking-[0.15em] uppercase text-muted-light dark:text-muted-dark">
                      Donation
                    </dt>
                    <dd className="text-xs font-mono tabular-nums text-text-light dark:text-text-dark">
                      {money(order.totalAmount - order.feesCovered)}
                    </dd>
                  </div>
                  {order.coverFees && (
                    <div className="flex justify-between">
                      <dt className="text-[10px] font-mono tracking-[0.15em] uppercase text-muted-light dark:text-muted-dark">
                        Fees covered by donor
                      </dt>
                      <dd className="text-xs font-mono tabular-nums text-emerald-600 dark:text-emerald-400">
                        +{money(order.feesCovered)}
                      </dd>
                    </div>
                  )}
                  {order.isRecurring && order.nextBillingDate && (
                    <div className="flex justify-between">
                      <dt className="text-[10px] font-mono tracking-[0.15em] uppercase text-muted-light dark:text-muted-dark">
                        Next billing
                      </dt>
                      <dd className="text-xs font-mono tabular-nums text-text-light dark:text-text-dark">
                        {new Date(order.nextBillingDate).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </dd>
                    </div>
                  )}
                  <div className="flex justify-between pt-1.5 border-t border-border-light dark:border-border-dark">
                    <dt className="text-[10px] font-mono tracking-[0.2em] uppercase font-bold text-text-light dark:text-text-dark">
                      Total charged
                    </dt>
                    <dd className="text-sm font-mono font-bold tabular-nums text-primary-light dark:text-primary-dark">
                      {money(order.totalAmount)}
                    </dd>
                  </div>
                </dl>
              </div>
            ) : (
              <>
                <ul className="divide-y divide-border-light dark:divide-border-dark">
                  {order.items.map((item) => (
                    <li key={item.id} className="flex items-center gap-4 px-4 py-3">
                      <div className="shrink-0 w-12 h-12 border border-border-light dark:border-border-dark bg-bg-light dark:bg-bg-dark overflow-hidden relative">
                        {item.itemImage ? (
                          <Image src={item.itemImage} alt="" fill sizes="48px" className="object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center" aria-hidden="true">
                            {item.isPhysical ? (
                              <Package className="w-4 h-4 text-muted-light dark:text-muted-dark" />
                            ) : (
                              <Heart className="w-4 h-4 text-primary-light dark:text-primary-dark" />
                            )}
                          </div>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 min-w-0">
                          <p className="text-sm font-nunito text-text-light dark:text-text-dark truncate">
                            {item.itemName ?? 'Unnamed item'}
                          </p>
                          {!item.isPhysical && (
                            <span className="shrink-0 px-1.5 py-0.5 border border-primary-light/30 dark:border-primary-dark/30 text-[8px] font-mono tracking-[0.15em] uppercase text-primary-light dark:text-primary-dark">
                              Donation
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] font-mono text-muted-light dark:text-muted-dark mt-0.5">
                          {item.isPhysical ? (
                            <>
                              {item.size && <>Size {item.size} · </>}
                              Qty {item.quantity ?? 1} · {money(item.price)} each
                              {item.shippingPrice > 0 && <> · +{money(item.shippingPrice)} shipping</>}
                            </>
                          ) : (
                            <>
                              {(item.quantity ?? 1) > 1 ? `${item.quantity} × ${money(item.price)}` : money(item.price)}{' '}
                              · no shipping
                            </>
                          )}
                        </p>
                        {item.welcomeWienerId && (
                          <Link
                            href={`/admin/welcome-wieners/${item.welcomeWienerId}`}
                            className="inline-flex items-center gap-1 text-[10px] font-mono text-primary-light dark:text-primary-dark hover:underline mt-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark"
                          >
                            View wiener
                            <ChevronRight className="w-3 h-3" aria-hidden="true" />
                          </Link>
                        )}
                      </div>

                      <p className="shrink-0 text-sm font-mono tabular-nums text-text-light dark:text-text-dark">
                        {money(item.totalPrice ?? item.price * (item.quantity ?? 1))}
                      </p>
                    </li>
                  ))}
                </ul>

                {/* Totals dl — unchanged from before */}
              </>
            )}
          </section>
        </div>

        {/* ════ Right: customer / shipping / payment ════ */}
        <div className="space-y-6">
          {/* Fulfillment */}
          {hasPhysical && (
            <section
              aria-labelledby="fulfillment-heading"
              className="border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark"
            >
              <div className="px-4 py-3 border-b border-border-light dark:border-border-dark">
                <h2
                  id="fulfillment-heading"
                  className="flex items-center gap-2 font-quicksand font-black text-sm text-text-light dark:text-text-dark"
                >
                  <Truck className="w-4 h-4 text-primary-light dark:text-primary-dark" aria-hidden="true" />
                  Fulfillment
                </h2>
              </div>
              <div className="px-4 py-4 space-y-4">
                <div>
                  <Label>Ships to</Label>
                  <p className="text-xs font-mono text-text-light dark:text-text-dark mt-1">
                    {address || '—'} {order.zipPostalCode ?? ''}
                  </p>
                </div>

                {isShipped ? (
                  <p className="inline-flex items-center gap-2 px-3 py-2 border border-emerald-500/40 bg-emerald-500/5 text-[10px] font-mono tracking-[0.2em] uppercase text-emerald-600 dark:text-emerald-400">
                    <CheckCircle className="w-3.5 h-3.5" aria-hidden="true" />
                    Shipped
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={handleMarkShipped}
                    disabled={shipLoading}
                    className="w-full py-3 font-mono font-black text-[10px] tracking-[0.2em] uppercase bg-primary-light dark:bg-primary-dark text-white dark:text-bg-dark hover:bg-secondary-light dark:hover:bg-secondary-dark disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:bg-primary-light dark:disabled:hover:bg-primary-dark transition-colors focus:outline-none focus-visible:ring-4 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark flex items-center justify-center gap-2"
                  >
                    {shipLoading ? (
                      <span className="flex items-center gap-2" aria-live="polite">
                        <motion.span
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                          className="block w-3.5 h-3.5 border-2 border-current/30 border-t-current "
                          aria-hidden="true"
                        />
                        Marking...
                      </span>
                    ) : (
                      <>
                        <Truck className="w-3.5 h-3.5" aria-hidden="true" />
                        Mark as Shipped
                      </>
                    )}
                  </button>
                )}
              </div>
            </section>
          )}

          {/* Customer */}
          <section
            aria-labelledby="customer-heading"
            className="border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark"
          >
            <div className="px-4 py-3 border-b border-border-light dark:border-border-dark">
              <h2
                id="customer-heading"
                className="flex items-center gap-2 font-quicksand font-black text-sm text-text-light dark:text-text-dark"
              >
                <User className="w-4 h-4 text-primary-light dark:text-primary-dark" aria-hidden="true" />
                Customer
              </h2>
            </div>
            <div className="px-4 py-4 space-y-3">
              <div>
                <Label>Name</Label>
                <p className="text-xs font-mono text-text-light dark:text-text-dark mt-1">
                  {order.customerName || '—'}
                </p>
              </div>
              <div>
                <Label>Email</Label>
                <p className="text-xs font-mono text-text-light dark:text-text-dark mt-1 break-all">
                  {order.customerEmail || '—'}
                </p>
              </div>
              {(order.geoCity || order.geoRegion) && (
                <div>
                  <Label>Location at purchase</Label>
                  <p className="flex items-center gap-1.5 text-xs font-mono text-text-light dark:text-text-dark mt-1">
                    <MapPin className="w-3 h-3 text-muted-light dark:text-muted-dark" aria-hidden="true" />
                    {[order.geoCity, order.geoRegion, order.geoCountry].filter(Boolean).join(', ')}
                  </p>
                </div>
              )}
            </div>
          </section>

          {/* Payment */}
          <section
            aria-labelledby="payment-heading"
            className="border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark"
          >
            <div className="px-4 py-3 border-b border-border-light dark:border-border-dark">
              <h2
                id="payment-heading"
                className="flex items-center gap-2 font-quicksand font-black text-sm text-text-light dark:text-text-dark"
              >
                <CreditCard className="w-4 h-4 text-primary-light dark:text-primary-dark" aria-hidden="true" />
                Payment
              </h2>
            </div>
            <div className="px-4 py-4 space-y-3">
              <div>
                <Label>Type</Label>
                <p className="text-xs font-mono text-text-light dark:text-text-dark mt-1">
                  {order.type.replaceAll('_', ' ')}
                </p>
              </div>
              <div>
                <Label>Placed</Label>
                <p className="text-xs font-mono text-text-light dark:text-text-dark mt-1">
                  {new Date(order.createdAt).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}
                </p>
              </div>
              {order.paymentIntentId && (
                <div>
                  <Label>Payment intent</Label>
                  <p className="text-[10px] font-mono text-muted-light dark:text-muted-dark mt-1 break-all">
                    {order.paymentIntentId}
                  </p>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}
