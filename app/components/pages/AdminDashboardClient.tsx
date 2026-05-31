'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface RecentOrder {
  id: string
  total: number
  createdAt: string
  name: string
}

interface MonthData {
  label: string
  orders: number
  adoptions: number
}

interface DashboardStats {
  totalRevenue: number
  totalOrderRevenue: number
  totalAdoptionRevenue: number
  auctionRevenue: number
  thisMonthRevenue: number
  lastMonthRevenue: number
  monthlyChange: number | null
  activeAuctions: number
  totalUsers: number
  newThisMonth: number
  newsletterCount: number
  welcomeWienerCount: number
  productCount: number
  bypassCode: string | null
  bypassCodeRotatesAt: string | null
  monthlyData: MonthData[]
  recentOrders: RecentOrder[]
}

// ── Formatters ─────────────────────────────────────────────────────────────────
const fmt = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)
const fmtK = (n: number) => (n >= 1000 ? `$${(n / 1000).toFixed(1)}k` : fmt(n))
const fmtDate = (iso: string) => new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

// ── Primitives ─────────────────────────────────────────────────────────────────
function PL({ children, dim }: { children: React.ReactNode; dim?: boolean }) {
  return (
    <span
      className={`font-mono text-[8px] tracking-[0.22em] uppercase select-none ${dim ? 'text-muted-light/50 dark:text-muted-dark/50' : 'text-muted-light dark:text-muted-dark'}`}
    >
      {children}
    </span>
  )
}

function LiveDot({ on = true, color }: { on?: boolean; color?: 'pink' }) {
  if (!on) return <span className="inline-block w-1.5 h-1.5 rounded-full shrink-0 bg-border-light dark:bg-border-dark" />
  if (color === 'pink')
    return <span className="inline-block w-1.5 h-1.5 rounded-full shrink-0 bg-secondary-light dark:bg-secondary-dark animate-pulse" />
  return <span className="inline-block w-1.5 h-1.5 rounded-full shrink-0 bg-emerald-400 animate-pulse" />
}

function SideHeader({ label, accent = 'primary' }: { label: string; accent?: 'primary' | 'secondary' }) {
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 border-b border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark shrink-0">
      <div
        className={`w-px h-3 shrink-0 ${accent === 'secondary' ? 'bg-secondary-light dark:bg-secondary-dark' : 'bg-primary-light dark:bg-primary-dark'}`}
      />
      <PL>{label}</PL>
    </div>
  )
}

function CenterHeader({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2 px-4 py-2 border-b border-border-light dark:border-border-dark">
      <div className="w-px h-3 bg-primary-light dark:bg-primary-dark shrink-0" />
      <PL>{label}</PL>
    </div>
  )
}

function ThinBar({ pct, delay = 0, secondary }: { pct: number; delay?: number; secondary?: boolean }) {
  return (
    <div className="h-px w-full bg-border-light dark:bg-border-dark overflow-hidden mt-1.5">
      <motion.div
        className={secondary ? 'h-full bg-secondary-light dark:bg-secondary-dark' : 'h-full bg-primary-light dark:bg-primary-dark'}
        initial={{ width: 0 }}
        animate={{ width: `${Math.min(pct, 100)}%` }}
        transition={{ delay, duration: 0.9, ease: 'easeOut' }}
      />
    </div>
  )
}

// ── Mini Bar Chart ─────────────────────────────────────────────────────────────
function BarChart({ data }: { data: MonthData[] }) {
  const max = Math.max(...data.map((d) => d.orders + d.adoptions), 1)
  return (
    <div className="flex items-end gap-1.5 h-full w-full">
      {data.map((d, i) => {
        const total = d.orders + d.adoptions
        const orderPct = (d.orders / max) * 100
        const adoptPct = (d.adoptions / max) * 100
        return (
          <div key={d.label} className="flex-1 flex flex-col items-center gap-1 h-full justify-end group relative">
            {/* Tooltip */}
            <div className="absolute bottom-full mb-1.5 left-1/2 -translate-x-1/2 bg-navbar-light dark:bg-navbar-dark border border-border-light dark:border-border-dark px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 whitespace-nowrap">
              <p className="font-mono text-[8px] text-text-light dark:text-text-dark">{fmtK(total)}</p>
              <p className="font-mono text-[7px] text-muted-light dark:text-muted-dark">{d.label}</p>
            </div>
            {/* Stacked bars */}
            <div className="w-full flex flex-col justify-end gap-px" style={{ height: '100%' }}>
              <motion.div
                className="w-full bg-secondary-light dark:bg-secondary-dark opacity-70"
                style={{ height: `${adoptPct}%` }}
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ delay: 0.4 + i * 0.07, duration: 0.5, ease: 'easeOut' }}
                // style={{ height: `${adoptPct}%`, originY: 1 } as any}
              />
              <motion.div
                className="w-full bg-primary-light dark:bg-primary-dark"
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ delay: 0.3 + i * 0.07, duration: 0.5, ease: 'easeOut' }}
                style={{ height: `${orderPct}%`, originY: 1 } as any}
              />
            </div>
            <PL dim>{d.label}</PL>
          </div>
        )
      })}
    </div>
  )
}

// ── Bypass Code Button ────────────────────────────────────────────────────────
function BypassCodeButton({ code, rotatesAt }: { code: string | null; rotatesAt: string | null }) {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  const rotateDate = rotatesAt ? new Date(rotatesAt) : null
  const rotateFmt = rotateDate
    ? rotateDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) +
      ' at ' +
      rotateDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
    : null

  function copy() {
    if (!code) return
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 px-3 h-6 border border-border-light dark:border-border-dark hover:border-primary-light dark:hover:border-primary-dark hover:text-primary-light dark:hover:text-primary-dark text-muted-light dark:text-muted-dark transition-colors font-mono text-[8px] tracking-[0.2em] uppercase focus:outline-none focus-visible:ring-1 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark"
        aria-expanded={open}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-secondary-light dark:bg-secondary-dark shrink-0" />
        Bypass Code
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-1.5 z-50 w-72 border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark shadow-lg"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-3 py-2 border-b border-border-light dark:border-border-dark">
              <PL>Adoption bypass code</PL>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="font-mono text-[8px] text-muted-light dark:text-muted-dark hover:text-text-light dark:hover:text-text-dark transition-colors"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            {/* Code */}
            <div className="px-3 py-3 border-b border-border-light dark:border-border-dark">
              <div className="flex items-center justify-between gap-2">
                <code className="font-mono text-[10px] text-text-light dark:text-text-dark tracking-wider break-all">{code ?? '—'}</code>
                <button
                  type="button"
                  onClick={copy}
                  disabled={!code}
                  className="shrink-0 px-2 py-1 border border-border-light dark:border-border-dark font-mono text-[8px] tracking-[0.15em] uppercase text-muted-light dark:text-muted-dark hover:text-primary-light dark:hover:text-primary-dark hover:border-primary-light dark:hover:border-primary-dark transition-colors disabled:opacity-40"
                >
                  {copied ? '✓ Copied' : 'Copy'}
                </button>
              </div>
            </div>

            {/* Rotation info */}
            <div className="px-3 py-2.5">
              <PL>Rotates on</PL>
              <p className="font-mono text-[9px] text-text-light dark:text-text-dark mt-1">{rotateFmt ?? 'Unknown'}</p>
              <p className="font-mono text-[8px] text-muted-light dark:text-muted-dark mt-1">Rotates every 14 days via cron</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ── Clock ──────────────────────────────────────────────────────────────────────
function Clock() {
  const [t, setT] = useState(() => new Date())
  useEffect(() => {
    const id = setInterval(() => setT(new Date()), 1000)
    return () => clearInterval(id)
  }, [])
  return (
    <span className="font-mono text-[10px] tracking-[0.15em] text-text-light dark:text-text-dark tabular-nums">
      {t.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}
    </span>
  )
}

// ── Main ───────────────────────────────────────────────────────────────────────
export default function DashboardClient({ stats }: { stats: DashboardStats }) {
  const {
    totalRevenue,
    totalOrderRevenue,
    totalAdoptionRevenue,
    auctionRevenue,
    thisMonthRevenue,
    lastMonthRevenue,
    monthlyChange,
    activeAuctions,
    totalUsers,
    newThisMonth,
    newsletterCount,
    welcomeWienerCount,
    productCount,
    bypassCode,
    bypassCodeRotatesAt,
    monthlyData,
    recentOrders
  } = stats

  const [expanded, setExpanded] = useState<string | null>(null)

  const isUp = monthlyChange !== null && monthlyChange >= 0
  const changeStr = monthlyChange !== null ? `${isUp ? '+' : ''}${monthlyChange.toFixed(1)}%` : null
  const maxBar = Math.max(totalOrderRevenue, totalAdoptionRevenue, auctionRevenue, 1)
  return (
    <div className="h-full w-full overflow-hidden flex flex-col bg-bg-light dark:bg-bg-dark font-mono">
      {/* ══ TOP BAR ══════════════════════════════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="flex items-center justify-between px-4 h-9 shrink-0 border-b border-border-light dark:border-border-dark bg-navbar-light dark:bg-navbar-dark"
      >
        <span className="font-mono text-[9px] tracking-[0.2em] uppercase text-muted-light dark:text-muted-dark">Dashboard</span>
        <div className="flex items-center gap-4">
          <BypassCodeButton code={bypassCode} rotatesAt={bypassCodeRotatesAt} />
          <Clock />
        </div>
      </motion.div>

      {/* ══ BODY ══════════════════════════════════════════════════════════════ */}
      <div className="flex flex-1 min-h-0">
        {/* ── LEFT SIDEBAR ─────────────────────────────────────────────────── */}
        <motion.aside
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.06, duration: 0.4 }}
          className="w-48 shrink-0 border-r border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark flex-col overflow-y-auto hidden lg:flex"
        >
          {/* Total revenue */}
          <SideHeader label="Total revenue" />
          <div className="px-3 py-3 border-b border-border-light dark:border-border-dark">
            <div className="font-quicksand font-black text-2xl text-text-light dark:text-text-dark leading-none">{fmt(totalRevenue)}</div>
            {changeStr && (
              <span
                className={`font-mono text-[8px] mt-1.5 block ${isUp ? 'text-emerald-500 dark:text-emerald-400' : 'text-red-500 dark:text-red-400'}`}
              >
                {isUp ? '↑' : '↓'} {changeStr} this month
              </span>
            )}
          </div>

          {/* Revenue streams */}
          <SideHeader label="Streams" />
          <div className="px-3 py-3 space-y-3 border-b border-border-light dark:border-border-dark">
            {[
              { label: 'Orders', value: totalOrderRevenue },
              { label: 'Adoptions', value: totalAdoptionRevenue, secondary: true },
              { label: 'Auctions', value: auctionRevenue }
            ].map((r, i) => (
              <div key={r.label}>
                <div className="flex justify-between items-baseline">
                  <PL>{r.label}</PL>
                  <span className="font-mono text-[9px] text-text-light dark:text-text-dark">{fmtK(r.value)}</span>
                </div>
                <ThinBar pct={(r.value / maxBar) * 100} delay={0.3 + i * 0.08} secondary={r.secondary} />
              </div>
            ))}
          </div>

          {/* This month */}
          <SideHeader label="This month" />
          <div className="px-3 py-3 border-b border-border-light dark:border-border-dark">
            <div className="font-quicksand font-black text-xl text-text-light dark:text-text-dark leading-none">{fmt(thisMonthRevenue)}</div>
            <p className="font-mono text-[8px] text-muted-light dark:text-muted-dark mt-1">vs {fmt(lastMonthRevenue)} last</p>
          </div>

          {/* Catalogue */}
          <SideHeader label="Catalogue" />
          <div className="px-3 py-2.5 space-y-2 border-b border-border-light dark:border-border-dark">
            {[
              { label: 'Active products', value: productCount },
              { label: 'Welcome wieners', value: welcomeWienerCount },
              { label: 'Newsletter subs', value: newsletterCount }
            ].map((r) => (
              <div key={r.label} className="flex items-center justify-between">
                <PL>{r.label}</PL>
                <span className="font-mono text-[9px] font-semibold text-text-light dark:text-text-dark">{r.value.toLocaleString()}</span>
              </div>
            ))}
          </div>

          {/* Active auctions */}
          <SideHeader label="Auctions" accent="secondary" />
          <div className="px-3 py-3">
            <div className="flex items-center gap-2">
              <LiveDot on={activeAuctions > 0} color={activeAuctions > 0 ? undefined : undefined} />
              <span className="font-quicksand font-black text-xl text-text-light dark:text-text-dark">{activeAuctions}</span>
              <PL>{activeAuctions === 1 ? 'running' : activeAuctions > 1 ? 'running' : 'none active'}</PL>
            </div>
            <p className="font-mono text-[8px] text-muted-light dark:text-muted-dark mt-1.5">{fmt(auctionRevenue)} earned</p>
          </div>
        </motion.aside>

        {/* ── CENTER ───────────────────────────────────────────────────────── */}
        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="flex-1 flex flex-col min-w-0 overflow-hidden divide-y divide-border-light dark:divide-border-dark"
        >
          {/* ·· Stat strip ·· */}
          <div className="grid grid-cols-4 divide-x divide-border-light dark:divide-border-dark border-b border-border-light dark:border-border-dark shrink-0">
            {[
              { label: 'All-time revenue', value: fmt(totalRevenue), accent: true },
              { label: 'This month', value: fmt(thisMonthRevenue), sub: changeStr ? `${isUp ? '↑' : '↓'} ${changeStr}` : undefined, subUp: isUp },
              { label: 'Orders', value: fmt(totalOrderRevenue) },
              { label: 'Adoption fees', value: fmt(totalAdoptionRevenue) }
            ].map((s) => (
              <div key={s.label} className={'px-4 py-3 flex flex-col gap-0.5 ' + (s.accent ? 'bg-primary-light/5 dark:bg-primary-dark/5' : '')}>
                <PL>{s.label}</PL>
                <span
                  className={
                    'font-quicksand font-black text-xl leading-none mt-1 ' +
                    (s.accent ? 'text-primary-light dark:text-primary-dark' : 'text-text-light dark:text-text-dark')
                  }
                >
                  {s.value}
                </span>
                {s.sub && (
                  <span className={'font-mono text-[8px] ' + (s.subUp ? 'text-emerald-500 dark:text-emerald-400' : 'text-red-500 dark:text-red-400')}>
                    {s.sub}
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* ·· Revenue chart ·· */}
          <div className="flex flex-col" style={{ flex: '0 0 45%' }}>
            <CenterHeader label="Revenue — last 6 months" />
            <div className="flex-1 px-4 pt-3 pb-2 min-h-0">
              <div className="h-full flex flex-col">
                {/* Chart area */}
                <div className="flex-1 min-h-0" style={{ minHeight: 80 }}>
                  <BarChart data={monthlyData} />
                </div>
                {/* Legend */}
                <div className="flex items-center gap-5 mt-2 shrink-0">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 bg-primary-light dark:bg-primary-dark" />
                    <PL>Orders</PL>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 bg-secondary-light dark:bg-secondary-dark opacity-70" />
                    <PL>Adoptions</PL>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ·· Payments table ·· */}
          <div className="flex flex-col flex-1 min-h-0">
            <CenterHeader label="Recent payments" />

            {/* Table head */}
            <div
              className="grid px-4 py-1.5 border-b border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark shrink-0"
              style={{ gridTemplateColumns: '1.5rem 1fr 7rem 6rem 5.5rem' }}
            >
              {['#', 'Supporter', 'Date', 'Amount', 'Status'].map((h) => (
                <PL key={h}>{h}</PL>
              ))}
            </div>

            {/* Rows */}
            <div className="flex-1 overflow-y-auto divide-y divide-border-light dark:divide-border-dark">
              {recentOrders.length === 0 ? (
                <div className="px-4 py-6">
                  <PL>No payments yet</PL>
                </div>
              ) : (
                recentOrders.map((order, i) => (
                  <motion.div key={order.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.05 }}>
                    <button
                      type="button"
                      onClick={() => setExpanded(expanded === order.id ? null : order.id)}
                      className="w-full grid items-center px-4 py-2.5 hover:bg-surface-light dark:hover:bg-surface-dark transition-colors text-left group"
                      style={{ gridTemplateColumns: '1.5rem 1fr 7rem 6rem 5.5rem' }}
                    >
                      <span className="font-mono text-[8px] text-muted-light dark:text-muted-dark">{String(i + 1).padStart(2, '0')}</span>
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-5 h-5 border border-border-light dark:border-border-dark flex items-center justify-center shrink-0 bg-bg-light dark:bg-bg-dark">
                          <span className="font-mono text-[7px] font-bold text-primary-light dark:text-primary-dark">
                            {order.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <span className="font-mono text-[9px] text-text-light dark:text-text-dark group-hover:text-primary-light dark:group-hover:text-primary-dark transition-colors truncate">
                          {order.name}
                        </span>
                      </div>
                      <span className="font-mono text-[8px] text-muted-light dark:text-muted-dark">{fmtDate(order.createdAt)}</span>
                      <span className="font-mono text-[9px] font-semibold text-text-light dark:text-text-dark">{fmt(order.total)}</span>
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[8px] text-emerald-600 dark:text-emerald-400">✓ Done</span>
                        <motion.span
                          animate={{ rotate: expanded === order.id ? 180 : 0 }}
                          transition={{ duration: 0.18 }}
                          className="font-mono text-[8px] text-muted-light dark:text-muted-dark"
                        >
                          ▾
                        </motion.span>
                      </div>
                    </button>

                    <AnimatePresence>
                      {expanded === order.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.18 }}
                          className="overflow-hidden"
                        >
                          <div className="grid grid-cols-4 gap-x-6 gap-y-2 px-4 py-3 bg-bg-light dark:bg-bg-dark border-b border-border-light dark:border-border-dark">
                            {[
                              { label: 'Order ID', value: order.id },
                              {
                                label: 'Full date',
                                value: new Date(order.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
                              },
                              { label: 'Amount', value: fmt(order.total) },
                              { label: 'Status', value: 'Completed' }
                            ].map((f) => (
                              <div key={f.label}>
                                <PL>{f.label}</PL>
                                <p className="font-mono text-[9px] text-text-light dark:text-text-dark mt-0.5 truncate">{f.value}</p>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </motion.main>

        {/* ── RIGHT SIDEBAR ────────────────────────────────────────────────── */}
        <motion.aside
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.06, duration: 0.4 }}
          className="w-48 shrink-0 border-l border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark flex-col overflow-y-auto hidden lg:flex"
        >
          {/* Supporters */}
          <SideHeader label="Supporters" />
          <div className="px-3 py-3 border-b border-border-light dark:border-border-dark">
            <div className="font-quicksand font-black text-2xl text-text-light dark:text-text-dark leading-none">{totalUsers.toLocaleString()}</div>
            <div className="flex items-center gap-1.5 mt-1.5">
              <LiveDot color="pink" />
              <PL>+{newThisMonth} this month</PL>
            </div>
          </div>

          {/* Platform health */}
          <SideHeader label="Platform" />
          <div className="px-3 py-2.5 space-y-2 border-b border-border-light dark:border-border-dark">
            {[
              { label: 'Stripe API', status: 'nominal' },
              { label: 'Payments', status: 'nominal' },
              { label: 'Auth', status: 'nominal' },
              { label: 'Storage', status: 'nominal' }
            ].map((s) => (
              <div key={s.label} className="flex items-center justify-between">
                <PL>{s.label}</PL>
                <div className="flex items-center gap-1.5">
                  <LiveDot />
                  <PL>ok</PL>
                </div>
              </div>
            ))}
          </div>

          {/* Adoption revenue breakdown */}
          <SideHeader label="Adoptions" accent="secondary" />
          <div className="px-3 py-3 border-b border-border-light dark:border-border-dark">
            <div className="font-quicksand font-black text-xl text-text-light dark:text-text-dark leading-none">{fmt(totalAdoptionRevenue)}</div>
            <p className="font-mono text-[8px] text-muted-light dark:text-muted-dark mt-1">Total paid fees</p>
            <ThinBar pct={(totalAdoptionRevenue / Math.max(totalRevenue, 1)) * 100} delay={0.5} secondary />
            <p className="font-mono text-[8px] text-muted-light dark:text-muted-dark mt-1.5">
              {((totalAdoptionRevenue / Math.max(totalRevenue, 1)) * 100).toFixed(1)}% of total
            </p>
          </div>

          {/* Recent feed */}
          <SideHeader label="Feed" />
          <div className="flex-1 overflow-y-auto divide-y divide-border-light dark:divide-border-dark">
            {recentOrders.map((order, i) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 + i * 0.05 }}
                className="px-3 py-2 hover:bg-bg-light dark:hover:bg-bg-dark transition-colors"
              >
                <div className="flex items-center justify-between gap-1 mb-0.5">
                  <span className="font-mono text-[8px] text-text-light dark:text-text-dark truncate">{order.name.split(' ')[0]}</span>
                  <span className="font-mono text-[8px] font-bold text-primary-light dark:text-primary-dark shrink-0">{fmtK(order.total)}</span>
                </div>
                <PL>{fmtDate(order.createdAt)}</PL>
              </motion.div>
            ))}
          </div>
        </motion.aside>
      </div>

      {/* ══ BOTTOM STRIP ══════════════════════════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.28, duration: 0.35 }}
        className="shrink-0 border-t border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark"
      >
        <div className="flex items-stretch divide-x divide-border-light dark:divide-border-dark overflow-x-auto">
          {/* Summary tiles */}
          {[
            { label: 'All-time revenue', value: fmt(totalRevenue) },
            { label: 'This month', value: fmt(thisMonthRevenue), highlight: true },
            { label: 'Orders', value: fmt(totalOrderRevenue) },
            { label: 'Adoptions', value: fmt(totalAdoptionRevenue) },
            { label: 'Auctions', value: fmt(auctionRevenue) },
            { label: 'Supporters', value: totalUsers.toLocaleString() },
            { label: 'Active auctions', value: String(activeAuctions) },
            { label: 'Products', value: String(productCount) },
            { label: 'Newsletter', value: String(newsletterCount) }
          ].map((tile) => (
            <div
              key={tile.label}
              className={`flex flex-col justify-center px-4 py-2 min-w-[110px] shrink-0 ${tile.highlight ? 'bg-primary-light/5 dark:bg-primary-dark/5' : ''}`}
            >
              <PL>{tile.label}</PL>
              <span
                className={`font-quicksand font-black text-sm leading-tight mt-0.5 ${tile.highlight ? 'text-primary-light dark:text-primary-dark' : 'text-text-light dark:text-text-dark'}`}
              >
                {tile.value}
              </span>
            </div>
          ))}

          {/* Status */}
          <div className="flex items-center gap-2 px-4 ml-auto shrink-0">
            <LiveDot />
            <PL>All systems nominal</PL>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
