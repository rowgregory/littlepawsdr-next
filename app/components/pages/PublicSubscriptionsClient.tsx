'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useUiSelector } from 'app/lib/store/store'
import { ArrowLeft } from 'lucide-react'
import { SubscriptionPaymentForm } from 'app/components/forms/SubscriptionsPaymentForm'
import { T, TierKey, TIERS } from 'app/lib/constants/subscriptions'
import { IPaymentMethod } from 'types/entities/payment-method.types'
import { useSession } from 'next-auth/react'
import { StepIndicator } from '../common/StepIndicator'
import { SignedInRow } from '../common/SignedInRow'
import { StepSignIn } from '../common/SignInStep'
import { useSearchParams } from 'next/navigation'
import Picture from '../common/Picture'
import Link from 'next/link'

export function SubscriptionStickyHeader({
  billing,
  selected,
  onSubscribe,
  view
}: {
  billing: 'monthly' | 'yearly'
  selected: string | null
  onSubscribe: () => void
  view: string
}) {
  const selectedTier = TIERS.find((t) => t.id === selected)

  return (
    <motion.div
      initial={{ y: -48, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="sticky top-0 z-50 w-full border-b border-border-light dark:border-border-dark bg-bg-light/90 dark:bg-bg-dark/90 backdrop-blur-sm"
    >
      <div className="max-w-6xl mx-auto px-4 xs:px-5 sm:px-6 h-11 flex items-center justify-between gap-4">
        {/* Left — label */}
        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/"
            aria-label="Go back to home"
            className="text-muted-light dark:text-muted-dark hover:text-text-light dark:hover:text-text-dark transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark"
          >
            <ArrowLeft size={14} aria-hidden="true" />
          </Link>
          <span className="block w-4 h-px bg-primary-light dark:bg-primary-dark shrink-0" aria-hidden="true" />
          <p className="text-[10px] font-mono tracking-[0.2em] uppercase text-primary-light dark:text-primary-dark">Subscriptions</p>
        </div>

        {/* Center — selected tier */}
        <div className="flex-1 flex items-center justify-between min-w-0">
          {selectedTier ? (
            <motion.p
              key={selectedTier.id}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="text-[10px] font-mono tracking-[0.2em] uppercase text-text-light dark:text-text-dark truncate"
            >
              {selectedTier.name}&nbsp;
              <span className="text-primary-light dark:text-primary-dark">
                ${selectedTier.price[billing]}/{billing === 'monthly' ? 'mo' : 'yr'}
              </span>
            </motion.p>
          ) : (
            <p className="text-[10px] font-mono tracking-[0.2em] uppercase text-muted-light dark:text-muted-dark">Select a tier</p>
          )}
        </div>

        {/* Right — CTA */}
        {view === 'select' && (
          <button
            onClick={onSubscribe}
            disabled={!selected}
            aria-label={selectedTier ? `Subscribe to ${selectedTier.name}` : 'Select a tier to subscribe'}
            className="shrink-0 px-4 py-1.5 text-[10px] font-mono tracking-[0.2em] uppercase bg-primary-light dark:bg-primary-dark text-white dark:text-bg-dark hover:bg-secondary-light dark:hover:bg-secondary-dark transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Subscribe
          </button>
        )}
      </div>
    </motion.div>
  )
}

// ─── Card ─────────────────────────────────────────────────────────────────────
function TierCard({
  tier,
  billing,
  selected,
  onSelect,
  index,
  isDark
}: {
  tier: (typeof TIERS)[0]
  billing: 'monthly' | 'yearly'
  selected: boolean
  onSelect: () => void
  index: number
  isDark: boolean
}) {
  const s = T[tier.tier]
  const price = tier.price[billing]

  const glow = isDark ? s.darkGlow : s.lightGlow
  const stripe = isDark ? s.darkStripe : s.lightStripe
  const borderIdle = isDark ? s.darkBorderIdle : s.lightBorderIdle
  const borderActive = isDark ? s.darkBorderActive : s.lightBorderActive
  const corner = isDark ? s.darkCorner : s.lightCorner
  const edgeVia = isDark ? s.darkEdgeVia : s.lightEdgeVia
  const badge = isDark ? s.darkBadge : s.lightBadge
  const shineVia = isDark ? s.darkShineVia : s.lightShineVia
  const rank = isDark ? s.darkRank : s.lightRank
  const price_c = selected ? (isDark ? s.darkPriceActive : s.lightPriceActive) : isDark ? s.darkPrice : s.lightPrice
  const name_c = selected ? (isDark ? s.darkNameActive : s.lightNameActive) : isDark ? s.darkName : s.lightName

  const corners = [
    ['top-[6px] left-[6px]', 'border-t-[1.5px] border-l-[1.5px]'],
    ['top-[6px] right-[6px]', 'border-t-[1.5px] border-r-[1.5px]'],
    ['bottom-[6px] left-[6px]', 'border-b-[1.5px] border-l-[1.5px]'],
    ['bottom-[6px] right-[6px]', 'border-b-[1.5px] border-r-[1.5px]']
  ]

  return (
    <motion.div
      key={tier.name}
      initial={{ opacity: 0, rotateY: 90 }}
      animate={{ opacity: 1, rotateY: 0 }}
      transition={{
        duration: 0.45,
        delay: index * 0.08,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      style={{ transformStyle: 'preserve-3d' }}
      className="aspect-video"
    >
      <motion.button
        onClick={onSelect}
        whileHover={{ scale: 1.07, y: -5 }}
        whileTap={{ scale: 0.93 }}
        transition={{ type: 'spring', stiffness: 400, damping: 22 }}
        aria-pressed={selected}
        aria-label={`${tier.name} — $${price} per ${billing === 'monthly' ? 'month' : 'year'}${tier.badge ? ` — ${tier.badge}` : ''}`}
        className={`
      relative w-full h-full overflow-hidden border-2 flex flex-col items-center justify-center gap-1
      transition-[border-color] duration-200
      focus:outline-none focus-visible:ring-4 focus-visible:ring-offset-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark
      ${selected ? borderActive : borderIdle}
    `}
        style={{
          background: selected
            ? `repeating-linear-gradient(45deg,${stripe} 0,${stripe} 1px,transparent 1px,transparent 8px), ${isDark ? s.darkActiveBg : s.lightActiveBg}`
            : isDark
              ? `repeating-linear-gradient(45deg,${stripe} 0,${stripe} 1px,transparent 1px,transparent 8px), ${s.darkIdleBg}`
              : `repeating-linear-gradient(45deg,${stripe} 0,${stripe} 1px,transparent 1px,transparent 8px)`,
          boxShadow: selected ? glow : isDark ? '0 2px 12px rgba(0,0,0,.55)' : '0 2px 12px rgba(0,0,0,.1), inset 0 1px 0 rgba(255,255,255,.7)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)'
        }}
      >
        {/* ── Pulse ring ── */}
        <AnimatePresence>
          {selected && (
            <motion.div
              key="ring"
              className="absolute -inset-0.5 border-[1.5px] pointer-events-none"
              style={{
                borderColor: isDark
                  ? (s.darkGlow.match(/rgba\([^)]+\)/)?.[0] ?? 'transparent')
                  : (s.lightGlow.match(/rgba\([^)]+\)/)?.[0] ?? 'transparent')
              }}
              animate={{ opacity: [0.85, 0], scale: [0.95, 1.14] }}
              transition={{ duration: 1.1, repeat: Infinity, ease: 'easeOut' }}
              aria-hidden="true"
            />
          )}
        </AnimatePresence>

        {/* ── Top gloss ── */}
        <div
          className="absolute top-0 left-0 right-0 h-[45%] pointer-events-none"
          style={{
            background: isDark
              ? 'linear-gradient(180deg,rgba(255,255,255,.06) 0%,transparent 100%)'
              : 'linear-gradient(180deg,rgba(255,255,255,.72) 0%,rgba(255,255,255,.0) 100%)'
          }}
          aria-hidden="true"
        />

        {/* ── Shine ── */}
        <motion.div
          className={`absolute z-10 inset-0 bg-linear-to-r from-transparent ${shineVia} to-transparent pointer-events-none`}
          style={{ skewX: -15 }}
          animate={{ x: ['-130%', '230%'] }}
          transition={
            selected
              ? { duration: 0.72, repeat: Infinity, repeatDelay: 0.28, ease: 'easeInOut' }
              : { duration: 3.8, repeat: Infinity, repeatDelay: 2.4, ease: 'easeInOut' }
          }
          aria-hidden="true"
        />

        <AnimatePresence>
          {selected && (
            <motion.div
              key="shine2"
              className="absolute z-10 inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent pointer-events-none"
              style={{ skewX: -15 }}
              animate={{ x: ['-130%', '230%'] }}
              transition={{ duration: 0.72, repeat: Infinity, repeatDelay: 0.28, delay: 0.2, ease: 'easeInOut' }}
              aria-hidden="true"
            />
          )}
        </AnimatePresence>
        {/* ── Corner ornaments ── */}
        {corners.map(([pos, borders], ci) => (
          <div key={ci} className={`absolute w-2.5 h-2.5 ${pos} ${borders} ${corner} pointer-events-none`} aria-hidden="true" />
        ))}

        {/* ── Bottom edge glow ── */}
        <motion.div
          className={`absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent ${edgeVia} to-transparent pointer-events-none`}
          animate={{ opacity: selected ? [0.55, 1, 0.55] : [0.18, 0.45, 0.18] }}
          transition={{ duration: selected ? 1.2 : 2.6, repeat: Infinity, ease: 'easeInOut' }}
          aria-hidden="true"
        />

        {/* ── Badge ── */}
        {tier.badge && (
          <motion.span
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 1.3, repeat: Infinity, ease: 'easeInOut' }}
            className={`absolute top-1.5 right-1.5 text-[7.5px] font-black tracking-[.15em] uppercase px-1.5 py-0.75 z-10 pointer-events-none ${badge}`}
          >
            {tier.badge}
          </motion.span>
        )}

        {/* ── Text ── */}
        <span className={`font-mono text-[9px] tracking-[.2em] uppercase pointer-events-none ${rank}`} aria-hidden="true">
          {String(index + 1).padStart(2, '0')}
        </span>

        <motion.span
          animate={selected ? { scale: [1, 1.14, 1] } : {}}
          transition={{ duration: 0.3 }}
          className={`font-quicksand font-black leading-none pointer-events-none text-2xl sm:text-3xl transition-colors duration-200 ${price_c}`}
        >
          ${price}
        </motion.span>

        <span className={`font-mono text-[9px] pointer-events-none ${rank}`}>/{billing === 'monthly' ? 'mo' : 'yr'}</span>

        <span
          className={`font-bebas font-bold text-[10px] md:text-2xl lg:text-3xl text-center leading-tight px-2 pointer-events-none transition-colors duration-200 ${name_c}`}
        >
          {tier.name}
        </span>
      </motion.button>
    </motion.div>
  )
}

// ─── Mobile Card ─────────────────────────────────────────────────────────────────────
function MobileTierCard({
  tier,
  billing,
  selected,
  onSelect,
  index,
  isDark
}: {
  tier: (typeof TIERS)[0]
  billing: 'monthly' | 'yearly'
  selected: boolean
  onSelect: () => void
  index: number
  isDark: boolean
}) {
  const s = T[tier.tier]
  const price = tier.price[billing]

  const glow = isDark ? s.darkGlow : s.lightGlow
  const stripe = isDark ? s.darkStripe : s.lightStripe
  const borderIdle = isDark ? s.darkBorderIdle : s.lightBorderIdle
  const borderActive = isDark ? s.darkBorderActive : s.lightBorderActive
  const corner = isDark ? s.darkCorner : s.lightCorner
  const edgeVia = isDark ? s.darkEdgeVia : s.lightEdgeVia
  const badge = isDark ? s.darkBadge : s.lightBadge
  const shineVia = isDark ? s.darkShineVia : s.lightShineVia
  const rank = isDark ? s.darkRank : s.lightRank
  const price_c = selected ? (isDark ? s.darkPriceActive : s.lightPriceActive) : isDark ? s.darkPrice : s.lightPrice
  const name_c = selected ? (isDark ? s.darkNameActive : s.lightNameActive) : isDark ? s.darkName : s.lightName

  const corners = [
    ['top-[6px] left-[6px]', 'border-t-[1.5px] border-l-[1.5px]'],
    ['top-[6px] right-[6px]', 'border-t-[1.5px] border-r-[1.5px]'],
    ['bottom-[6px] left-[6px]', 'border-b-[1.5px] border-l-[1.5px]'],
    ['bottom-[6px] right-[6px]', 'border-b-[1.5px] border-r-[1.5px]']
  ]

  return (
    <motion.div
      key={tier.name}
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        duration: 0.35,
        delay: index * 0.04,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
    >
      <motion.button
        onClick={onSelect}
        whileTap={{ scale: 0.97 }}
        transition={{ type: 'spring', stiffness: 400, damping: 22 }}
        aria-pressed={selected}
        aria-label={`${tier.name} — $${price} per ${billing === 'monthly' ? 'month' : 'year'}${tier.badge ? ` — ${tier.badge}` : ''}`}
        className={`
          relative w-full overflow-hidden border-2 flex items-center gap-4 px-4 py-3.5
          transition-[border-color] duration-200
          focus:outline-none focus-visible:ring-4 focus-visible:ring-offset-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark
          ${selected ? borderActive : borderIdle}
        `}
        style={{
          background: selected
            ? `repeating-linear-gradient(45deg,${stripe} 0,${stripe} 1px,transparent 1px,transparent 8px), ${isDark ? s.darkActiveBg : s.lightActiveBg}`
            : isDark
              ? `repeating-linear-gradient(45deg,${stripe} 0,${stripe} 1px,transparent 1px,transparent 8px), ${s.darkIdleBg}`
              : `repeating-linear-gradient(45deg,${stripe} 0,${stripe} 1px,transparent 1px,transparent 8px)`,
          boxShadow: selected ? glow : isDark ? '0 2px 12px rgba(0,0,0,.55)' : '0 2px 12px rgba(0,0,0,.1), inset 0 1px 0 rgba(255,255,255,.7)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)'
        }}
      >
        {/* ── Pulse ring ── */}
        <AnimatePresence>
          {selected && (
            <motion.div
              key="ring"
              className="absolute -inset-0.5 border-[1.5px] pointer-events-none"
              style={{
                borderColor: isDark
                  ? (s.darkGlow.match(/rgba\([^)]+\)/)?.[0] ?? 'transparent')
                  : (s.lightGlow.match(/rgba\([^)]+\)/)?.[0] ?? 'transparent')
              }}
              animate={{ opacity: [0.85, 0], scale: [0.95, 1.14] }}
              transition={{ duration: 1.1, repeat: Infinity, ease: 'easeOut' }}
              aria-hidden="true"
            />
          )}
        </AnimatePresence>

        {/* ── Top gloss ── */}
        <div
          className="absolute top-0 left-0 right-0 h-[45%] pointer-events-none"
          style={{
            background: isDark
              ? 'linear-gradient(180deg,rgba(255,255,255,.06) 0%,transparent 100%)'
              : 'linear-gradient(180deg,rgba(255,255,255,.72) 0%,rgba(255,255,255,.0) 100%)'
          }}
          aria-hidden="true"
        />

        {/* ── Shine ── */}
        <motion.div
          className={`absolute z-10 inset-0 bg-linear-to-r from-transparent ${shineVia} to-transparent pointer-events-none`}
          style={{ skewX: -15 }}
          animate={{ x: ['-130%', '230%'] }}
          transition={
            selected
              ? { duration: 0.72, repeat: Infinity, repeatDelay: 0.28, ease: 'easeInOut' }
              : { duration: 3.8, repeat: Infinity, repeatDelay: 2.4, ease: 'easeInOut' }
          }
          aria-hidden="true"
        />

        {/* ── Corner ornaments ── */}
        {corners.map(([pos, borders], ci) => (
          <div key={ci} className={`absolute w-2.5 h-2.5 ${pos} ${borders} ${corner} pointer-events-none`} aria-hidden="true" />
        ))}

        {/* ── Bottom edge glow ── */}
        <motion.div
          className={`absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent ${edgeVia} to-transparent pointer-events-none`}
          animate={{ opacity: selected ? [0.55, 1, 0.55] : [0.18, 0.45, 0.18] }}
          transition={{ duration: selected ? 1.2 : 2.6, repeat: Infinity, ease: 'easeInOut' }}
          aria-hidden="true"
        />

        {/* ── Badge ── */}
        {tier.badge && (
          <motion.span
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 1.3, repeat: Infinity, ease: 'easeInOut' }}
            className={`absolute top-2 right-2 text-[7.5px] font-black tracking-[.15em] uppercase px-1.5 py-0.5 z-10 pointer-events-none ${badge}`}
          >
            {tier.badge}
          </motion.span>
        )}

        {/* ── Rank ── */}
        <span className={`font-mono text-[9px] tracking-[.2em] uppercase pointer-events-none shrink-0 ${rank}`} aria-hidden="true">
          {String(index + 1).padStart(2, '0')}
        </span>

        {/* ── Name ── */}
        <span className={`font-bebas font-bold text-xl flex-1 text-left leading-tight pointer-events-none transition-colors duration-200 ${name_c}`}>
          {tier.name}
        </span>

        {/* ── Price ── */}
        <div className="flex items-baseline gap-0.5 shrink-0 pointer-events-none">
          <motion.span
            animate={selected ? { scale: [1, 1.14, 1] } : {}}
            transition={{ duration: 0.3 }}
            className={`font-quicksand font-black text-2xl leading-none transition-colors duration-200 ${price_c}`}
          >
            ${price}
          </motion.span>
          <span className={`font-mono text-[9px] ${rank}`}>/{billing === 'monthly' ? 'mo' : 'yr'}</span>
        </div>
      </motion.button>
    </motion.div>
  )
}

function SubscriptionSelector({ setBilling, billing, selected, setSelected, isDark }) {
  return (
    <motion.div
      key="select"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.3 }}
      className="px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 pb-44"
    >
      <div className="max-w-180 1000:max-w-240 1200:max-w-260 mx-auto">
        {/* ── Header ── */}
        <div className="mb-8 sm:mb-10">
          <div className="flex items-center gap-3 mb-4">
            <span className="block w-8 h-px bg-primary-light dark:bg-primary-dark" aria-hidden="true" />
            <p className="text-xs font-mono tracking-[0.2em] uppercase text-primary-light dark:text-primary-dark">Memberships</p>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5">
            <div>
              <h1 className="font-quicksand text-4xl sm:text-5xl font-black text-text-light dark:text-text-dark leading-tight mb-2">
                Pick Your <span className="font-light text-muted-light dark:text-muted-dark">Rank</span>
              </h1>
              <p className="text-sm text-muted-light dark:text-on-dark leading-relaxed">
                16 ways to support Little Paws. Every level funds rescue, vetting, and care.
              </p>
            </div>

            {/* Billing toggle */}
            <div
              role="group"
              aria-label="Billing frequency"
              className="flex items-center border border-border-light dark:border-border-dark self-start sm:self-auto shrink-0"
            >
              {(['MONTHLY', 'YEARLY'] as const).map((b) => (
                <button
                  key={b}
                  onClick={() => setBilling(b)}
                  aria-pressed={billing === b}
                  className={`px-5 py-2.5 text-[10px] font-mono tracking-widest uppercase transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark
                          ${
                            billing === b
                              ? 'bg-button-light dark:bg-button-dark text-white'
                              : 'text-muted-light dark:text-muted-dark hover:text-text-light dark:hover:text-text-dark'
                          }`}
                >
                  {b}
                  {b === 'YEARLY' && <span className="ml-1 text-primary-light dark:text-primary-dark">↓</span>}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Tier column labels ── */}
        <div className="hidden md:grid grid-cols-4 gap-2 mb-2" aria-hidden="true">
          {(['bronze', 'silver', 'gold', 'elite'] as TierKey[]).map((k) => (
            <p key={k} className={`text-center text-[9px] font-mono tracking-widest uppercase ${T[k].labelClass}`}>
              {T[k].label}
            </p>
          ))}
        </div>

        {/* ── Tier grid — md+ ── */}
        <div className="hidden md:block" style={{ perspective: '1200px', transformStyle: 'preserve-3d' }}>
          <div
            role="list"
            aria-label="Subscription tiers"
            className="grid grid-rows-4 grid-flow-col gap-2 sm:gap-3 mb-10"
            style={{ transformStyle: 'preserve-3d' }}
          >
            {TIERS.map((tier, i) => (
              <div key={tier.id} role="listitem">
                <TierCard
                  tier={tier}
                  billing={billing}
                  selected={selected === tier.id}
                  onSelect={() => setSelected(selected === tier.id ? null : tier.id)}
                  index={i}
                  isDark={isDark}
                />
              </div>
            ))}
          </div>
        </div>

        {/* ── Tier list — mobile ── */}
        <div className="md:hidden mb-10">
          <ul role="list" aria-label="Subscription tiers" className="space-y-2">
            {TIERS.map((tier, i) => (
              <li key={tier.id} role="listitem">
                <MobileTierCard
                  tier={tier}
                  billing={billing}
                  selected={selected === tier.id}
                  onSelect={() => setSelected(selected === tier.id ? null : tier.id)}
                  index={i}
                  isDark={isDark}
                />
              </li>
            ))}
          </ul>
        </div>

        {/* ── Trust bar ── */}
        <div className="flex items-center justify-center gap-6 sm:gap-10 flex-wrap">
          {['Cancel anytime', 'Secure payment', '100% goes to rescue'].map((item) => (
            <span key={item} className="flex items-center gap-2 text-[11px] text-muted-light dark:text-muted-dark font-mono">
              <span className="w-1 h-1 bg-primary-light dark:bg-primary-dark" aria-hidden="true" />
              {item}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

function SubscriptionPayment({ setView, isDark, selectedTier, billing, savedPaymentMethods, userName }) {
  const session = useSession()
  const isAuthed = session.status === 'authenticated'
  const currentStep = isAuthed ? 3 : 2

  return (
    <motion.div
      key="payment"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.35 }}
      className="min-h-screen"
    >
      {/* ── Thin header ── */}
      <div className="border-b border-border-light dark:border-border-dark px-6 sm:px-10 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="block w-5 h-px bg-primary-light dark:bg-primary-dark" aria-hidden="true" />
          <p className="text-[10px] font-mono tracking-[0.2em] uppercase text-primary-light dark:text-primary-dark">Little Paws Dachshund Rescue</p>
        </div>
        <button
          type="button"
          onClick={() => setView('select')}
          className="inline-flex items-center gap-2 text-[10px] font-mono tracking-[0.2em] uppercase text-muted-light dark:text-muted-dark hover:text-primary-light dark:hover:text-primary-dark transition-colors focus:outline-none focus-visible:underline"
        >
          <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
          Change plan
        </button>
      </div>
      {/* Two-col layout — summary left, form right */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] min-h-screen">
        {/* ── Left — plan summary ── */}
        <div className="lg:border-r border-border-light dark:border-border-dark px-6 sm:px-10 pt-12 sm:pt-16 pb-12 flex flex-col">
          <div className="lg:sticky lg:top-16">
            {/* Back */}
            <button
              type="button"
              onClick={() => setView('select')}
              className="inline-flex items-center gap-2 text-[10px] font-mono tracking-[0.2em] uppercase text-muted-light dark:text-muted-dark hover:text-primary-light dark:hover:text-primary-dark transition-colors focus:outline-none focus-visible:underline mb-10"
            >
              <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
              Change plan
            </button>

            {/* Eyebrow */}
            <div className="flex items-center gap-3 mb-4">
              <span className="block w-8 h-px bg-primary-light dark:bg-primary-dark" aria-hidden="true" />
              <p className="text-xs font-mono tracking-[0.2em] uppercase text-primary-light dark:text-primary-dark">Memberships</p>
            </div>

            <h1 className="font-quicksand text-3xl sm:text-4xl font-black text-text-light dark:text-text-dark leading-tight mb-1">Complete your</h1>
            <h1 className="font-quicksand text-3xl sm:text-4xl font-light text-muted-light dark:text-muted-dark leading-tight mb-8">subscription</h1>

            {/* Plan card */}
            <div className="border border-border-light dark:border-border-dark p-5 mb-6">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <span
                    className={`text-[9px] font-mono tracking-[0.2em] uppercase px-2 py-0.5 border border-border-light dark:border-border-dark ${isDark ? T[selectedTier!.tier].labelClass : T[selectedTier!.tier].labelClass}`}
                  >
                    {T[selectedTier!.tier].label}
                  </span>
                  <p className="font-quicksand font-black text-xl text-text-light dark:text-text-dark mt-2">{selectedTier?.name}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-quicksand font-black text-3xl text-primary-light dark:text-primary-dark tabular-nums">
                    ${selectedTier?.price[billing]}
                  </p>
                  <p className="text-[10px] font-mono text-muted-light dark:text-muted-dark">/{billing === 'MONTHLY' ? 'mo' : 'yr'}</p>
                </div>
              </div>

              {billing === 'yearly' && (
                <div className="pt-4 border-t border-border-light dark:border-border-dark flex items-center justify-between">
                  <span className="text-[10px] font-mono tracking-[0.15em] uppercase text-muted-light dark:text-muted-dark">You save</span>
                  <span
                    className={`font-quicksand font-black text-lg ${isDark ? T[selectedTier!.tier].darkPriceActive : T[selectedTier!.tier].lightPriceActive}`}
                  >
                    ${selectedTier!.price.monthly * 12 - selectedTier!.price.yearly}
                  </span>
                </div>
              )}
            </div>

            {/* Trust */}
            <div className="space-y-2">
              {['Cancel anytime', 'Secure payment', '100% goes to rescue'].map((item) => (
                <span key={item} className="flex items-center gap-2 text-[11px] text-muted-light dark:text-muted-dark font-mono">
                  <span className="w-1 h-1 bg-primary-light dark:bg-primary-dark shrink-0" aria-hidden="true" />
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ── Right — form ── */}
        <div className="px-6 sm:px-10 pt-12 sm:pt-16 pb-24">
          <div className="max-w-md w-full mx-auto lg:mx-0">
            <StepIndicator current={currentStep} total={3} labels={paymentStepLabels} />
            <SignedInRow />
            {currentStep === 2 && <StepSignIn redirectTo={`/subscriptions?tier=${selectedTier.id}&billing=${billing}&view=payment`} />}
            {currentStep === 3 && (
              <div className="mt-8">
                <SubscriptionPaymentForm tier={selectedTier!} billing={billing} savedCards={savedPaymentMethods} userName={userName} />
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function SubscriptionStickyBar({ selected, selectedTier, isDark, billing, setView }) {
  return (
    <AnimatePresence>
      {selected && selectedTier && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 350, damping: 35 }}
          className="fixed bottom-0 left-0 right-0 z-50"
          role="region"
          aria-label="Selected plan checkout"
          aria-live="polite"
        >
          <div className="border-t border-border-dark bg-navbar-light dark:bg-navbar-dark/90 px-4 py-4 sm:py-5">
            <div className="max-w-5xl mx-auto flex flex-col xs:flex-row items-start xs:items-center justify-between gap-4">
              <div className="flex items-center gap-5 flex-wrap">
                <div>
                  <span className="block text-[9px] font-mono tracking-[0.2em] uppercase text-on-dark mb-0.5">Selected</span>
                  <span
                    className={`font-quicksand font-black text-lg leading-none ${isDark ? T[selectedTier.tier].darkPriceActive : T[selectedTier.tier].lightPriceActive}`}
                  >
                    {selectedTier.name}
                  </span>
                </div>
                <div className="w-px h-8 bg-white/10" aria-hidden="true" />
                <div>
                  <span className="block text-[9px] font-mono tracking-[0.2em] uppercase text-on-dark mb-0.5">{billing}</span>
                  <span className="font-quicksand font-black text-lg text-white">
                    ${selectedTier.price[billing]}
                    <span className="text-xs font-mono text-on-dark ml-1">/{billing === 'monthly' ? 'mo' : 'yr'}</span>
                  </span>
                </div>
                {billing === 'yearly' && (
                  <>
                    <div className="w-px h-8 bg-white/10" aria-hidden="true" />
                    <div>
                      <span className="block text-[9px] font-mono tracking-[0.2em] uppercase text-on-dark mb-0.5">You save</span>
                      <span
                        className={`font-quicksand font-black text-lg ${isDark ? T[selectedTier.tier].darkPriceActive : T[selectedTier.tier].lightPriceActive}`}
                      >
                        ${selectedTier.price.monthly * 12 - selectedTier.price.yearly}
                      </span>
                    </div>
                  </>
                )}
              </div>
              <motion.button
                onClick={() => setView('payment')}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="w-full xs:w-auto bg-primary-light dark:bg-primary-dark hover:bg-secondary-light dark:hover:bg-secondary-dark text-white font-black text-[10px] tracking-[0.2em] uppercase py-3.5 px-10 transition-colors duration-200 focus:outline-none focus-visible:ring-4 focus-visible:ring-white"
                aria-label={`Subscribe to ${selectedTier.name} for $${selectedTier.price[billing]} per ${billing === 'monthly' ? 'month' : 'year'}`}
              >
                Subscribe Now
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

const paymentStepLabels = ['Choose Plan', 'Sign-In', 'Payment']

type IPublicSubscriptionsClient = {
  savedPaymentMethods: IPaymentMethod[]
  userName: { firstName: string; lastName: string }
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function PublicSubscriptionsClient({ savedPaymentMethods, userName }: IPublicSubscriptionsClient) {
  const searchParams = useSearchParams()
  const [billing, setBilling] = useState<'MONTHLY' | 'YEARLY'>((searchParams.get('billing') as 'MONTHLY' | 'YEARLY') ?? 'MONTHLY')
  const [view, setView] = useState<'select' | 'payment'>((searchParams.get('view') as 'select' | 'payment') ?? 'select')
  const [selected, setSelected] = useState<string | null>(searchParams.get('tier'))
  const { isDark } = useUiSelector()

  const selectedTier = TIERS.find((t) => t.id === selected)

  return (
    <main id="main-content" className="min-h-screen bg-bg-light dark:bg-bg-dark text-text-light dark:text-text-dark">
      <SubscriptionStickyHeader billing={billing as 'monthly' | 'yearly'} onSubscribe={() => setView('payment')} selected={selected} view={view} />
      {view === 'select' && (
        <motion.div
          className="w-fit -ml-4 xs:-ml-6 sm:-ml-10 fixed -bottom-7 left-0"
          animate={{ y: [0, -6, 0], opacity: [0.7, 1, 0.7] }}
          transition={{
            duration: 4,
            ease: 'easeInOut',
            repeat: Infinity,
            repeatType: 'loop'
          }}
        >
          <Picture src="/images/cartoon-dachshund-1.png" className="h-48 xs:h-64 sm:h-96 1000:h-128 1200:h-160 w-auto object-contain" priority />
        </motion.div>
      )}

      <AnimatePresence mode="wait">
        {/* ════════════════════════════════════════
            VIEW: SELECT
        ════════════════════════════════════════ */}
        {view === 'select' && (
          <SubscriptionSelector billing={billing} isDark={isDark} selected={selected} setBilling={setBilling} setSelected={setSelected} />
        )}

        {/* ════════════════════════════════════════
            VIEW: PAYMENT
        ════════════════════════════════════════ */}
        {view === 'payment' && selectedTier && (
          <SubscriptionPayment
            billing={billing}
            isDark={isDark}
            savedPaymentMethods={savedPaymentMethods}
            selectedTier={selectedTier}
            setView={setView}
            userName={userName}
          />
        )}
      </AnimatePresence>

      {/* ════════════════════════════════════════
            STICKY BAR
        ════════════════════════════════════════ */}
      {view === 'select' && (
        <SubscriptionStickyBar billing={billing} isDark={isDark} selected={selected} selectedTier={selectedTier} setView={setView} />
      )}
    </main>
  )
}
