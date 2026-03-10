'use client'

import { fadeUp } from 'app/lib/constants/motion'
import { motion } from 'framer-motion'
import { signOut } from 'next-auth/react'
import Link from 'next/link'
import Picture from '../common/Picture'

// ─── Types ────────────────────────────────────────────────────────────────────
export interface Donation {
  id: string
  amount: number
  createdAt: Date
  status: string
}

export interface Subscription {
  id: string
  tierName: string
  amount: number
  interval: 'month' | 'year'
  status: 'active' | 'canceled' | 'past_due'
  nextBillingDate?: Date
}

export interface WelcomeWienerSupport {
  id: string
  dogName: string
  dogImage: string | null
  productName: string
  amount: number
  createdAt: Date
}

export interface AuctionBid {
  id: string
  itemName: string
  itemImage: string | null
  bidAmount: number
  isWinner: boolean
  auctionEndDate: Date
  status: 'active' | 'ended'
}

export interface User {
  id: string
  firstName: string | null
  lastName: string | null
  email: string | null
  image: string | null
}

export interface MemberPortalPageProps {
  user: User
  donations: Donation[]
  subscriptions: Subscription[]
  wienerSupports: WelcomeWienerSupport[]
  auctionBids: AuctionBid[]
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function formatDate(date: Date) {
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function formatMoney(amount: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)
}

// ─── Section Label ────────────────────────────────────────────────────────────
function SectionLabel({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <span className="block w-6 h-px bg-primary-light dark:bg-primary-dark shrink-0" aria-hidden="true" />
      <h2 className="text-xs font-mono tracking-[0.2em] uppercase text-primary-light dark:text-primary-dark">{label}</h2>
    </div>
  )
}

// ─── Empty State ──────────────────────────────────────────────────────────────
function EmptyState({ message }: { message: string }) {
  return (
    <div className="border border-dashed border-border-light dark:border-border-dark py-10 text-center">
      <p className="text-xs font-mono text-muted-light dark:text-muted-dark">{message}</p>
    </div>
  )
}

// ─── Status Pill ─────────────────────────────────────────────────────────────
function StatusPill({ status }: { status: string }) {
  const map: Record<string, string> = {
    active: 'bg-green-500/10 text-green-600 dark:text-green-400',
    succeeded: 'bg-green-500/10 text-green-600 dark:text-green-400',
    canceled: 'bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark text-muted-light dark:text-muted-dark',
    past_due: 'bg-red-500/10 text-red-500 dark:text-red-400',
    ended: 'bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark text-muted-light dark:text-muted-dark'
  }
  return <span className={`text-[9px] font-black tracking-widest uppercase px-2 py-0.5 ${map[status] ?? map.ended}`}>{status.replace('_', ' ')}</span>
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function MemberPortalClient({ user, donations, subscriptions, wienerSupports, auctionBids }: MemberPortalPageProps) {
  const fullName = [user.firstName, user.lastName].filter(Boolean).join(' ') || 'Member'
  const initials = [user.firstName?.[0], user.lastName?.[0]].filter(Boolean).join('').toUpperCase() || '?'

  const totalGiven = donations.reduce((s, d) => s + d.amount, 0) + wienerSupports.reduce((s, w) => s + w.amount, 0)

  return (
    <main id="main-content" className="min-h-screen bg-bg-light dark:bg-bg-dark text-text-light dark:text-text-dark">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-12 sm:pt-16 pb-24 sm:pb-32">
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[10px] font-mono tracking-[0.2em] uppercase text-muted-light dark:text-muted-dark hover:text-primary-light dark:hover:text-primary-dark transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark"
          >
            <svg
              viewBox="0 0 24 24"
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="square"
              aria-hidden="true"
            >
              <path d="M19 12H5M5 12l7-7M5 12l7 7" />
            </svg>
            Home
          </Link>

          <button
            onClick={() => signOut({ redirectTo: '/auth/login' })}
            className="inline-flex items-center gap-2 text-[10px] font-mono tracking-[0.2em] uppercase text-muted-light dark:text-muted-dark hover:text-red-500 dark:hover:text-red-400 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
          >
            Sign Out
            <svg
              viewBox="0 0 24 24"
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="square"
              aria-hidden="true"
            >
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
            </svg>
          </button>
        </div>
        {/* ── Header ── */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={0} className="mb-12 sm:mb-16">
          <div className="flex items-start gap-4 sm:gap-5">
            {/* Avatar */}
            {user.image ? (
              <Picture
                priority={true}
                src={user.image}
                alt={fullName}
                className="w-12 h-12 sm:w-14 sm:h-14 object-cover border border-border-light dark:border-border-dark shrink-0"
              />
            ) : (
              <div
                className="w-12 h-12 sm:w-14 sm:h-14 bg-primary-light/10 dark:bg-primary-dark/10 border border-primary-light/30 dark:border-primary-dark/30 flex items-center justify-center shrink-0"
                aria-hidden="true"
              >
                <span className="font-quicksand font-black text-base text-primary-light dark:text-primary-dark">{initials}</span>
              </div>
            )}

            <div className="min-w-0">
              <div className="flex items-center gap-3 mb-1">
                <span className="block w-5 h-px bg-primary-light dark:bg-primary-dark" aria-hidden="true" />
                <p className="text-[10px] font-mono tracking-[0.2em] uppercase text-primary-light dark:text-primary-dark">Member Portal</p>
              </div>
              <h1 className="font-quicksand font-black text-3xl sm:text-4xl text-text-light dark:text-text-dark leading-tight">{fullName}</h1>
              <p className="text-xs font-mono text-muted-light dark:text-muted-dark mt-0.5 truncate">{user.email}</p>
            </div>
          </div>

          {/* Stats strip */}
          <div className="mt-8 grid grid-cols-2 xs:grid-cols-4 gap-px bg-border-light dark:bg-border-dark border border-border-light dark:border-border-dark">
            {[
              { label: 'Total Given', value: formatMoney(totalGiven) },
              { label: 'Subscriptions', value: subscriptions.filter((s) => s.status === 'active')?.length.toString() },
              { label: 'Dogs Supported', value: wienerSupports?.length.toString() },
              { label: 'Auctions', value: auctionBids?.length.toString() }
            ].map(({ label, value }) => (
              <div key={label} className="bg-bg-light dark:bg-bg-dark px-4 py-4 sm:py-5">
                <p className="text-[9px] font-mono tracking-[0.18em] uppercase text-muted-light dark:text-muted-dark mb-1">{label}</p>
                <p className="font-quicksand font-black text-xl sm:text-2xl text-text-light dark:text-text-dark">{value}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── Sections ── */}
        <div className="flex flex-col gap-14 sm:gap-16">
          {/* ── Subscriptions ── */}
          <motion.section variants={fadeUp} initial="hidden" animate="show" custom={1} aria-labelledby="subscriptions-heading">
            <SectionLabel label="Subscriptions" />
            {subscriptions?.length === 0 ? (
              <EmptyState message="No active subscriptions." />
            ) : (
              <ul
                className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-border-light dark:bg-border-dark border border-border-light dark:border-border-dark"
                role="list"
              >
                {subscriptions.map((sub) => (
                  <li key={sub.id} className="bg-bg-light dark:bg-bg-dark p-5">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <p className="font-quicksand font-black text-base text-text-light dark:text-text-dark leading-snug">{sub.tierName}</p>
                      <StatusPill status={sub.status} />
                    </div>
                    <p className="font-quicksand font-black text-2xl text-primary-light dark:text-primary-dark">
                      {formatMoney(sub.amount)}
                      <span className="text-xs font-mono font-normal text-muted-light dark:text-muted-dark ml-1">/ {sub.interval}</span>
                    </p>
                    {sub.nextBillingDate && sub.status === 'active' && (
                      <p className="text-[10px] font-mono text-muted-light dark:text-muted-dark mt-2">
                        Next billing {formatDate(sub.nextBillingDate)}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </motion.section>

          {/* ── One-time donations ── */}
          <motion.section variants={fadeUp} initial="hidden" animate="show" custom={2} aria-labelledby="donations-heading">
            <SectionLabel label="One-Time Donations" />
            {donations?.length === 0 ? (
              <EmptyState message="No donations yet." />
            ) : (
              <div className="border border-border-light dark:border-border-dark overflow-hidden">
                <table className="w-full" role="table" aria-label="One-time donations">
                  <thead>
                    <tr className="border-b border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark">
                      <th
                        scope="col"
                        className="px-4 sm:px-5 py-3 text-left text-[9px] font-mono tracking-[0.18em] uppercase text-muted-light dark:text-muted-dark"
                      >
                        Date
                      </th>
                      <th
                        scope="col"
                        className="px-4 sm:px-5 py-3 text-left text-[9px] font-mono tracking-[0.18em] uppercase text-muted-light dark:text-muted-dark"
                      >
                        Amount
                      </th>
                      <th
                        scope="col"
                        className="px-4 sm:px-5 py-3 text-left text-[9px] font-mono tracking-[0.18em] uppercase text-muted-light dark:text-muted-dark"
                      >
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {donations.map((d, i) => (
                      <motion.tr
                        key={d.id}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 + i * 0.04 }}
                        className="border-b border-border-light dark:border-border-dark last:border-0 hover:bg-surface-light dark:hover:bg-surface-dark transition-colors duration-150"
                      >
                        <td className="px-4 sm:px-5 py-3.5 text-xs font-mono text-muted-light dark:text-muted-dark whitespace-nowrap">
                          {formatDate(d.createdAt)}
                        </td>
                        <td className="px-4 sm:px-5 py-3.5 font-quicksand font-black text-sm text-text-light dark:text-text-dark whitespace-nowrap">
                          {formatMoney(d.amount)}
                        </td>
                        <td className="px-4 sm:px-5 py-3.5">
                          <StatusPill status={d.status} />
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </motion.section>

          {/* ── Welcome Wieners ── */}
          <motion.section variants={fadeUp} initial="hidden" animate="show" custom={3} aria-labelledby="wieners-heading">
            <SectionLabel label="Welcome Wieners Supported" />
            {wienerSupports?.length === 0 ? (
              <EmptyState message="You haven't supported any dogs yet." />
            ) : (
              <ul
                className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-px bg-border-light dark:bg-border-dark border border-border-light dark:border-border-dark"
                role="list"
              >
                {wienerSupports.map((w) => (
                  <li key={w.id} className="bg-bg-light dark:bg-bg-dark flex gap-3.5 p-4 items-center">
                    {/* Dog photo */}
                    <div className="w-12 h-12 shrink-0 overflow-hidden bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark">
                      {w.dogImage ? (
                        <Picture priority={false} src={w.dogImage} alt={w.dogName} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-[9px] font-mono text-muted-light dark:text-muted-dark">?</span>
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="font-quicksand font-black text-sm text-text-light dark:text-text-dark truncate">{w.dogName}</p>
                      <p className="text-[10px] font-mono text-muted-light dark:text-muted-dark truncate mt-0.5">{w.productName}</p>
                      <p className="text-xs font-quicksand font-black text-primary-light dark:text-primary-dark mt-0.5">{formatMoney(w.amount)}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </motion.section>

          {/* ── Auctions ── */}
          <motion.section variants={fadeUp} initial="hidden" animate="show" custom={4} aria-labelledby="auctions-heading">
            <SectionLabel label="Auction Participation" />
            {auctionBids?.length === 0 ? (
              <EmptyState message="You haven't participated in any auctions yet." />
            ) : (
              <ul
                className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-border-light dark:bg-border-dark border border-border-light dark:border-border-dark"
                role="list"
              >
                {auctionBids.map((bid) => (
                  <li key={bid.id} className="bg-bg-light dark:bg-bg-dark flex gap-4 p-4 sm:p-5">
                    {/* Item image */}
                    <div className="w-14 h-14 shrink-0 overflow-hidden bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark">
                      {bid.itemImage ? (
                        <Picture priority={false} src={bid.itemImage} alt={bid.itemName} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-[9px] font-mono text-muted-light dark:text-muted-dark">?</span>
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2 mb-1 flex-wrap">
                        <p className="font-quicksand font-black text-sm text-text-light dark:text-text-dark leading-snug">{bid.itemName}</p>
                        <div className="flex items-center gap-1.5 shrink-0">
                          {bid.isWinner && (
                            <span className="text-[9px] font-black tracking-widest uppercase px-2 py-0.5 bg-primary-light/10 dark:bg-primary-dark/10 text-primary-light dark:text-primary-dark">
                              Won
                            </span>
                          )}
                          <StatusPill status={bid.status} />
                        </div>
                      </div>
                      <p className="font-quicksand font-black text-lg text-text-light dark:text-text-dark">
                        {formatMoney(bid.bidAmount)}
                        <span className="text-[10px] font-mono font-normal text-muted-light dark:text-muted-dark ml-1">your bid</span>
                      </p>
                      <p className="text-[10px] font-mono text-muted-light dark:text-muted-dark mt-0.5">Ended {formatDate(bid.auctionEndDate)}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </motion.section>
        </div>
      </div>
    </main>
  )
}
