'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { Package, DollarSign, Truck, XCircle, ChevronRight, LayoutDashboard } from 'lucide-react'
import { Filter, OrderRow } from 'types/entities/order.types'
import { FILTER_LABELS, FILTERS, STATUS_STYLES } from 'app/lib/constants/order.constants'

function money(n: number) {
  return `$${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

function Stat({ icon: Icon, label, value, accent }: { icon: typeof Package; label: string; value: string; accent?: boolean }) {
  return (
    <div className="border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark px-4 py-3">
      <p className="flex items-center gap-1.5 text-[9px] font-mono tracking-[0.2em] uppercase text-muted-light dark:text-muted-dark">
        <Icon className="w-3 h-3" aria-hidden="true" />
        {label}
      </p>
      <p
        className={`mt-1 font-quicksand font-black text-xl tabular-nums ${
          accent ? 'text-primary-light dark:text-primary-dark' : 'text-text-light dark:text-text-dark'
        }`}
      >
        {value}
      </p>
    </div>
  )
}

export function AdminOrdersClient({ orders }: { orders: OrderRow[] }) {
  const [filter, setFilter] = useState<Filter>('ALL')

  const stats = useMemo(() => {
    const confirmed = orders.filter((o) => o.status === 'CONFIRMED')
    return {
      revenue: confirmed.reduce((s, o) => s + o.totalAmount, 0),
      confirmedCount: confirmed.length,
      needsShipping: orders.filter((o) => o.status === 'CONFIRMED' && o.shippingStatus === 'PENDING_FULFILLMENT').length,
      failed: orders.filter((o) => o.status === 'FAILED').length
    }
  }, [orders])

  const visible = useMemo(() => {
    if (filter === 'ALL') return orders
    if (filter === 'NEEDS_SHIPPING') return orders.filter((o) => o.status === 'CONFIRMED' && o.shippingStatus === 'PENDING_FULFILLMENT')
    return orders.filter((o) => o.status === filter)
  }, [orders, filter])

  return (
    <main id="main-content" className="min-h-screen w-full bg-bg-light dark:bg-bg-dark">
      {/* ── Header ── */}
      <header className="sticky top-0 z-10 w-full border-b border-border-light dark:border-border-dark bg-bg-light/90 dark:bg-bg-dark/90 backdrop-blur px-4 h-10 flex items-center justify-between">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 min-w-0">
          <Link
            href="/admin/dashboard"
            className="inline-flex items-center gap-1.5 text-[9px] font-mono tracking-[0.2em] uppercase text-muted-light dark:text-muted-dark hover:text-primary-light dark:hover:text-primary-dark transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark"
          >
            <LayoutDashboard className="w-3 h-3" aria-hidden="true" />
            Dashboard
          </Link>
          <span className="text-[9px] font-mono text-border-light dark:text-border-dark" aria-hidden="true">
            /
          </span>
          <h1 className="text-[9px] font-mono tracking-[0.2em] uppercase text-text-light dark:text-text-dark" aria-current="page">
            Orders
          </h1>
        </nav>

        <span className="shrink-0 text-[9px] font-mono tabular-nums text-muted-light dark:text-muted-dark">
          {orders.length} order{orders.length === 1 ? '' : 's'}
        </span>
      </header>

      <div className="w-full px-4 sm:px-6 py-6 space-y-6">
        {/* ── Stats ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <Stat icon={DollarSign} label="Revenue" value={money(stats.revenue)} accent />
          <Stat icon={Package} label="Confirmed Orders" value={String(stats.confirmedCount)} />
          <Stat icon={Truck} label="Needs Shipping" value={String(stats.needsShipping)} />
          <Stat icon={XCircle} label="Failed" value={String(stats.failed)} />
        </div>

        {/* ── Filters ── */}
        <div role="group" aria-label="Filter orders" className="flex flex-wrap items-center">
          {FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              aria-pressed={filter === f}
              className={`px-3 py-1.5 text-[9px] font-mono tracking-[0.2em] uppercase border-r border-y first:border-l transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark ${
                filter === f
                  ? 'bg-primary-light dark:bg-primary-dark text-white dark:text-bg-dark border-primary-light dark:border-primary-dark'
                  : 'border-border-light dark:border-border-dark text-muted-light dark:text-muted-dark hover:text-text-light dark:hover:text-text-dark bg-surface-light dark:bg-surface-dark'
              }`}
            >
              {FILTER_LABELS[f]}
            </button>
          ))}
        </div>

        {/* ── Table ── */}
        <div className="border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark overflow-x-auto">
          <table className="w-full text-left">
            <caption className="sr-only">All orders, newest first</caption>
            <thead>
              <tr className="border-b border-border-light dark:border-border-dark">
                {['Order', 'Date', 'Customer', 'Type', 'Items', 'Total', 'Status', 'Shipping', ''].map((h, i) => (
                  <th
                    key={i}
                    scope="col"
                    className="px-4 py-2.5 text-[9px] font-mono tracking-[0.2em] uppercase text-muted-light dark:text-muted-dark font-normal whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border-light dark:divide-border-dark">
              {visible.map((order) => (
                <tr key={order.id} className="group hover:bg-primary-light/5 dark:hover:bg-primary-dark/5 transition-colors">
                  <td className="px-4 py-3 whitespace-nowrap">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="text-xs font-mono text-primary-light dark:text-primary-dark hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark"
                    >
                      #{order.id.slice(-8)}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-xs font-mono text-muted-light dark:text-muted-dark whitespace-nowrap">
                    {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td className="px-4 py-3 min-w-0 max-w-50">
                    <p className="text-xs font-nunito text-text-light dark:text-text-dark truncate">{order.customerName || '—'}</p>
                    <p className="text-[10px] font-mono text-muted-light dark:text-muted-dark truncate">{order.customerEmail}</p>
                  </td>
                  <td className="px-4 py-3 text-[10px] font-mono text-muted-light dark:text-muted-dark whitespace-nowrap">
                    {order.type.replaceAll('_', ' ')}
                    {order.isRecurring && ' ↻'}
                  </td>
                  <td className="px-4 py-3 text-xs font-mono tabular-nums text-text-light dark:text-text-dark">{order.itemCount || '—'}</td>
                  <td className="px-4 py-3 text-xs font-mono tabular-nums font-bold text-text-light dark:text-text-dark whitespace-nowrap">
                    {money(order.totalAmount)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-0.5 border text-[9px] font-mono tracking-[0.15em] uppercase ${
                        STATUS_STYLES[order.status] ?? 'border-border-light dark:border-border-dark text-muted-light dark:text-muted-dark'
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[10px] font-mono text-muted-light dark:text-muted-dark whitespace-nowrap">
                    {order.shippingStatus === 'SHIPPED' ? (
                      <span className="text-emerald-600 dark:text-emerald-400">Shipped</span>
                    ) : order.shippingStatus === 'PENDING_FULFILLMENT' ? (
                      <span className="text-amber-600 dark:text-amber-400">Needs shipping</span>
                    ) : (
                      '—'
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link href={`/admin/orders/${order.id}`}>
                      <ChevronRight
                        className="w-3.5 h-3.5 inline text-muted-light dark:text-muted-dark group-hover:text-primary-light dark:group-hover:text-primary-dark transition-colors"
                        aria-hidden="true"
                      />
                    </Link>
                  </td>
                </tr>
              ))}

              {visible.length === 0 && (
                <tr>
                  <td
                    colSpan={9}
                    className="px-4 py-12 text-center text-[10px] font-mono tracking-[0.2em] uppercase text-muted-light dark:text-muted-dark"
                  >
                    No {FILTER_LABELS[filter].toLowerCase()} orders
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  )
}
