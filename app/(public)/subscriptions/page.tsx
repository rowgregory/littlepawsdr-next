'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useUiSelector } from 'app/lib/store/store'
import Picture from 'app/components/common/Picture'

// ─── Data ─────────────────────────────────────────────────────────────────────
const TIERS = [
  {
    id: 't1',
    name: 'Tail Wagger',
    price: { monthly: 3, yearly: 30 },
    badge: null,
    tier: 'bronze' as const,
    image: '/images/subscriptions/bronze-1.png'
  },
  {
    id: 't2',
    name: 'Snout Scout',
    price: { monthly: 5, yearly: 50 },
    badge: null,
    tier: 'bronze' as const,
    image: '/images/subscriptions/bronze-2.png'
  },
  { id: 't3', name: 'Paw Pal', price: { monthly: 7, yearly: 70 }, badge: null, tier: 'bronze' as const, image: '/images/subscriptions/bronze-3.png' },
  {
    id: 't4',
    name: 'Biscuit Buddy',
    price: { monthly: 10, yearly: 100 },
    badge: null,
    tier: 'bronze' as const,
    image: '/images/subscriptions/bronze-4.png'
  },
  {
    id: 't5',
    name: 'Foster Friend',
    price: { monthly: 15, yearly: 150 },
    badge: 'HOT',
    tier: 'silver' as const,
    image: '/images/subscriptions/silver-1.png'
  },
  {
    id: 't6',
    name: 'Belly Rubber',
    price: { monthly: 20, yearly: 200 },
    badge: null,
    tier: 'silver' as const,
    image: '/images/subscriptions/silver-2.png'
  },
  {
    id: 't7',
    name: 'Pack Member',
    price: { monthly: 25, yearly: 250 },
    badge: null,
    tier: 'silver' as const,
    image: '/images/subscriptions/silver-3.png'
  },
  {
    id: 't8',
    name: 'Den Leader',
    price: { monthly: 30, yearly: 300 },
    badge: 'POPULAR',
    tier: 'silver' as const,
    image: '/images/subscriptions/silver-4.png'
  },
  { id: 't9', name: 'Alpha Pup', price: { monthly: 40, yearly: 400 }, badge: null, tier: 'gold' as const },
  { id: 't10', name: 'Wiener Guard', price: { monthly: 50, yearly: 500 }, badge: null, tier: 'gold' as const },
  { id: 't11', name: 'Pack Guardian', price: { monthly: 60, yearly: 600 }, badge: 'VALUE', tier: 'gold' as const },
  { id: 't12', name: 'Top Dog', price: { monthly: 75, yearly: 750 }, badge: null, tier: 'gold' as const },
  { id: 't13', name: 'Rescue Rider', price: { monthly: 100, yearly: 1000 }, badge: null, tier: 'elite' as const },
  { id: 't14', name: 'Silver Paw', price: { monthly: 150, yearly: 1500 }, badge: null, tier: 'elite' as const },
  { id: 't15', name: 'Golden Doxie', price: { monthly: 200, yearly: 2000 }, badge: 'RARE', tier: 'elite' as const },
  { id: 't16', name: 'Pack Champion', price: { monthly: 500, yearly: 5000 }, badge: 'ELITE', tier: 'elite' as const }
]

type TierKey = 'bronze' | 'silver' | 'gold' | 'elite'

// All values split by dark / light so we never fight Tailwind's dark: prefix
const T: Record<
  TierKey,
  {
    // card backgrounds (inline style)
    darkIdleBg: string
    darkActiveBg: string
    lightIdleBg: string
    lightActiveBg: string
    darkIdle: string
    darkActive: string
    lightIdle: string
    lightActive: string
    // box-shadow glows (inline style)
    darkGlow: string
    lightGlow: string
    // text colours (Tailwind class)
    darkRank: string
    lightRank: string
    darkPrice: string
    lightPrice: string
    darkPriceActive: string
    lightPriceActive: string
    darkName: string
    lightName: string
    darkNameActive: string
    lightNameActive: string
    // border
    darkBorderIdle: string
    darkBorderActive: string
    lightBorderIdle: string
    lightBorderActive: string
    // corner / edge / badge
    darkCorner: string
    lightCorner: string
    darkEdgeVia: string
    lightEdgeVia: string
    darkBadge: string
    lightBadge: string
    darkShineVia: string
    lightShineVia: string
    // stripe colour (inline)
    darkStripe: string
    lightStripe: string
    label: string
    labelClass: string
  }
> = {
  bronze: {
    darkIdleBg: 'rgba(0,0,0,.88)',
    darkActiveBg: 'rgba(60,20,0,.92)',
    lightIdleBg: 'rgba(255,252,250,.82)',
    lightActiveBg: 'rgba(200,90,20,.15)',
    darkIdle: 'linear-gradient(135deg,rgba(50,20,5,.80) 0%,rgba(28,10,2,.90) 100%)',
    darkActive: 'linear-gradient(135deg,rgba(60,26,6,.90) 0%,rgba(35,14,3,.95) 100%)',
    lightIdle: 'linear-gradient(135deg,rgba(255,228,195,.70) 0%,rgba(255,210,170,.55) 100%)',
    lightActive: 'linear-gradient(135deg,rgba(255,232,205,.85) 0%,rgba(255,218,182,.70) 100%)',
    darkGlow: '0 0 30px 7px rgba(224,123,48,.55),0 0 90px 20px rgba(224,123,48,.22),inset 0 1px 0 rgba(255,200,100,.14)',
    lightGlow: '0 0 28px 6px rgba(200,90,20,.32),0 0 70px 14px rgba(200,90,20,.13),inset 0 1px 0 rgba(255,255,255,.95)',
    darkRank: 'text-[rgba(180,80,20,.5)]',
    lightRank: 'text-[rgba(160,70,10,.45)]',
    darkPrice: 'text-[#e07b30]',
    lightPrice: 'text-[#b85010]',
    darkPriceActive: 'text-[#ff9040]',
    lightPriceActive: 'text-[#c05818]',
    darkName: 'text-[#b06030]',
    lightName: 'text-[#904010]',
    darkNameActive: 'text-[#ffa050]',
    lightNameActive: 'text-[#a04810]',
    darkBorderIdle: 'border-[rgba(180,80,20,.32)]',
    darkBorderActive: 'border-[rgba(224,123,48,.72)]',
    lightBorderIdle: 'border-[rgba(200,100,30,.22)]',
    lightBorderActive: 'border-[rgba(200,90,20,.62)]',
    darkCorner: 'border-[rgba(224,123,48,.35)]',
    lightCorner: 'border-[rgba(180,80,20,.28)]',
    darkEdgeVia: 'via-[#e07b30]',
    lightEdgeVia: 'via-[rgba(200,90,20,.6)]',
    darkBadge: 'bg-[#e07b30] text-black',
    lightBadge: 'bg-[rgba(190,80,15,.9)] text-white',
    darkShineVia: 'via-[rgba(255,180,80,.22)]',
    lightShineVia: 'via-[rgba(255,255,255,.55)]',
    darkStripe: 'rgba(180,80,20,.055)',
    lightStripe: 'rgba(180,80,20,.045)',
    label: 'Bronze',
    labelClass: 'text-[#e07b30]'
  },
  silver: {
    darkIdleBg: 'rgba(8,26,46,.82)',
    darkActiveBg: 'rgba(10,34,56,.92)',
    lightIdleBg: 'rgba(255,252,250,.82)',
    lightActiveBg: 'rgba(8,120,160,.15)',
    darkIdle: 'linear-gradient(135deg,rgba(8,26,46,.80) 0%,rgba(4,16,32,.90) 100%)',
    darkActive: 'linear-gradient(135deg,rgba(10,34,56,.90) 0%,rgba(6,20,40,.95) 100%)',
    lightIdle: 'linear-gradient(135deg,rgba(198,238,255,.70) 0%,rgba(178,224,250,.55) 100%)',
    lightActive: 'linear-gradient(135deg,rgba(208,244,255,.85) 0%,rgba(188,232,255,.70) 100%)',
    darkGlow: '0 0 30px 7px rgba(8,145,178,.60),0 0 90px 20px rgba(8,145,178,.24),inset 0 1px 0 rgba(100,220,255,.16)',
    lightGlow: '0 0 28px 6px rgba(8,130,165,.35),0 0 70px 14px rgba(8,130,165,.14),inset 0 1px 0 rgba(255,255,255,.95)',
    darkRank: 'text-[rgba(8,100,140,.55)]',
    lightRank: 'text-[rgba(8,100,140,.42)]',
    darkPrice: 'text-[#0891b2]',
    lightPrice: 'text-[#0070a0]',
    darkPriceActive: 'text-[#30c0e0]',
    lightPriceActive: 'text-[#0080b8]',
    darkName: 'text-[#0a7090]',
    lightName: 'text-[#005880]',
    darkNameActive: 'text-[#60d0f0]',
    lightNameActive: 'text-[#006898]',
    darkBorderIdle: 'border-[rgba(8,100,140,.32)]',
    darkBorderActive: 'border-[rgba(8,145,178,.72)]',
    lightBorderIdle: 'border-[rgba(8,120,160,.20)]',
    lightBorderActive: 'border-[rgba(8,120,160,.58)]',
    darkCorner: 'border-[rgba(8,145,178,.35)]',
    lightCorner: 'border-[rgba(8,120,160,.26)]',
    darkEdgeVia: 'via-[#0891b2]',
    lightEdgeVia: 'via-[rgba(8,120,160,.55)]',
    darkBadge: 'bg-[#0891b2] text-white',
    lightBadge: 'bg-[rgba(7,100,138,.9)] text-white',
    darkShineVia: 'via-[rgba(100,220,255,.22)]',
    lightShineVia: 'via-[rgba(255,255,255,.58)]',
    darkStripe: 'rgba(8,100,140,.055)',
    lightStripe: 'rgba(8,100,140,.04)',
    label: 'Silver',
    labelClass: 'text-[#0891b2]'
  },
  gold: {
    darkIdleBg: 'rgba(18,8,42,.82)',
    darkActiveBg: 'rgba(24,10,52,.92)',
    lightIdleBg: 'rgba(255,252,250,.82)',
    lightActiveBg: 'rgba(110,55,210,.15)',
    darkIdle: 'linear-gradient(135deg,rgba(18,8,42,.80) 0%,rgba(10,4,28,.90) 100%)',
    darkActive: 'linear-gradient(135deg,rgba(24,10,52,.90) 0%,rgba(14,6,36,.95) 100%)',
    lightIdle: 'linear-gradient(135deg,rgba(228,212,255,.70) 0%,rgba(212,192,255,.55) 100%)',
    lightActive: 'linear-gradient(135deg,rgba(236,222,255,.85) 0%,rgba(222,204,255,.70) 100%)',
    darkGlow: '0 0 30px 7px rgba(139,92,246,.60),0 0 90px 20px rgba(139,92,246,.24),inset 0 1px 0 rgba(200,170,255,.14)',
    lightGlow: '0 0 28px 6px rgba(120,60,220,.32),0 0 70px 14px rgba(120,60,220,.13),inset 0 1px 0 rgba(255,255,255,.95)',
    darkRank: 'text-[rgba(100,40,180,.50)]',
    lightRank: 'text-[rgba(100,40,180,.38)]',
    darkPrice: 'text-[#a78bfa]',
    lightPrice: 'text-[#6030b0]',
    darkPriceActive: 'text-[#c8b0ff]',
    lightPriceActive: 'text-[#7040c8]',
    darkName: 'text-[#7040c0]',
    lightName: 'text-[#5028a0]',
    darkNameActive: 'text-[#d0b0ff]',
    lightNameActive: 'text-[#6030b8]',
    darkBorderIdle: 'border-[rgba(100,40,180,.32)]',
    darkBorderActive: 'border-[rgba(139,92,246,.72)]',
    lightBorderIdle: 'border-[rgba(120,60,220,.20)]',
    lightBorderActive: 'border-[rgba(120,60,220,.56)]',
    darkCorner: 'border-[rgba(139,92,246,.35)]',
    lightCorner: 'border-[rgba(100,50,200,.26)]',
    darkEdgeVia: 'via-[#8b5cf6]',
    lightEdgeVia: 'via-[rgba(120,60,220,.55)]',
    darkBadge: 'bg-[#8b5cf6] text-white',
    lightBadge: 'bg-[rgba(110,55,210,.9)] text-white',
    darkShineVia: 'via-[rgba(200,170,255,.22)]',
    lightShineVia: 'via-[rgba(255,255,255,.58)]',
    darkStripe: 'rgba(100,40,180,.055)',
    lightStripe: 'rgba(100,40,180,.04)',
    label: 'Gold',
    labelClass: 'text-[#a78bfa]'
  },
  elite: {
    darkIdleBg: 'rgba(38,22,0,.82)',
    darkActiveBg: 'rgba(48,28,0,.92)',
    lightIdleBg: 'rgba(255,252,250,.82)',
    lightActiveBg: 'rgba(180,120,0,.15)',
    darkIdle: 'linear-gradient(135deg,rgba(38,22,0,.80) 0%,rgba(22,12,0,.90) 100%)',
    darkActive: 'linear-gradient(135deg,rgba(48,28,0,.90) 0%,rgba(28,16,0,.95) 100%)',
    lightIdle: 'linear-gradient(135deg,rgba(255,244,195,.70) 0%,rgba(255,232,165,.55) 100%)',
    lightActive: 'linear-gradient(135deg,rgba(255,248,210,.85) 0%,rgba(255,238,180,.70) 100%)',
    darkGlow: '0 0 30px 7px rgba(245,158,11,.65),0 0 90px 22px rgba(245,158,11,.28),inset 0 1px 0 rgba(255,228,80,.16)',
    lightGlow: '0 0 28px 6px rgba(190,130,0,.36),0 0 70px 14px rgba(190,130,0,.14),inset 0 1px 0 rgba(255,255,255,.95)',
    darkRank: 'text-[rgba(160,100,0,.55)]',
    lightRank: 'text-[rgba(150,90,0,.45)]',
    darkPrice: 'text-[#f59e0b]',
    lightPrice: 'text-[#9a6800]',
    darkPriceActive: 'text-[#ffc040]',
    lightPriceActive: 'text-[#aa7800]',
    darkName: 'text-[#b07800]',
    lightName: 'text-[#7a5000]',
    darkNameActive: 'text-[#ffd060]',
    lightNameActive: 'text-[#8a6000]',
    darkBorderIdle: 'border-[rgba(160,100,0,.32)]',
    darkBorderActive: 'border-[rgba(245,158,11,.75)]',
    lightBorderIdle: 'border-[rgba(180,120,0,.24)]',
    lightBorderActive: 'border-[rgba(190,130,0,.62)]',
    darkCorner: 'border-[rgba(245,158,11,.38)]',
    lightCorner: 'border-[rgba(170,110,0,.30)]',
    darkEdgeVia: 'via-[#f59e0b]',
    lightEdgeVia: 'via-[rgba(190,130,0,.6)]',
    darkBadge: 'bg-[#f59e0b] text-black',
    lightBadge: 'bg-[rgba(170,110,0,.9)] text-white',
    darkShineVia: 'via-[rgba(255,228,80,.22)]',
    lightShineVia: 'via-[rgba(255,255,255,.58)]',
    darkStripe: 'rgba(160,100,0,.055)',
    lightStripe: 'rgba(160,100,0,.04)',
    label: 'Elite',
    labelClass: 'text-[#f59e0b]'
  }
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
      initial={{ opacity: 0, scale: 0.82, y: 24 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.38, delay: index * 0.04, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="aspect-square"
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
        {tier?.image && <Picture src={tier?.image} className="w-full h-full absolute" alt="Little Paws Subscriptions" priority={true} />}

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
          className={`font-quicksand font-bold text-[10px] sm:text-[11px] text-center leading-tight px-2 pointer-events-none transition-colors duration-200 ${name_c}`}
        >
          {tier.name}
        </span>
      </motion.button>
    </motion.div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function SubscriptionsClient() {
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('monthly')
  const [selected, setSelected] = useState<string | null>(null)
  const { isDark } = useUiSelector()

  const selectedTier = TIERS.find((t) => t.id === selected)

  return (
    <main
      id="main-content"
      className="min-h-screen bg-bg-light dark:bg-bg-dark text-text-light dark:text-text-dark px-4 sm:px-6 pt-12 sm:pt-16 pb-36 sm:pb-44"
    >
      <div className="mx-auto max-w-180 1000:max-w-240 1200:max-w-300">
        {/* ── Header ── */}
        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-8 sm:mb-10">
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
            <div
              role="group"
              aria-label="Billing frequency"
              className="flex items-center border border-border-light dark:border-border-dark self-start sm:self-auto shrink-0"
            >
              {(['monthly', 'yearly'] as const).map((b) => (
                <button
                  key={b}
                  onClick={() => setBilling(b)}
                  aria-pressed={billing === b}
                  className={`px-5 py-2.5 text-[10px] font-mono tracking-widest uppercase transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark ${
                    billing === b
                      ? 'bg-button-light dark:bg-button-dark text-white'
                      : 'text-muted-light dark:text-muted-dark hover:text-text-light dark:hover:text-text-dark'
                  }`}
                >
                  {b}
                  {b === 'yearly' && <span className="ml-1 text-primary-light dark:text-primary-dark">↓</span>}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ── Tier column labels ── */}
        <div className="hidden xs:grid grid-cols-4 gap-2 mb-2" aria-hidden="true">
          {(['bronze', 'silver', 'gold', 'elite'] as TierKey[]).map((k) => (
            <p key={k} className={`text-center text-[9px] font-mono tracking-widest uppercase ${T[k].labelClass}`}>
              {T[k].label}
            </p>
          ))}
        </div>

        {/* ── Grid ── */}
        <div role="list" aria-label="Subscription tiers" className="grid grid-rows-4 grid-flow-col gap-2 sm:gap-3 mb-8">
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

      {/* ── Sticky checkout bar ── */}
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
            <div className="border-t border-border-dark bg-navbar-light dark:bg-navbar-dark px-4 py-4 sm:py-5">
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
    </main>
  )
}
