'use client'

import { useState, useMemo } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { TrendingUp, DollarSign, ShoppingBag, Heart, Gavel, Dog, Package, ArrowUpRight, ArrowDownRight, Gift } from 'lucide-react'
import { IOrder } from 'types/entities/order'
import { formatMoney } from 'app/utils/currency.utils'
import AdminPageHeader from '../common/AdminPageHeader'
import { formatDate } from 'app/utils/date.utils'
import { OrderStatus, OrderType } from '@prisma/client'
import { StatusPill } from '../ui/StatusPill'
import { useRouter } from 'next/navigation'
import { store } from 'app/lib/store/store'
import { showToast } from 'app/lib/store/slices/toastSlice'
import { updateOrderShippingStatus } from 'app/lib/actions/updateOrderShippingStatus'
import { setOpenOrderDrawer } from 'app/lib/store/slices/uiSlice'

// ─── Types ────────────────────────────────────────────────────────────────────
type Tab = 'Snapshot'

// ─── Config ───────────────────────────────────────────────────────────────────
const ORDER_TYPE_CONFIG: Record<OrderType, { label: string; icon: React.ElementType; color: string; bg: string }> = {
  ONE_TIME_DONATION: { label: 'One-Time Donation', icon: Heart, color: 'text-pink-500', bg: 'bg-pink-500/10' },
  RECURRING_DONATION: { label: 'Recurring Donation', icon: TrendingUp, color: 'text-violet-500', bg: 'bg-violet-500/10' },
  ADOPTION_FEE: { label: 'Adoption Fee', icon: Dog, color: 'text-amber-500', bg: 'bg-amber-500/10' },
  AUCTION_PURCHASE: {
    label: 'Auction',
    icon: Gavel,
    color: 'text-primary-light dark:text-primary-dark',
    bg: 'bg-primary-light/10 dark:bg-primary-dark/10'
  },
  PRODUCT: { label: 'Merch', icon: ShoppingBag, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  WELCOME_WIENER: { label: 'Welcome Wiener', icon: Package, color: 'text-orange-500', bg: 'bg-orange-500/10' },
  MIXED: { label: 'Mixed', icon: Gift, color: 'text-fuchsia-500', bg: 'bg-fuchsia-500/10' }
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  iconColor,
  iconBg,
  delay = 0,
  trend
}: {
  label: string
  value: string
  sub?: string
  icon: React.ElementType
  iconColor: string
  iconBg: string
  delay?: number
  trend?: { value: number; label: string }
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="border border-border-light dark:border-border-dark bg-bg-light dark:bg-bg-dark p-5"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-9 h-9 flex items-center justify-center ${iconBg}`}>
          <Icon size={16} className={iconColor} aria-hidden="true" />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-[10px] font-mono ${trend.value >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
            {trend.value >= 0 ? <ArrowUpRight size={11} aria-hidden="true" /> : <ArrowDownRight size={11} aria-hidden="true" />}
            {Math.abs(trend.value)}%
          </div>
        )}
      </div>
      <p className="text-2xl font-black text-text-light dark:text-text-dark font-quicksand leading-none mb-1.5">{value}</p>
      <p className="text-[10px] font-mono tracking-[0.15em] uppercase text-muted-light dark:text-muted-dark">{label}</p>
      {sub && <p className="text-xs font-mono text-muted-light/70 dark:text-muted-dark/70 mt-1">{sub}</p>}
    </motion.div>
  )
}

// ─── Type Breakdown Row ───────────────────────────────────────────────────────
function TypeBreakdownRow({
  type,
  count,
  total,
  maxTotal,
  delay
}: {
  type: OrderType
  count: number
  total: number
  maxTotal: number
  delay: number
}) {
  const config = ORDER_TYPE_CONFIG[type]
  const Icon = config.icon
  const pct = maxTotal > 0 ? (total / maxTotal) * 100 : 0

  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.35, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="flex items-center gap-4 py-3.5 border-b border-border-light dark:border-border-dark last:border-0"
    >
      <div className={`w-8 h-8 flex items-center justify-center shrink-0 ${config.bg}`}>
        <Icon size={14} className={config.color} aria-hidden="true" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1.5">
          <p className="text-xs font-semibold text-text-light dark:text-text-dark">{config.label}</p>
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-mono text-muted-light dark:text-muted-dark">{count} orders</span>
            <span className="text-xs font-black font-mono text-text-light dark:text-text-dark">{formatMoney(total)}</span>
          </div>
        </div>
        {/* Progress bar */}
        <div className="h-1 bg-surface-light dark:bg-surface-dark overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.6, delay: delay + 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
            className={`h-full ${config.bg.replace('/10', '/60')}`}
          />
        </div>
      </div>
    </motion.div>
  )
}

// ─── Recent Orders Row ────────────────────────────────────────────────────────
function RecentOrderRow({ order, index }: { order: IOrder; index: number }) {
  const config = ORDER_TYPE_CONFIG[order.type]
  const Icon = config.icon
  const name = [order.user?.firstName, order.user?.lastName].filter(Boolean).join(' ') || order.user?.email || 'Guest'

  return (
    <motion.tr
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2, delay: index * 0.04 }}
      className="border-b border-border-light dark:border-border-dark last:border-0 hover:bg-surface-light dark:hover:bg-surface-dark transition-colors duration-150"
    >
      <td className="px-5 py-3.5">
        <div className="flex items-center gap-2.5">
          <div className={`w-7 h-7 flex items-center justify-center shrink-0 ${config.bg}`}>
            <Icon size={12} className={config.color} aria-hidden="true" />
          </div>
          <div>
            <p className="text-xs font-semibold text-text-light dark:text-text-dark leading-snug">{name}</p>
            <p className="text-[10px] font-mono text-muted-light dark:text-muted-dark mt-0.5">{config.label}</p>
          </div>
        </div>
      </td>
      <td className="px-5 py-3.5 whitespace-nowrap">
        <span
          className={`text-[9px] font-black tracking-widest uppercase px-2 py-1 ${
            order.status === ('CONFIRMED' as OrderStatus)
              ? 'bg-emerald-500/10 text-emerald-500'
              : order.status === 'PENDING'
                ? 'bg-amber-500/10 text-amber-500'
                : 'bg-red-500/10 text-red-500'
          }`}
        >
          {order.status}
        </span>
      </td>
      <td className="px-5 py-3.5 whitespace-nowrap text-right">
        <span className="text-xs font-black font-mono text-text-light dark:text-text-dark">{formatMoney(order.totalAmount)}</span>
      </td>
      <td className="px-5 py-3.5 whitespace-nowrap text-right">
        <span className="text-[10px] font-mono text-muted-light dark:text-muted-dark">{formatDate(order.createdAt)}</span>
      </td>
    </motion.tr>
  )
}

// ─── Snapshot Tab ─────────────────────────────────────────────────────────────
function SnapshotTab({ orders }: { orders: IOrder[] }) {
  const stats = useMemo(() => {
    const completed = orders.filter((o) => ['CONFIRMED', 'PAID'].includes(o.status))
    const totalRevenue = completed.reduce((sum, o) => sum + o.totalAmount, 0)
    const totalOrders = orders.length

    const byType = Object.keys(ORDER_TYPE_CONFIG).reduce(
      (acc, type) => {
        const typeOrders = completed.filter((o) => o.type === (type as OrderType))
        acc[type as OrderType] = {
          count: typeOrders.length,
          total: typeOrders.reduce((sum, o) => sum + o.totalAmount, 0)
        }
        return acc
      },
      {} as Record<OrderType, { count: number; total: number }>
    )

    const maxTotal = Math.max(...Object.values(byType).map((v) => v.total))

    const donations = (byType.ONE_TIME_DONATION?.total ?? 0) + (byType.RECURRING_DONATION?.total ?? 0)
    const commerce = (byType.AUCTION_PURCHASE?.total ?? 0) + (byType.PRODUCT?.total ?? 0) + (byType.WELCOME_WIENER?.total ?? 0)

    const recent = [...orders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 10)

    return { totalRevenue, totalOrders, byType, maxTotal, donations, commerce, recent }
  }, [orders])

  return (
    <div className="space-y-6">
      {/* ── Top stats ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-border-light dark:bg-border-dark border border-border-light dark:border-border-dark">
        <StatCard
          label="Total Revenue"
          value={formatMoney(stats.totalRevenue)}
          icon={DollarSign}
          iconColor="text-primary-light dark:text-primary-dark"
          iconBg="bg-primary-light/10 dark:bg-primary-dark/10"
          delay={0}
        />
        <StatCard
          label="Total Orders"
          value={stats.totalOrders.toString()}
          icon={ShoppingBag}
          iconColor="text-violet-500"
          iconBg="bg-violet-500/10"
          delay={0.06}
        />
        <StatCard
          label="Donations"
          value={formatMoney(stats.donations)}
          sub="one-time + recurring"
          icon={Heart}
          iconColor="text-pink-500"
          iconBg="bg-pink-500/10"
          delay={0.12}
        />
        <StatCard
          label="Commerce"
          value={formatMoney(stats.commerce)}
          sub="auctions + merch + wieners"
          icon={Gavel}
          iconColor="text-emerald-500"
          iconBg="bg-emerald-500/10"
          delay={0.18}
        />
      </div>

      {/* ── Bottom two columns ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue by type */}
        <div className="border border-border-light dark:border-border-dark">
          <div className="px-5 py-4 border-b border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark">
            <div className="flex items-center gap-3">
              <span className="block w-4 h-px bg-primary-light dark:bg-primary-dark shrink-0" aria-hidden="true" />
              <h2 className="text-[10px] font-mono tracking-[0.2em] uppercase text-primary-light dark:text-primary-dark">Revenue by Type</h2>
            </div>
          </div>
          <div className="px-5 py-2">
            {(Object.keys(ORDER_TYPE_CONFIG) as OrderType[]).map((type, i) => (
              <TypeBreakdownRow
                key={type}
                type={type}
                count={stats.byType[type]?.count ?? 0}
                total={stats.byType[type]?.total ?? 0}
                maxTotal={stats.maxTotal}
                delay={i * 0.05}
              />
            ))}
          </div>
        </div>

        {/* Recent orders */}
        <div className="border border-border-light dark:border-border-dark">
          <div className="px-5 py-4 border-b border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark">
            <div className="flex items-center gap-3">
              <span className="block w-4 h-px bg-primary-light dark:bg-primary-dark shrink-0" aria-hidden="true" />
              <h2 className="text-[10px] font-mono tracking-[0.2em] uppercase text-primary-light dark:text-primary-dark">Recent Orders</h2>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full" aria-label="Recent orders">
              <thead>
                <tr className="border-b border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark">
                  <th
                    scope="col"
                    className="px-5 py-3 text-left text-[10px] font-mono tracking-[0.15em] uppercase text-muted-light dark:text-muted-dark"
                  >
                    Customer
                  </th>
                  <th
                    scope="col"
                    className="px-5 py-3 text-left text-[10px] font-mono tracking-[0.15em] uppercase text-muted-light dark:text-muted-dark"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-5 py-3 text-right text-[10px] font-mono tracking-[0.15em] uppercase text-muted-light dark:text-muted-dark"
                  >
                    Amount
                  </th>
                  <th
                    scope="col"
                    className="px-5 py-3 text-right text-[10px] font-mono tracking-[0.15em] uppercase text-muted-light dark:text-muted-dark"
                  >
                    Date
                  </th>
                </tr>
              </thead>
              <motion.tbody key="recent" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.15 }}>
                {stats.recent.length > 0 ? (
                  stats.recent.map((order, i) => <RecentOrderRow key={order.id} order={order} index={i} />)
                ) : (
                  <tr>
                    <td colSpan={4} className="px-5 py-12 text-center">
                      <p className="text-xs font-mono text-muted-light dark:text-muted-dark">No orders yet.</p>
                    </td>
                  </tr>
                )}
              </motion.tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

function AllOrdersTab({ orders }: { orders: IOrder[] }) {
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState<string>('ALL')

  const filtered = orders.filter((o) => {
    const matchesSearch =
      !search || o.customerName.toLowerCase().includes(search.toLowerCase()) || o.customerEmail.toLowerCase().includes(search.toLowerCase())
    const matchesType = typeFilter === 'ALL' || o.type === typeFilter
    return matchesSearch && matchesType
  })

  const [shippingOrder, setShippingOrder] = useState<IOrder | null>(null)
  const [shipLoading, setShipLoading] = useState(false)
  const router = useRouter()

  const handleMarkShipped = async () => {
    if (!shippingOrder) return
    setShipLoading(true)
    try {
      const result = await updateOrderShippingStatus({ id: shippingOrder.id, shippingStatus: 'SHIPPED' })
      if (!result.success) throw new Error(result.error ?? 'Failed to update')
      store.dispatch(showToast({ message: `Order marked as shipped`, description: shippingOrder.customerName, type: 'success' }))
      setShippingOrder(null)
      router.refresh()
    } catch (err) {
      store.dispatch(showToast({ message: 'Failed to update shipping status', type: 'error' }))
    } finally {
      setShipLoading(false)
    }
  }

  return (
    <>
      <AnimatePresence>
        {shippingOrder && (
          <>
            <motion.div
              key="ship-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-50"
              onClick={() => setShippingOrder(null)}
              aria-hidden="true"
            />
            <motion.div
              key="ship-modal"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-x-4 top-1/2 -translate-y-1/2 sm:inset-auto sm:left-1/2 sm:-translate-x-1/2 sm:w-full sm:max-w-sm z-50 bg-bg-light dark:bg-bg-dark border border-border-light dark:border-border-dark"
              role="dialog"
              aria-modal="true"
              aria-labelledby="ship-modal-title"
            >
              <div className="px-6 py-5 border-b border-border-light dark:border-border-dark">
                <div className="flex items-center gap-3 mb-1">
                  <span className="block w-4 h-px bg-primary-light dark:bg-primary-dark" aria-hidden="true" />
                  <p className="text-[10px] font-mono tracking-[0.2em] uppercase text-primary-light dark:text-primary-dark">Mark as Shipped</p>
                </div>
                <h2 id="ship-modal-title" className="font-quicksand font-bold text-lg text-text-light dark:text-text-dark">
                  {shippingOrder.customerName}
                </h2>
                <p className="text-[10px] font-mono text-muted-light dark:text-muted-dark mt-0.5">{shippingOrder.customerEmail}</p>
              </div>

              <div className="px-6 py-5 space-y-4">
                {/* Order items */}
                {shippingOrder.items?.length > 0 && (
                  <ul className="space-y-1.5" role="list">
                    {shippingOrder.items.map((item) => (
                      <li key={item.id} className="flex items-center justify-between gap-3 text-xs font-mono" role="listitem">
                        <span className="text-text-light dark:text-text-dark truncate">{item.itemName ?? 'Item'}</span>
                        <span className="text-muted-light dark:text-muted-dark tabular-nums shrink-0">×{item.quantity ?? 1}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {/* Shipping address */}
                {shippingOrder.addressLine1 && (
                  <div className="pt-3 border-t border-border-light dark:border-border-dark">
                    <p className="text-[10px] font-mono tracking-[0.15em] uppercase text-muted-light dark:text-muted-dark mb-1">Ships to</p>
                    <p className="text-xs font-mono text-text-light dark:text-text-dark leading-relaxed">
                      {shippingOrder.addressLine1}
                      {shippingOrder.addressLine2 && `, ${shippingOrder.addressLine2}`}
                      <br />
                      {shippingOrder.city}, {shippingOrder.state} {shippingOrder.zipPostalCode}
                    </p>
                  </div>
                )}

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShippingOrder(null)}
                    className="flex-1 py-3 text-[10px] font-mono tracking-[0.2em] uppercase border-2 border-border-light dark:border-border-dark text-muted-light dark:text-muted-dark hover:border-primary-light dark:hover:border-primary-dark transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark"
                  >
                    Cancel
                  </button>
                  <motion.button
                    type="button"
                    onClick={handleMarkShipped}
                    disabled={shipLoading}
                    whileHover={!shipLoading ? { scale: 1.02 } : {}}
                    whileTap={!shipLoading ? { scale: 0.98 } : {}}
                    className={`flex-1 py-3 text-[10px] font-mono tracking-[0.2em] uppercase transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark flex items-center justify-center gap-2
                ${
                  shipLoading
                    ? 'bg-surface-light dark:bg-surface-dark text-muted-light dark:text-muted-dark border-2 border-border-light dark:border-border-dark cursor-not-allowed'
                    : 'bg-primary-light dark:bg-primary-dark hover:bg-secondary-light dark:hover:bg-secondary-dark text-white cursor-pointer'
                }`}
                  >
                    {shipLoading ? (
                      <motion.span
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="block w-3.5 h-3.5 border-2 border-current/30 border-t-current rounded-full"
                        aria-hidden="true"
                      />
                    ) : (
                      'Mark as Shipped'
                    )}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="border border-border-light dark:border-border-dark overflow-hidden">
        {/* Toolbar */}
        <div className="px-5 py-4 border-b border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark flex flex-col xs:flex-row items-start xs:items-center justify-between gap-3">
          <p className="text-[10px] font-mono tracking-[0.2em] uppercase text-muted-light dark:text-muted-dark shrink-0">
            All Orders
            <span className="ml-2 text-primary-light dark:text-primary-dark">{filtered.length}</span>
          </p>

          <div className="flex items-center gap-2 w-full xs:w-auto flex-wrap">
            {/* Search */}
            <div className="relative flex-1 xs:flex-none">
              <label htmlFor="order-search" className="sr-only">
                Search orders
              </label>
              <input
                id="order-search"
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search name or email..."
                className="w-full xs:w-52 pl-3 pr-3 py-2 text-xs font-mono border border-border-light dark:border-border-dark bg-bg-light dark:bg-bg-dark text-text-light dark:text-text-dark placeholder:text-muted-light/50 dark:placeholder:text-muted-dark/50 transition-colors duration-150 focus:outline-none focus-visible:border-primary-light dark:focus-visible:border-primary-dark"
              />
            </div>

            {/* Type filter */}
            <div className="relative shrink-0">
              <label htmlFor="type-filter" className="sr-only">
                Filter by type
              </label>
              <select
                id="type-filter"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="appearance-none pl-3 pr-8 py-2 text-xs font-mono border border-border-light dark:border-border-dark bg-bg-light dark:bg-bg-dark text-text-light dark:text-text-dark transition-colors duration-150 focus:outline-none focus-visible:border-primary-light dark:focus-visible:border-primary-dark"
              >
                <option value="ALL">All Types</option>
                <option value="ONE_TIME_DONATION">One-Time Donation</option>
                <option value="RECURRING_DONATION">Recurring Donation</option>
                <option value="PRODUCT">Product</option>
                <option value="WELCOME_WIENER">Welcome Wiener</option>
                <option value="MIXED">Mixed</option>
                <option value="AUCTION_PURCHASE">Auction</option>
                <option value="ADOPTION_FEE">Adoption Fee</option>
              </select>
              <svg
                viewBox="0 0 24 24"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-light dark:text-muted-dark pointer-events-none"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="square"
                aria-hidden="true"
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full" role="table" aria-label="All orders">
            <thead>
              <tr className="border-b border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark">
                {['Customer', 'Type', 'Amount', 'Status', 'Shipping', 'Date', ''].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-[10px] font-mono tracking-[0.2em] uppercase text-muted-light dark:text-muted-dark">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-[10px] font-mono text-muted-light dark:text-muted-dark">
                    No orders found.
                  </td>
                </tr>
              ) : (
                filtered.map((order, i) => (
                  <motion.tr
                    onClick={() => store.dispatch(setOpenOrderDrawer(order))}
                    key={order.id}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: i * 0.02 }}
                    className="border-b border-border-light dark:border-border-dark last:border-0 hover:bg-surface-light dark:hover:bg-surface-dark transition-colors duration-150 group"
                  >
                    <td className="px-5 py-3.5">
                      <p className="text-xs font-mono text-text-light dark:text-text-dark truncate max-w-40">{order.customerName}</p>
                      <p className="text-[10px] font-mono text-muted-light dark:text-muted-dark truncate max-w-40">{order.customerEmail}</p>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-[10px] font-mono tracking-[0.15em] uppercase text-muted-light dark:text-muted-dark">
                        {order.type.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-xs font-mono font-bold text-text-light dark:text-text-dark tabular-nums">
                        {formatMoney(order.totalAmount)}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <StatusPill status={order.status} />
                    </td>

                    {/* ── Shipping ── */}
                    <td className="px-5 py-3.5">
                      {order.type === 'PRODUCT' || order.type === 'MIXED' ? (
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-[9px] font-mono tracking-[0.15em] uppercase px-2 py-0.5 border whitespace-nowrap ${
                              order.shippingStatus === 'SHIPPED'
                                ? 'border-primary-light/30 dark:border-primary-dark/30 text-primary-light dark:text-primary-dark'
                                : order.shippingStatus === 'DELIVERED'
                                  ? 'border-green-500/30 text-green-500 dark:text-green-400'
                                  : order.shippingStatus === 'PENDING_PAYMENT_CONFIRMATION'
                                    ? 'border-blue-500/30 text-blue-500 dark:text-blue-400'
                                    : 'border-yellow-500/30 text-yellow-500 dark:text-yellow-400'
                            }`}
                          >
                            {order.shippingStatus === 'SHIPPED'
                              ? 'Shipped'
                              : order.shippingStatus === 'DELIVERED'
                                ? 'Delivered'
                                : order.shippingStatus === 'PENDING_PAYMENT_CONFIRMATION'
                                  ? 'Awaiting Payment'
                                  : 'Pending'}
                          </span>
                          {order.shippingStatus !== 'SHIPPED' && order.shippingStatus !== 'DELIVERED' && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation()
                                setShippingOrder(order)
                              }}
                              aria-label={`Mark order for ${order.customerName} as shipped`}
                              className="text-[10px] font-mono tracking-[0.2em] uppercase text-muted-light dark:text-muted-dark hover:text-primary-light dark:hover:text-primary-dark transition-colors focus:outline-none focus-visible:underline focus-visible:opacity-100 whitespace-nowrap"
                            >
                              Ship →
                            </button>
                          )}
                          {order.shippingStatus === 'SHIPPED' && (
                            <span className="text-[9px] font-mono text-muted-light dark:text-muted-dark whitespace-nowrap">
                              {formatDate(order.updatedAt)}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-[10px] font-mono text-muted-light/40 dark:text-muted-dark/40">—</span>
                      )}
                    </td>

                    {/* ── Date ── */}
                    <td className="px-5 py-3.5">
                      <span className="text-[10px] font-mono text-muted-light dark:text-muted-dark whitespace-nowrap">
                        {formatDate(order.createdAt)}
                      </span>
                    </td>

                    {/* ── View ── */}
                    <td className="px-5 py-3.5 text-right">
                      <div
                        aria-label={`View order for ${order.customerName}`}
                        className="text-[10px] font-mono tracking-[0.2em] uppercase text-muted-light dark:text-muted-dark hover:text-primary-light dark:hover:text-primary-dark transition-colors focus:outline-none focus-visible:underline focus-visible:opacity-100 cursor-pointer"
                      >
                        View →
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────
type TabType = 'Snapshot' | 'All Orders'

export default function AdminOrdersClient({ orders }: { orders: IOrder[] }) {
  const [activeTab, setActiveTab] = useState<TabType>('Snapshot')

  return (
    <>
      <AdminPageHeader label="Admin" title="Orders" description="All revenue across donations, auctions, merch, and welcome wieners" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* ── Tabs ── */}
        <div
          role="tablist"
          aria-label="Orders sections"
          className="flex items-center gap-px bg-border-light dark:bg-border-dark border border-border-light dark:border-border-dark w-fit mb-6"
        >
          {(['Snapshot', 'All Orders'] as Tab[]).map((tab) => (
            <button
              key={tab}
              role="tab"
              id={`tab-${tab}`}
              aria-selected={activeTab === tab}
              aria-controls={`panel-${tab}`}
              onClick={() => setActiveTab(tab)}
              className={`relative px-5 py-2.5 text-[10px] font-mono tracking-[0.2em] uppercase transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark
                ${
                  activeTab === tab
                    ? 'text-text-light dark:text-text-dark bg-bg-light dark:bg-bg-dark'
                    : 'text-muted-light dark:text-muted-dark bg-bg-light dark:bg-bg-dark hover:text-text-light dark:hover:text-text-dark'
                }`}
            >
              {activeTab === tab && (
                <motion.span
                  layoutId="orders-tab-indicator"
                  className="absolute inset-x-0 bottom-0 h-0.5 bg-primary-light dark:bg-primary-dark"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  aria-hidden="true"
                />
              )}
              {tab}
            </button>
          ))}
        </div>

        {/* ── Panel ── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            role="tabpanel"
            id={`panel-${activeTab}`}
            aria-labelledby={`tab-${activeTab}`}
          >
            {activeTab === 'Snapshot' && <SnapshotTab orders={orders} />}
            {activeTab === 'All Orders' && <AllOrdersTab orders={orders} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </>
  )
}
