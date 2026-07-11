'use client'

import { useState } from 'react'
import { Gift, TrendingUp, TrendingDown, Copy, Check } from 'lucide-react'
import { sourceMeta } from 'app/lib/constants/dashboard.constants'
import { RevenueChart } from 'app/components/dashboard/RevenueChart'
import { formatMoney } from 'app/utils/currency.utils'
import { motion } from 'framer-motion'
import { fadeUp } from 'app/lib/constants/motion.constants'

const fmtType = (type: string) =>
  sourceMeta[type]?.label ?? type.charAt(0).toUpperCase() + type.slice(1).replace(/_/g, ' ')

export default function AdminDashboardClient({ stats }) {
  const [copied, setCopied] = useState(false)

  const monthlyUp = stats.monthlyChange >= 0
  const wieners = [...(stats.welcomeWienerRevenue ?? [])].sort((a, b) => b.totalRaised - a.totalRaised)
  const wienerTotal = wieners.reduce((s, w) => s + w.totalRaised, 0)
  const wienerMax = wieners[0]?.totalRaised ?? 0
  const chartData = (stats.monthlyData ?? []).map((m) => ({ label: m.label, total: m.total }))
  const sources = [...(stats.ordersByType ?? [])].sort((a, b) => b.total - a.total)

  const copyCode = async () => {
    if (!stats.bypassCode) return
    try {
      await navigator.clipboard.writeText(stats.bypassCode)
    } catch {}
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }

  return (
    <div className="w-full">
      {/* ── Header ── */}
      <motion.header
        variants={fadeUp}
        initial="hidden"
        animate="show"
        custom={0}
        className="border-b border-border-light dark:border-border-dark px-4 sm:px-6 py-4 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
      >
        <div>
          <h1 className="font-mono text-sm tracking-[0.2em] uppercase text-text-light dark:text-text-dark">
            Dashboard
          </h1>
          <p className="font-mono text-[10px] tracking-[0.15em] uppercase text-muted-light dark:text-muted-dark mt-1">
            Here&rsquo;s how Little Paws is doing
          </p>
        </div>

        <div className="lg:max-w-md w-full">
          {stats.bypassCode ? (
            <button
              type="button"
              onClick={copyCode}
              aria-label={`Copy adoption fee bypass code ${stats.bypassCode}`}
              className="w-full flex items-center justify-between gap-3 bg-primary-light/10 dark:bg-primary-dark/10 border border-primary-light/40 dark:border-primary-dark/40 px-4 py-3 text-left transition-colors hover:bg-primary-light/15 dark:hover:bg-primary-dark/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark"
            >
              <span className="flex flex-col min-w-0">
                <span className="text-[11px] font-mono uppercase tracking-[0.15em] text-muted-light dark:text-muted-dark mb-0.5">
                  Adoption fee bypass code
                </span>
                <span className="font-mono text-lg font-bold tracking-[0.08em] text-primary-light dark:text-primary-dark truncate">
                  {stats.bypassCode}
                </span>
              </span>
              <span className="inline-flex items-center gap-1.5 text-sm text-primary-light dark:text-primary-dark shrink-0">
                {copied ? (
                  <>
                    <Check className="w-4 h-4" aria-hidden="true" /> Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" aria-hidden="true" /> Copy
                  </>
                )}
              </span>
            </button>
          ) : (
            <p className="font-mono text-sm text-muted-light dark:text-muted-dark">No active bypass code.</p>
          )}
          {stats.bypassCodeRotatesAt && (
            <p className="font-mono text-[10px] tracking-[0.15em] uppercase text-muted-light dark:text-muted-dark mt-1.5">
              Rotates{' '}
              {new Date(stats.bypassCodeRotatesAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                timeZone: 'America/New_York'
              })}
            </p>
          )}
        </div>
      </motion.header>

      <div className="px-4 sm:px-6 py-6 pb-12">
        {/* Total revenue */}
        <motion.section
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={1}
          className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark p-5 sm:p-6 mb-5"
        >
          <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-muted-light dark:text-muted-dark mb-2">
            Total revenue · all time
          </p>
          <p className="font-quicksand text-4xl sm:text-5xl font-black text-text-light dark:text-text-dark leading-none">
            {formatMoney(stats.totalRevenue)}
          </p>
          <div className="inline-flex items-center gap-1.5 mt-3">
            {monthlyUp ? (
              <TrendingUp className="w-3.5 h-3.5 text-green-600 dark:text-green-400" aria-hidden="true" />
            ) : (
              <TrendingDown className="w-3.5 h-3.5 text-red-600 dark:text-red-400" aria-hidden="true" />
            )}
            <span
              className={`font-mono text-[10px] tracking-[0.15em] uppercase ${monthlyUp ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}
            >
              {monthlyUp ? 'Up' : 'Down'} {Math.abs(stats.monthlyChange)}% vs last month
            </span>
          </div>
        </motion.section>

        {/* Revenue by source */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={2}>
          <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-muted-light dark:text-muted-dark mb-2.5">
            Revenue by source
          </p>
          <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 mb-6">
            {sources.map(({ type, total }) => {
              const Icon = sourceMeta[type]?.icon ?? Gift
              return (
                <div
                  key={type}
                  className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark p-4"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Icon className="w-3.5 h-3.5 text-muted-light dark:text-muted-dark shrink-0" aria-hidden="true" />
                    <span className="font-mono text-[9px] tracking-[0.15em] uppercase text-muted-light dark:text-muted-dark truncate">
                      {fmtType(type)}
                    </span>
                  </div>
                  <p className="font-quicksand text-xl sm:text-2xl font-black text-text-light dark:text-text-dark leading-none">
                    {formatMoney(total)}
                  </p>
                </div>
              )
            })}
          </section>
        </motion.div>

        {/* Revenue trend */}
        <motion.section
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={3}
          className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark p-5 sm:p-6 mb-6"
        >
          <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-text-light dark:text-text-dark mb-1">
            Revenue over time
          </p>
          <p className="font-mono text-[10px] tracking-[0.15em] uppercase text-muted-light dark:text-muted-dark mb-4">
            Last {chartData.length} months
          </p>
          <RevenueChart data={chartData} />
        </motion.section>

        {/* Welcome Wieners */}
        <motion.section
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={4}
          className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark p-5 sm:p-6"
        >
          <div className="flex items-center justify-between mb-1">
            <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-text-light dark:text-text-dark">
              Welcome Wieners
            </p>
            <span className="font-mono text-[10px] tracking-[0.15em] uppercase text-muted-light dark:text-muted-dark">
              {formatMoney(wienerTotal)} raised
            </span>
          </div>
          <p className="font-mono text-[10px] tracking-[0.15em] uppercase text-muted-light dark:text-muted-dark mb-4">
            Money raised per sponsored dog
          </p>

          {wieners.length === 0 ? (
            <p className="font-mono text-[10px] tracking-[0.15em] uppercase text-muted-light dark:text-muted-dark">
              No data yet
            </p>
          ) : (
            <div className="flex flex-col gap-3.5">
              {wieners.map((w) => {
                const pct = wienerMax ? Math.round((w.totalRaised / wienerMax) * 100) : 0
                return (
                  <div key={w.id}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-mono text-xs text-text-light dark:text-text-dark truncate">{w.name}</span>
                      <span className="font-mono text-[10px] tracking-widest text-muted-light dark:text-muted-dark tabular-nums shrink-0 ml-2">
                        {formatMoney(w.totalRaised)} &middot; {w.sponsorCount}{' '}
                        {w.sponsorCount === 1 ? 'sponsor' : 'sponsors'}
                      </span>
                    </div>
                    <div className="h-2 w-full bg-bg-light dark:bg-bg-dark overflow-hidden">
                      <div className="h-2 bg-primary-light dark:bg-primary-dark" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </motion.section>
      </div>
    </div>
  )
}
