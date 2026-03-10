'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { fadeUp } from 'app/lib/constants/motion'
import { WelcomeWiener } from '@prisma/client'
import Picture from '../common/Picture'

// ─── Types ────────────────────────────────────────────────────────────────────

interface WelcomeWienersClientProps {
  dogs: WelcomeWiener[]
}

// ─── Dog Card ─────────────────────────────────────────────────────────────────
function DogCard({ dog, index, onOpen }: { dog: WelcomeWiener; index: number; onOpen: () => void }) {
  const photo = dog.displayUrl ?? dog.images?.[0] ?? null

  return (
    <motion.div variants={fadeUp} initial="hidden" animate="show" custom={index % 8} className="group">
      <motion.button
        onClick={onOpen}
        whileHover={{ y: -4 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: 'spring', stiffness: 380, damping: 24 }}
        aria-label={`View ${dog.name ?? 'dog'} — click to donate`}
        className="relative w-full text-left overflow-hidden border border-border-light dark:border-border-dark bg-bg-light dark:bg-bg-dark hover:border-primary-light/50 dark:hover:border-primary-dark/50 transition-colors duration-200 focus:outline-none focus-visible:ring-4 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark"
      >
        {/* Photo */}
        <div className="relative aspect-square overflow-hidden bg-surface-light dark:bg-surface-dark">
          {photo ? (
            <Picture
              priority={false}
              src={photo}
              alt={dog.name ?? 'Welcome Wiener'}
              className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-mono text-muted-light dark:text-muted-dark">No photo</span>
            </div>
          )}

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" aria-hidden="true" />

          {/* Badges */}
          <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5">
            {dog.isDogBoost && (
              <span className="text-[9px] font-black tracking-widest uppercase px-2 py-0.5 bg-primary-light dark:bg-primary-dark text-white">
                Dog Boost
              </span>
            )}
            {!dog.isLive && (
              <span className="text-[9px] font-black tracking-widest uppercase px-2 py-0.5 bg-surface-dark/80 text-on-dark">Offline</span>
            )}
          </div>

          {/* Live indicator */}
          {dog.isLive && (
            <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5">
              <motion.span
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 1.4, repeat: Infinity }}
                className="block w-1.5 h-1.5 bg-green-400"
                aria-hidden="true"
              />
              <span className="text-[9px] font-mono text-white tracking-widest uppercase">Live</span>
            </div>
          )}

          {/* Name over photo bottom */}
          <div className="absolute bottom-0 left-0 right-0 p-3">
            <p className="font-quicksand font-black text-white text-base leading-tight drop-shadow">{dog.name ?? 'Unknown'}</p>
            {dog.age && <p className="text-[10px] font-mono text-white/70 mt-0.5">{dog.age}</p>}
          </div>
        </div>

        {/* Bottom — products */}
        <div className="p-3 border-t border-border-light dark:border-border-dark">
          {dog.associatedProducts.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {dog.associatedProducts.slice(0, 3).map((p: any) => (
                <span
                  key={p.id}
                  className="text-[9px] font-mono tracking-wide border border-border-light dark:border-border-dark text-muted-light dark:text-muted-dark px-2 py-0.5"
                >
                  ${Number(p.price).toFixed(0)}
                </span>
              ))}
              {dog.associatedProducts.length > 3 && (
                <span className="text-[9px] font-mono text-muted-light dark:text-muted-dark px-1 py-0.5">
                  +{dog.associatedProducts.length - 3} more
                </span>
              )}
            </div>
          ) : (
            <p className="text-[10px] font-mono text-muted-light dark:text-muted-dark">No donation tiers yet</p>
          )}
        </div>
      </motion.button>
    </motion.div>
  )
}

// ─── Dog Modal ────────────────────────────────────────────────────────────────
function DogModal({ dog, onClose }: { dog: WelcomeWiener; onClose: () => void }) {
  const [activePhoto, setActivePhoto] = useState(0)
  const photos = [dog.displayUrl, ...dog.images].filter(Boolean) as string[]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8"
      role="dialog"
      aria-modal="true"
      aria-label={`${dog.name ?? 'Dog'} profile`}
    >
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <motion.div
        initial={{ opacity: 0, scale: 0.93, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.93, y: 20 }}
        transition={{ type: 'spring', stiffness: 320, damping: 28 }}
        className="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-bg-light dark:bg-bg-dark border border-border-light dark:border-border-dark"
      >
        {/* Close */}
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 z-20 text-muted-light dark:text-muted-dark hover:text-text-light dark:hover:text-text-dark transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark p-1"
        >
          <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="square" aria-hidden="true">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        <div className="grid grid-cols-1 sm:grid-cols-2">
          {/* Photos */}
          <div className="relative">
            <div className="aspect-square overflow-hidden bg-surface-light dark:bg-surface-dark">
              <AnimatePresence mode="wait">
                <motion.img
                  key={activePhoto}
                  src={photos[activePhoto] ?? ''}
                  alt={`${dog.name ?? 'Dog'} photo ${activePhoto + 1}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="w-full h-full object-cover object-center"
                />
              </AnimatePresence>
            </div>
            {photos.length > 1 && (
              <div className="flex gap-1 p-2 bg-surface-light dark:bg-surface-dark overflow-x-auto">
                {photos.map((src, i) => (
                  <button
                    key={i}
                    onClick={() => setActivePhoto(i)}
                    aria-label={`Photo ${i + 1}`}
                    aria-pressed={activePhoto === i}
                    className={`shrink-0 w-10 h-10 overflow-hidden border-2 transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark ${
                      activePhoto === i ? 'border-primary-light dark:border-primary-dark' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <Picture priority={false} src={src} alt="" aria-hidden="true" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="p-5 sm:p-6 flex flex-col gap-4">
            {/* Header */}
            <div>
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                {dog.isDogBoost && (
                  <span className="text-[9px] font-black tracking-widest uppercase px-2 py-0.5 bg-primary-light dark:bg-primary-dark text-white">
                    Dog Boost
                  </span>
                )}
                {dog.isLive && (
                  <span className="flex items-center gap-1.5 text-[9px] font-mono text-green-500 tracking-widest uppercase">
                    <motion.span
                      animate={{ opacity: [1, 0.3, 1] }}
                      transition={{ duration: 1.4, repeat: Infinity }}
                      className="block w-1.5 h-1.5 bg-green-400"
                      aria-hidden="true"
                    />
                    Live
                  </span>
                )}
              </div>
              <h2 className="font-quicksand font-black text-2xl text-text-light dark:text-text-dark leading-tight">{dog.name ?? 'Unknown'}</h2>
              {dog.age && <p className="text-xs font-mono text-muted-light dark:text-muted-dark mt-0.5">{dog.age}</p>}
            </div>

            {/* Bio */}
            {dog.bio && (
              <p className="text-sm text-muted-light dark:text-on-dark leading-relaxed border-t border-border-light dark:border-border-dark pt-4">
                {dog.bio}
              </p>
            )}

            {/* Donation products */}
            {dog.associatedProducts.length > 0 && (
              <div className="border-t border-border-light dark:border-border-dark pt-4">
                <p className="text-[10px] font-mono tracking-[0.2em] uppercase text-muted-light dark:text-muted-dark mb-3">
                  Support {dog.name ?? 'this dog'}
                </p>
                <div className="grid grid-cols-1 gap-2">
                  {dog.associatedProducts.map((product: any, i) => (
                    <motion.button
                      key={product.id}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.06 }}
                      whileHover={{ x: 4 }}
                      aria-label={`Donate ${product.name} — $${Number(product.price).toFixed(2)}`}
                      className="flex items-center justify-between px-4 py-3 border border-border-light dark:border-border-dark hover:border-primary-light dark:hover:border-primary-dark bg-surface-light dark:bg-surface-dark hover:bg-primary-light/5 dark:hover:bg-primary-dark/5 transition-colors duration-200 text-left group/btn focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark"
                    >
                      <span className="text-xs font-semibold text-text-light dark:text-text-dark group-hover/btn:text-primary-light dark:group-hover/btn:text-primary-dark transition-colors duration-200 leading-snug pr-3">
                        {product.name}
                      </span>
                      <span className="font-quicksand font-black text-sm text-primary-light dark:text-primary-dark shrink-0">
                        ${Number(product.price).toFixed(2)}
                      </span>
                    </motion.button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function WelcomeWienersClient({ dogs }: WelcomeWienersClientProps) {
  const [activeFilter, setActiveFilter] = useState<'all' | 'live' | 'boost'>('all')
  const [openDog, setOpenDog] = useState<WelcomeWiener | null>(null)

  const filtered = dogs.filter((d) => {
    if (activeFilter === 'live') return d.isLive
    if (activeFilter === 'boost') return d.isDogBoost
    return true
  })

  const counts = {
    all: dogs.length,
    live: dogs.filter((d) => d.isLive).length,
    boost: dogs.filter((d) => d.isDogBoost).length
  }

  return (
    <main id="main-content" className="min-h-screen bg-bg-light dark:bg-bg-dark text-text-light dark:text-text-dark">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-12 sm:pt-16 pb-24 sm:pb-32">
        {/* ── Header ── */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={0} className="mb-10 sm:mb-12">
          <div className="flex items-center gap-3 mb-3">
            <span className="block w-6 h-px bg-primary-light dark:bg-primary-dark shrink-0" aria-hidden="true" />
            <p className="text-xs font-mono tracking-[0.2em] uppercase text-primary-light dark:text-primary-dark">Welcome Wieners</p>
          </div>
          <h1 className="font-quicksand text-4xl sm:text-5xl font-black text-text-light dark:text-text-dark leading-tight mb-3">
            Meet the <span className="font-light text-muted-light dark:text-muted-dark">Dogs</span>
          </h1>
          <p className="text-sm text-muted-light dark:text-on-dark max-w-md leading-relaxed">
            These dogs are in our care and need your support. Choose a dog and a donation level to help directly.
          </p>
        </motion.div>

        {/* ── Filters ── */}
        <motion.nav variants={fadeUp} initial="hidden" animate="show" custom={1} aria-label="Filter dogs" className="mb-8">
          <ul className="flex items-center gap-2 flex-wrap" role="list">
            {(
              [
                { value: 'all', label: 'All' },
                { value: 'live', label: 'Live' },
                { value: 'boost', label: 'Dog Boost' }
              ] as const
            ).map((f) => (
              <li key={f.value}>
                <button
                  onClick={() => setActiveFilter(f.value)}
                  aria-pressed={activeFilter === f.value}
                  aria-label={`Show ${f.label} (${counts[f.value]})`}
                  className={`px-4 py-2 text-xs font-mono tracking-widest uppercase border transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark ${
                    activeFilter === f.value
                      ? 'bg-button-light dark:bg-button-dark text-white border-button-light dark:border-button-dark'
                      : 'bg-transparent border-border-light dark:border-border-dark text-muted-light dark:text-muted-dark hover:border-primary-light dark:hover:border-primary-dark hover:text-primary-light dark:hover:text-primary-dark'
                  }`}
                >
                  {f.label}
                  <span className="ml-2 opacity-60">{counts[f.value]}</span>
                </button>
              </li>
            ))}
          </ul>
        </motion.nav>

        {/* ── Grid ── */}
        <AnimatePresence mode="wait">
          {filtered.length > 0 ? (
            <motion.div
              key={activeFilter}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-px bg-border-light dark:bg-border-dark border border-border-light dark:border-border-dark"
              role="list"
              aria-label="Welcome Wiener dogs"
            >
              {filtered.map((dog, i) => (
                <div key={dog.id} role="listitem" className="bg-bg-light dark:bg-bg-dark">
                  <DogCard dog={dog} index={i} onOpen={() => setOpenDog(dog)} />
                </div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-24 text-center"
              role="status"
              aria-live="polite"
            >
              <p className="text-sm font-mono text-muted-light dark:text-muted-dark">No dogs found.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Dog modal ── */}
      <AnimatePresence>{openDog && <DogModal key={openDog.id} dog={openDog} onClose={() => setOpenDog(null)} />}</AnimatePresence>
    </main>
  )
}
