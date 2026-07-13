'use client'

import { useMemo, useState } from 'react'
import { Package, DollarSign, Truck, XCircle, ChevronRight } from 'lucide-react'
import { OrderRow } from 'types/entities/order.types'
import { FILTER_LABELS, FILTERS, STATUS_STYLES, type Filter } from 'app/lib/constants/order.constants'
import { Stat } from 'app/components/admin/Stat'
import { fmtCurrency } from 'app/utils/_currency.utils'
import AdminFilterTabs from 'app/components/admin/AdminFilterTabs'
import AdminPageHeader from 'app/components/admin/AdminPageHeader'
import AdminTable, { Column } from 'app/components/admin/AdminTable'
import Link from 'next/link'

const columns: Column<OrderRow>[] = [
  {
    header: 'Order',
    className: 'whitespace-nowrap',
    cell: (o) => (
      <Link
        href={`/admin/orders/${o.id}`}
        className="text-xs font-mono text-primary-light dark:text-primary-dark hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark"
      >
        #{o.id.slice(-8)}
      </Link>
    )
  },
  {
    header: 'Date',
    className: 'text-xs font-mono text-muted-light dark:text-muted-dark whitespace-nowrap',
    cell: (o) =>
      new Date(o.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        timeZone: 'America/New_York'
      })
  },
  {
    header: 'Customer',
    className: 'min-w-0 max-w-50',
    cell: (o) => (
      <>
        <p className="text-xs font-nunito text-text-light dark:text-text-dark truncate">{o.customerName || '—'}</p>
        <p className="text-[10px] font-mono text-muted-light dark:text-muted-dark truncate">{o.customerEmail}</p>
      </>
    )
  },
  {
    header: 'Type',
    className: 'text-[10px] font-mono text-muted-light dark:text-muted-dark whitespace-nowrap',
    cell: (o) => (
      <>
        {FILTER_LABELS[o.type as Filter] ?? o.type.replaceAll('_', ' ')}
        {o.isRecurring && ' ↻'}
      </>
    )
  },
  {
    header: 'Items',
    className: 'text-xs font-mono tabular-nums text-text-light dark:text-text-dark',
    cell: (o) => o.itemCount || '—'
  },
  {
    header: 'Total',
    className: 'text-xs font-mono tabular-nums font-bold text-text-light dark:text-text-dark whitespace-nowrap',
    cell: (o) => fmtCurrency(o.totalAmount)
  },
  {
    header: 'Status',
    className: 'whitespace-nowrap',
    cell: (o) => (
      <span
        className={`inline-flex px-2 py-0.5 border text-[9px] font-mono tracking-[0.15em] uppercase ${
          STATUS_STYLES[o.status] ?? 'border-border-light dark:border-border-dark text-muted-light dark:text-muted-dark'
        }`}
      >
        {o.status}
      </span>
    )
  },
  {
    header: 'Shipping',
    className: 'text-[10px] font-mono whitespace-nowrap',
    cell: (o) =>
      o.shippingStatus === 'SHIPPED' ? (
        <span className="text-emerald-600 dark:text-emerald-400">Shipped</span>
      ) : o.shippingStatus === 'PENDING_FULFILLMENT' ? (
        <span className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-black">
          <Truck className="w-3 h-3 shrink-0" aria-hidden="true" />
          Needs shipping
        </span>
      ) : (
        <span className="text-muted-light dark:text-muted-dark">—</span>
      )
  },
  {
    header: '',
    className: 'text-right',
    cell: (o) => (
      <Link href={`/admin/orders/${o.id}`} aria-label={`View order ${o.id.slice(-8)}`}>
        <ChevronRight
          className="w-3.5 h-3.5 inline text-muted-light dark:text-muted-dark group-hover:text-primary-light dark:group-hover:text-primary-dark transition-colors"
          aria-hidden="true"
        />
      </Link>
    )
  }
]

export function AdminOrdersClient({ orders }: { orders: OrderRow[] }) {
  const [filter, setFilter] = useState<Filter>('ALL')

  // Stat-card values
  const stats = useMemo(() => {
    const confirmed = orders.filter((o) => o.status === 'CONFIRMED')
    return {
      revenue: confirmed.reduce((s, o) => s + o.totalAmount, 0),
      confirmedCount: confirmed.length,
      needsShipping: orders.filter((o) => o.status === 'CONFIRMED' && o.shippingStatus === 'PENDING_FULFILLMENT')
        .length,
      failed: orders.filter((o) => o.status === 'FAILED').length
    }
  }, [orders])

  // Per-type counts for the filter tabs
  const counts = useMemo(() => {
    const base = Object.fromEntries(FILTERS.map((f) => [f, 0])) as Record<Filter, number>
    base.ALL = orders.length
    for (const o of orders) {
      if (o.type in base) base[o.type as Filter]++
    }
    return base
  }, [orders])

  const visible = useMemo(() => {
    if (filter === 'ALL') return orders
    return orders.filter((o) => o.type === filter)
  }, [orders, filter])

  return (
    <main id="main-content" className="min-h-screen w-full bg-bg-light dark:bg-bg-dark">
      {/* ── Header ── */}
      <AdminPageHeader title="Orders" count={{ value: orders.length, noun: 'order' }} />

      <div className="w-full px-4 sm:px-6 py-6 space-y-6">
        {/* ── Stats ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <Stat icon={DollarSign} label="Revenue" value={fmtCurrency(stats.revenue)} accent />
          <Stat icon={Package} label="Confirmed Orders" value={String(stats.confirmedCount)} />
          <Stat icon={Truck} label="Needs Shipping" value={String(stats.needsShipping)} />
          <Stat icon={XCircle} label="Failed" value={String(stats.failed)} />
        </div>

        {/* ── Filter tabs ── */}
        <AdminFilterTabs
          options={FILTERS}
          value={filter}
          onChange={setFilter}
          counts={counts}
          labels={FILTER_LABELS}
          label="Filter orders by type"
        />

        {/* ── Table ── */}
        <AdminTable
          columns={columns}
          rows={visible}
          rowKey={(o) => o.id}
          caption="All orders, newest first"
          emptyMessage={`No ${FILTER_LABELS[filter].toLowerCase()} orders`}
          rowClassName={(o) =>
            o.status === 'CONFIRMED' && o.shippingStatus === 'PENDING_FULFILLMENT'
              ? 'group border-l-2 border-l-amber-500 hover:bg-amber-500/5 transition-colors'
              : 'group hover:bg-primary-light/5 dark:hover:bg-primary-dark/5 transition-colors'
          }
        />
      </div>
    </main>
  )
}
