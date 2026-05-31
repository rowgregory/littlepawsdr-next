'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import {
  RefreshCw,
  ShoppingBag,
  Heart,
  Shirt,
  Users,
  Mail,
  PawPrint,
  CheckCircle,
  Clock,
  Copy,
  Check,
  ArrowUpRight,
  LayoutDashboard,
  Gavel,
  TrendingUp,
  TrendingDown
} from 'lucide-react'
import { markOrderShipped } from 'app/lib/actions/order/markOrderShipped'
import { AdoptionFeeDay, PendingShipment, Props } from 'types/dashboard.types'

// ─── Helpers ─────────────────────────────────────────────────────────────────

const fmt = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)
const fmtDate = (iso: string) => new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
const fmtType = (t: string) =>
  t
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase())

// ─── Nav ─────────────────────────────────────────────────────────────────────

const NAV = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Orders', href: '/admin/orders', icon: ShoppingBag },
  { label: 'Dachshunds', href: '/admin/dachshunds', icon: PawPrint },
  { label: 'Auctions', href: '/admin/auctions', icon: Gavel },
  { label: 'Wieners', href: '/admin/welcome-wieners', icon: Heart },
  { label: 'Products', href: '/admin/products', icon: Shirt },
  { label: 'Users', href: '/admin/users', icon: Users },
  { label: 'Newsletter', href: '/admin/newsletter', icon: Mail }
]

// ─── Section header ───────────────────────────────────────────────────────────

function SectionHead({ label, action }: { label: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between px-3 py-1.5 border-b border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark shrink-0">
      <p className="font-mono text-[8px] tracking-[0.22em] uppercase text-muted-light dark:text-muted-dark">[ {label} ]</p>
      {action}
    </div>
  )
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="font-mono text-[8px] tracking-[0.12em] uppercase text-muted-light dark:text-muted-dark hover:text-primary-light dark:hover:text-primary-dark transition-colors flex items-center gap-0.5"
    >
      {children} <ArrowUpRight size={8} />
    </Link>
  )
}

// ─── Adoption fee heatmap ─────────────────────────────────────────────────────

function AdoptionHeatmap({ data }: { data: AdoptionFeeDay[] }) {
  const [hovered, setHovered] = useState<AdoptionFeeDay | null>(null)

  // Build a 16-week grid (112 days), Sunday-anchored
  const grid = useMemo(() => {
    const map = new Map(data.map((d) => [d.date, d]))
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    // go back to last Sunday
    const startDay = new Date(today)
    startDay.setDate(today.getDate() - today.getDay() - 7 * 15)

    const weeks: { date: string; count: number; amount: number }[][] = []
    let week: { date: string; count: number; amount: number }[] = []

    for (let i = 0; i < 112; i++) {
      const d = new Date(startDay)
      d.setDate(startDay.getDate() + i)
      const key = d.toISOString().slice(0, 10)
      const entry = map.get(key) ?? { date: key, count: 0, amount: 0 }
      week.push(entry)
      if (week.length === 7) {
        weeks.push(week)
        week = []
      }
    }
    return weeks
  }, [data])

  const maxCount = Math.max(...data.map((d) => d.count), 1)

  function cellColor(count: number) {
    if (count === 0) return 'bg-border-light dark:bg-border-dark'
    const intensity = count / maxCount
    if (intensity < 0.25) return 'bg-cyan-900 dark:bg-cyan-900'
    if (intensity < 0.5) return 'bg-cyan-700 dark:bg-cyan-700'
    if (intensity < 0.75) return 'bg-cyan-500 dark:bg-cyan-500'
    return 'bg-primary-light dark:bg-primary-dark'
  }

  const dayLabels = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

  // Month labels — find first cell of each month
  const monthLabels = useMemo(() => {
    const labels: { weekIdx: number; label: string }[] = []
    let lastMonth = -1
    grid.forEach((week, wi) => {
      const d = new Date(week[0].date)
      if (d.getMonth() !== lastMonth) {
        labels.push({ weekIdx: wi, label: d.toLocaleDateString('en-US', { month: 'short' }) })
        lastMonth = d.getMonth()
      }
    })
    return labels
  }, [grid])

  return (
    <div className="px-3 py-2 flex flex-col gap-1.5">
      {/* Month labels */}
      <div className="flex gap-px ml-4">
        {grid.map((_, wi) => {
          const lbl = monthLabels.find((m) => m.weekIdx === wi)
          return (
            <div key={wi} className="w-3 shrink-0">
              {lbl && <p className="font-mono text-[7px] text-muted-light dark:text-muted-dark truncate">{lbl.label}</p>}
            </div>
          )
        })}
      </div>
      {/* Grid */}
      <div className="flex gap-0.5">
        {/* Day labels */}
        <div className="flex flex-col gap-px mr-1">
          {dayLabels.map((d, i) => (
            <div key={i} className="w-2.5 h-3 flex items-center justify-center">
              <p className="font-mono text-[6px] text-muted-light dark:text-muted-dark">{i % 2 === 1 ? d : ''}</p>
            </div>
          ))}
        </div>
        {grid.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-px">
            {week.map((cell) => (
              <div
                key={cell.date}
                className={`w-3 h-3 cursor-default transition-opacity hover:opacity-75 ${cellColor(cell.count)}`}
                onMouseEnter={() => setHovered(cell)}
                onMouseLeave={() => setHovered(null)}
              />
            ))}
          </div>
        ))}
      </div>
      {/* Tooltip / legend row */}
      <div className="flex items-center justify-between mt-0.5">
        <div className="h-4">
          {hovered && hovered.count > 0 && (
            <p className="font-mono text-[8px] tracking-[0.06em] text-muted-light dark:text-muted-dark">
              {fmtDate(hovered.date)} ·{' '}
              <span className="text-text-light dark:text-text-dark">
                {hovered.count} fee{hovered.count !== 1 ? 's' : ''}
              </span>{' '}
              · <span className="text-primary-light dark:text-primary-dark">{fmt(hovered.amount)}</span>
            </p>
          )}
        </div>
        <div className="flex items-center gap-0.5">
          <p className="font-mono text-[7px] text-muted-light dark:text-muted-dark mr-1">Less</p>
          {['bg-border-light dark:bg-border-dark', 'bg-cyan-900', 'bg-cyan-700', 'bg-cyan-500', 'bg-primary-light dark:bg-primary-dark'].map(
            (c, i) => (
              <div key={i} className={`w-2.5 h-2.5 ${c}`} />
            )
          )}
          <p className="font-mono text-[7px] text-muted-light dark:text-muted-dark ml-1">More</p>
        </div>
      </div>
    </div>
  )
}

// ─── Shipment row ─────────────────────────────────────────────────────────────

function ShipmentRow({ shipment, onMarkSent }: { shipment: PendingShipment; onMarkSent: (id: string) => void }) {
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleMark() {
    setLoading(true)
    setError(null)
    const result = await markOrderShipped(shipment.id)
    if (result.success) {
      setSent(true)
      onMarkSent(shipment.id)
    } else {
      setError('Failed — try again')
      setLoading(false)
    }
  }

  if (sent)
    return (
      <div className="flex items-center gap-2 py-2 border-b border-border-light dark:border-border-dark last:border-b-0 opacity-40">
        <CheckCircle size={10} className="text-green-500 shrink-0" />
        <span className="font-mono text-[9px] tracking-[0.06em] text-muted-light dark:text-muted-dark line-through truncate">{shipment.name}</span>
      </div>
    )

  return (
    <div className="py-2 border-b border-border-light dark:border-border-dark last:border-b-0 flex flex-col gap-1">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="font-quicksand font-black text-[12px] text-text-light dark:text-text-dark truncate">{shipment.name}</p>
          <p className="font-mono text-[8px] tracking-[0.04em] text-muted-light dark:text-muted-dark truncate">{shipment.items}</p>
        </div>
        <p className="font-quicksand font-black text-[12px] text-text-light dark:text-text-dark shrink-0">{fmt(shipment.total)}</p>
      </div>
      <p className="font-mono text-[7px] tracking-[0.04em] text-muted-light dark:text-muted-dark leading-snug">{shipment.address}</p>
      {error && <p className="font-mono text-[7px] text-red-500">{error}</p>}
      <div className="flex items-center justify-between">
        <span className="font-mono text-[7px] tracking-[0.06em] text-muted-light dark:text-muted-dark flex items-center gap-1">
          <Clock size={7} />
          {fmtDate(shipment.createdAt)}
        </span>
        <button
          onClick={handleMark}
          disabled={loading}
          className="flex items-center gap-1 font-mono text-[7px] tracking-[0.12em] uppercase px-2 py-0.5 bg-primary-light dark:bg-primary-dark text-white hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {loading ? <RefreshCw size={7} className="animate-spin" /> : <CheckCircle size={7} />}
          {loading ? 'Saving...' : 'Mark sent'}
        </button>
      </div>
    </div>
  )
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  async function handleCopy() {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1 font-mono text-[8px] tracking-widest uppercase px-2 py-0.5 border border-border-light dark:border-border-dark text-muted-light dark:text-muted-dark hover:text-text-light dark:hover:text-text-dark transition-colors"
    >
      {copied ? <Check size={8} /> : <Copy size={8} />}
      {copied ? 'Copied' : 'Copy list'}
    </button>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function AdminDashboardClient({ stats, dachshunds = [], pendingShipments = [] }: Props) {
  const [refreshing, setRefreshing] = useState(false)
  const [shipments, setShipments] = useState(pendingShipments)
  const pendingCount = shipments.length
  const monthlyDelta = stats.monthlyChange >= 0
  const sortedWieners = [...(stats.welcomeWienerRevenue ?? [])].sort((a, b) => b.totalRaised - a.totalRaised)
  const wienerTotal = stats.welcomeWienerRevenue?.reduce((s, w) => s + w.totalRaised, 0) ?? 0

  // Footer live counts
  const availableDogs = dachshunds.filter((d) => d.status === 'Available').length
  const pendingDogs = dachshunds.filter((d) => d.status === 'Pending').length

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-bg-light dark:bg-bg-dark">
      {/* ── Topbar ── */}
      <header className="shrink-0 bg-navbar-light dark:bg-navbar-dark border-b border-border-light dark:border-border-dark px-4 flex items-center justify-between h-10">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 shrink-0">
            <PawPrint size={12} className="text-primary-light dark:text-primary-dark" />
            <span className="font-mono text-[9px] tracking-[0.2em] uppercase text-on-dark">Little Paws</span>
            <span className="font-mono text-[8px] text-muted-dark mx-1">·</span>
            <span className="font-mono text-[8px] tracking-[0.15em] uppercase text-on-dark opacity-60">Admin</span>
          </div>
          <nav className="flex items-center">
            {NAV.map(({ label, href, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-1 px-2.5 py-1 font-mono text-[8px] tracking-widest uppercase text-on-dark hover:text-white hover:bg-white/5 transition-colors border-r border-white/10 first:border-l"
              >
                <Icon size={9} aria-hidden="true" />
                {label}
              </Link>
            ))}
          </nav>
        </div>
        <button
          onClick={() => {
            setRefreshing(true)
            setTimeout(() => setRefreshing(false), 1200)
          }}
          className="flex items-center gap-1 font-mono text-[8px] tracking-[0.12em] uppercase text-on-dark hover:text-white transition-colors"
        >
          <RefreshCw size={9} className={refreshing ? 'animate-spin' : ''} />
          Refresh
        </button>
      </header>

      {/* ── Three-column body ── */}
      <div className="flex-1 flex overflow-hidden">
        {/* ══ LEFT: Revenue & Orders by type ══ */}
        <div className="w-52 shrink-0 border-r border-border-light dark:border-border-dark flex flex-col overflow-hidden">
          {/* Revenue totals */}
          <SectionHead label="Revenue" />
          <div className="shrink-0 border-b border-border-light dark:border-border-dark">
            <div className="px-3 py-2.5 border-b border-border-light dark:border-border-dark">
              <p className="font-mono text-[7px] tracking-[0.15em] uppercase text-muted-light dark:text-muted-dark">All time</p>
              <p className="font-quicksand font-black text-2xl text-text-light dark:text-text-dark leading-none mt-0.5">{fmt(stats.totalRevenue)}</p>
            </div>
            <div className="grid grid-cols-2">
              <div className="px-3 py-2 border-r border-border-light dark:border-border-dark">
                <p className="font-mono text-[7px] tracking-[0.12em] uppercase text-muted-light dark:text-muted-dark">This month</p>
                <p className="font-quicksand font-black text-[15px] text-text-light dark:text-text-dark leading-none mt-0.5">
                  {fmt(stats.thisMonthRevenue)}
                </p>
              </div>
              <div className="px-3 py-2">
                <p className="font-mono text-[7px] tracking-[0.12em] uppercase text-muted-light dark:text-muted-dark">Last month</p>
                <p className="font-quicksand font-black text-[15px] text-muted-light dark:text-muted-dark leading-none mt-0.5">
                  {fmt(stats.lastMonthRevenue)}
                </p>
              </div>
            </div>
            <div className="px-3 py-1.5 border-t border-border-light dark:border-border-dark flex items-center gap-1">
              {monthlyDelta ? <TrendingUp size={9} className="text-green-500" /> : <TrendingDown size={9} className="text-red-500" />}
              <p className={`font-mono text-[8px] tracking-widest ${monthlyDelta ? 'text-green-500' : 'text-red-500'}`}>
                {monthlyDelta ? '+' : ''}
                {stats.monthlyChange}% vs last month
              </p>
            </div>
          </div>

          {/* Orders by type */}
          <SectionHead label="By source" />
          <div className="flex-1 overflow-y-auto">
            {(stats.ordersByType ?? []).map(({ type, count, total }) => (
              <div
                key={type}
                className="px-3 py-2 border-b border-border-light dark:border-border-dark last:border-b-0 hover:bg-surface-light dark:hover:bg-surface-dark transition-colors"
              >
                <div className="flex items-center justify-between mb-0.5">
                  <p className="font-mono text-[8px] tracking-widest uppercase text-muted-light dark:text-muted-dark truncate pr-2">
                    {fmtType(type)}
                  </p>
                  <p className="font-mono text-[8px] text-muted-light dark:text-muted-dark shrink-0">{count}×</p>
                </div>
                <p className="font-quicksand font-black text-[14px] text-text-light dark:text-text-dark leading-none">{fmt(total)}</p>
              </div>
            ))}
          </div>

          {/* Newsletter at bottom of left col */}
          <div className="shrink-0 border-t border-border-light dark:border-border-dark">
            <SectionHead label="Newsletter" action={<NavLink href="/admin/newsletter">Manage</NavLink>} />
            <div className="px-3 py-2 flex items-center justify-between">
              <div>
                <p className="font-quicksand font-black text-xl text-text-light dark:text-text-dark leading-none">
                  {stats.newsletterCount.toLocaleString()}
                </p>
                <p className="font-mono text-[7px] tracking-[0.12em] uppercase text-muted-light dark:text-muted-dark mt-0.5">Subscribers</p>
              </div>
              <CopyButton text="[subscriber emails]" />
            </div>
          </div>
        </div>

        {/* ══ CENTER: Dachshunds ══ */}
        <div className="flex-1 flex flex-col overflow-hidden border-r border-border-light dark:border-border-dark min-w-0">
          <SectionHead label={`Dachshunds · ${dachshunds.length}`} action={<NavLink href="/admin/dachshunds">View all</NavLink>} />
          <div className="flex-1 overflow-y-auto">
            {dachshunds.length === 0 ? (
              <p className="px-3 py-4 font-mono text-[9px] tracking-widest text-muted-light dark:text-muted-dark">No dogs found</p>
            ) : (
              dachshunds.map((dog) => (
                <div
                  key={dog.id}
                  className="flex items-center justify-between px-3 py-2.5 border-b border-border-light dark:border-border-dark last:border-b-0 hover:bg-surface-light dark:hover:bg-surface-dark transition-colors"
                >
                  <div className="min-w-0">
                    <p className="font-quicksand font-black text-[14px] text-text-light dark:text-text-dark truncate">{dog.name}</p>
                    <p className="font-mono text-[8px] tracking-[0.06em] text-muted-light dark:text-muted-dark mt-0.5">
                      {dog.age} · {dog.sex}
                    </p>
                  </div>
                  <span
                    className={`font-mono text-[7px] tracking-[0.12em] uppercase px-1.5 py-0.5 text-white shrink-0 ml-2 ${dog.status === 'Pending' ? 'bg-amber-500' : 'bg-primary-light dark:bg-primary-dark'}`}
                  >
                    {dog.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* ══ RIGHT: Adoption fees + Shipments + Orders + Wieners ══ */}
        <div className="w-80 shrink-0 flex flex-col overflow-hidden">
          {/* Adoption fee heatmap */}
          <div className="shrink-0 border-b border-border-light dark:border-border-dark">
            <SectionHead label="Adoption fees" action={<NavLink href="/admin/orders">View all</NavLink>} />
            <div className="px-3 pt-2 pb-1 grid grid-cols-3 border-b border-border-light dark:border-border-dark">
              <div>
                <p className="font-mono text-[7px] tracking-[0.12em] uppercase text-muted-light dark:text-muted-dark">All time</p>
                <p className="font-quicksand font-black text-lg text-text-light dark:text-text-dark leading-none mt-0.5">
                  {fmt(stats.totalAdoptionRevenue)}
                </p>
              </div>
              <div>
                <p className="font-mono text-[7px] tracking-[0.12em] uppercase text-muted-light dark:text-muted-dark">This month</p>
                <p className="font-quicksand font-black text-lg text-text-light dark:text-text-dark leading-none mt-0.5">
                  {stats.adoptionFeesThisMonth}
                </p>
                <p className="font-mono text-[7px] text-muted-light dark:text-muted-dark">applications</p>
              </div>
              <div>
                <p className="font-mono text-[7px] tracking-[0.12em] uppercase text-muted-light dark:text-muted-dark">Total fees</p>
                <p className="font-quicksand font-black text-lg text-text-light dark:text-text-dark leading-none mt-0.5">{stats.totalAdoptionFees}</p>
                <p className="font-mono text-[7px] text-muted-light dark:text-muted-dark">applications</p>
              </div>
            </div>
            <AdoptionHeatmap data={stats.adoptionFeeHeatmap ?? []} />
          </div>

          {/* Needs shipping */}
          <div className="shrink-0 border-b border-border-light dark:border-border-dark">
            <SectionHead
              label="Needs shipping"
              action={
                pendingCount > 0 ? (
                  <span className="font-mono text-[7px] tracking-widest uppercase px-1.5 py-0.5 bg-amber-500 text-white">{pendingCount} pending</span>
                ) : (
                  <span className="font-mono text-[7px] tracking-widest uppercase text-green-500">All clear</span>
                )
              }
            />
            <div className="px-3 max-h-36 overflow-y-auto">
              {pendingCount === 0 ? (
                <div className="py-3 flex items-center gap-2">
                  <CheckCircle size={12} className="text-green-500" />
                  <p className="font-mono text-[9px] tracking-widest text-muted-light dark:text-muted-dark">All orders shipped!</p>
                </div>
              ) : (
                shipments.map((s) => (
                  <ShipmentRow key={s.id} shipment={s} onMarkSent={(id) => setShipments((prev) => prev.filter((x) => x.id !== id))} />
                ))
              )}
            </div>
          </div>

          {/* Recent orders */}
          <div className="shrink-0 border-b border-border-light dark:border-border-dark">
            <SectionHead label="Recent orders" action={<NavLink href="/admin/orders">View all</NavLink>} />
            <div className="max-h-36 overflow-y-auto">
              {stats.recentOrders.length === 0 ? (
                <p className="px-3 py-3 font-mono text-[9px] tracking-widest text-muted-light dark:text-muted-dark">No orders yet</p>
              ) : (
                stats.recentOrders.map((o) => (
                  <div
                    key={o.id}
                    className="flex items-center justify-between px-3 py-1.5 border-b border-border-light dark:border-border-dark last:border-b-0 hover:bg-surface-light dark:hover:bg-surface-dark transition-colors"
                  >
                    <div className="min-w-0">
                      <p className="font-nunito text-[12px] text-text-light dark:text-text-dark truncate">{o.name}</p>
                      <p className="font-mono text-[7px] tracking-[0.06em] text-muted-light dark:text-muted-dark">{fmtDate(o.createdAt)}</p>
                    </div>
                    <p className="font-quicksand font-black text-[12px] text-text-light dark:text-text-dark shrink-0 ml-2">{fmt(o.total)}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Welcome Wiener leaderboard */}
          <div className="flex-1 overflow-hidden flex flex-col">
            <SectionHead label={`Welcome Wieners · ${fmt(wienerTotal)}`} action={<NavLink href="/admin/welcome-wieners">Manage</NavLink>} />
            <div className="flex-1 overflow-y-auto">
              {sortedWieners.length === 0 ? (
                <p className="px-3 py-3 font-mono text-[9px] tracking-widest text-muted-light dark:text-muted-dark">No data yet</p>
              ) : (
                sortedWieners.map((w, i) => {
                  const max = sortedWieners[0].totalRaised
                  const width = max ? Math.round((w.totalRaised / max) * 100) : 0
                  return (
                    <div
                      key={w.id}
                      className="px-3 py-2 border-b border-border-light dark:border-border-dark last:border-b-0 hover:bg-surface-light dark:hover:bg-surface-dark transition-colors"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <span className="font-mono text-[7px] text-muted-light dark:text-muted-dark w-3 shrink-0">{i + 1}</span>
                          <span className="font-quicksand font-black text-[12px] text-text-light dark:text-text-dark truncate">{w.name}</span>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0 ml-2">
                          <span className="font-mono text-[7px] text-muted-light dark:text-muted-dark">{w.sponsorCount}×</span>
                          <span className="font-quicksand font-black text-[12px] text-text-light dark:text-text-dark">{fmt(w.totalRaised)}</span>
                        </div>
                      </div>
                      <div className="h-px w-full bg-border-light dark:bg-border-dark">
                        <div className="h-px bg-primary-light dark:bg-primary-dark" style={{ width: `${width}%` }} />
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Footer status strip ── */}
      <footer className="shrink-0 bg-navbar-light dark:bg-navbar-dark border-t border-border-light dark:border-border-dark px-4 h-7 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="font-mono text-[8px] tracking-widest text-on-dark">
            Little Paws · {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
          </span>
          <span className="text-white/20">·</span>
          <span className="font-mono text-[8px] tracking-widest text-on-dark">
            Dogs · <span className="text-white">{availableDogs} available</span>
            {pendingDogs > 0 && <span className="text-amber-400"> · {pendingDogs} pending</span>}
          </span>
          <span className="text-white/20">·</span>
          <span className="font-mono text-[8px] tracking-widest text-on-dark">
            Auctions · <span className="text-white">{stats.activeAuctions} live</span>
          </span>
          <span className="text-white/20">·</span>
          <span className="font-mono text-[8px] tracking-widest text-on-dark">
            Wieners · <span className="text-white">{stats.welcomeWienerCount} active</span>
          </span>
          <span className="text-white/20">·</span>
          <span className="font-mono text-[8px] tracking-widest text-on-dark">
            Shipping ·{' '}
            {pendingCount > 0 ? <span className="text-amber-400">{pendingCount} pending</span> : <span className="text-green-400">all clear</span>}
          </span>
        </div>
        <span className="font-mono text-[8px] tracking-widest text-on-dark opacity-50">sqysh</span>
      </footer>
    </div>
  )
}
