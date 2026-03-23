'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Check, ChevronDown, ChevronUp, ChevronRight } from 'lucide-react'
import { IWelcomeWiener, WelcomeWienerProduct } from 'types/entities/welcome-wiener'
import Picture from '../common/Picture'
import { fadeUp } from 'app/lib/constants/motion'
import Link from 'next/link'

const filters = [
  { value: 'all', label: 'All Dogs' },
  { value: 'medical', label: 'Medical' },
  { value: 'gear', label: 'Gear' },
  { value: 'food', label: 'Food' },
  { value: 'comfort', label: 'Comfort' },
  { value: 'training', label: 'Training' },
  { value: 'enrichment', label: 'Enrichment' }
] as { value: string; label: string }[]

// ─────────────────────────────────────────────
// Dog Card
// ─────────────────────────────────────────────

function DogCard({
  dog,
  index,
  onAddProduct
}: {
  dog: IWelcomeWiener
  index: number
  onAddProduct: (dog: IWelcomeWiener, product: WelcomeWienerProduct) => void
}) {
  const [expanded, setExpanded] = useState(false)
  const [added, setAdded] = useState<string[]>([])
  const products = (dog.associatedProducts ?? []) as WelcomeWienerProduct[]

  const handleAdd = (product: WelcomeWienerProduct) => {
    if (added.includes(product.id)) return
    setAdded((prev) => [...prev, product.id])
    onAddProduct(dog, product)
    // reset checkmark after 2s
    setTimeout(() => setAdded((prev) => prev.filter((id) => id !== product.id)), 2000)
  }

  return (
    <motion.article
      variants={fadeUp}
      initial="hidden"
      animate="show"
      custom={index}
      className="flex flex-col bg-bg-light dark:bg-bg-dark border border-border-light dark:border-border-dark overflow-hidden"
      aria-label={`${dog.name ?? 'Dog'} — welcome wiener profile`}
    >
      {/* ── Photo ── */}
      <div className="relative aspect-4/3 overflow-hidden bg-surface-light dark:bg-surface-dark">
        {dog.images[0] ? (
          <Picture
            src={dog.images[0]}
            alt={dog.name ?? 'Dog photo'}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            priority={true}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-[10px] font-mono text-muted-light dark:text-muted-dark tracking-widest uppercase">No photo</span>
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex gap-1.5">
          {dog.isLive && (
            <span className="px-2 py-0.5 text-[9px] font-mono tracking-[0.15em] uppercase bg-primary-light dark:bg-primary-dark text-white">
              Live
            </span>
          )}
        </div>
      </div>

      {/* ── Info ── */}
      <div className="px-4 pt-4 pb-3">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h2 className="font-quicksand font-black text-base text-text-light dark:text-text-dark leading-tight">{dog.name ?? 'Unknown'}</h2>
          {dog.age && <span className="text-[10px] font-mono text-muted-light dark:text-muted-dark shrink-0 mt-0.5">{dog.age}</span>}
        </div>

        {dog.bio && <p className="text-[11px] font-mono text-muted-light dark:text-muted-dark leading-relaxed line-clamp-2">{dog.bio}</p>}
      </div>

      {/* ── Divider ── */}
      <div className="h-px bg-border-light dark:bg-border-dark mx-4" aria-hidden="true" />

      {/* ── Products ── */}
      {products.length > 0 ? (
        <div className="px-4 pt-3 pb-4 flex-1 flex flex-col">
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
            aria-controls={`products-${dog.id}`}
            className="flex items-center justify-between w-full mb-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark"
          >
            <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-muted-light dark:text-muted-dark">
              {products.length} item{products.length !== 1 ? 's' : ''} needed
            </span>
            <span className="text-muted-light dark:text-muted-dark">
              {expanded ? <ChevronUp className="w-3 h-3" aria-hidden="true" /> : <ChevronDown className="w-3 h-3" aria-hidden="true" />}
            </span>
          </button>

          {/* Collapsed — show first 2 as pills */}
          {!expanded && (
            <div className="flex flex-wrap gap-1.5" id={`products-${dog.id}`}>
              {products.slice(0, 2).map((product) => (
                <button
                  key={product.id}
                  type="button"
                  onClick={() => handleAdd(product)}
                  aria-label={`Add ${product.name} — $${product.price} for ${dog.name}`}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 border text-[10px] font-mono transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark
                    ${
                      added.includes(product.id)
                        ? 'border-primary-light dark:border-primary-dark bg-primary-light/10 dark:bg-primary-dark/10 text-primary-light dark:text-primary-dark'
                        : 'border-border-light dark:border-border-dark text-muted-light dark:text-muted-dark hover:border-primary-light dark:hover:border-primary-dark hover:text-text-light dark:hover:text-text-dark'
                    }`}
                >
                  {added.includes(product.id) ? (
                    <Check className="w-2.5 h-2.5" aria-hidden="true" />
                  ) : (
                    <Plus className="w-2.5 h-2.5" aria-hidden="true" />
                  )}
                  <span>{product.name}</span>
                  <span className="text-primary-light dark:text-primary-dark font-bold">${product.price}</span>
                </button>
              ))}
              {products.length > 2 && (
                <button
                  type="button"
                  onClick={() => setExpanded(true)}
                  className="inline-flex items-center px-2.5 py-1.5 border border-dashed border-border-light dark:border-border-dark text-[10px] font-mono text-muted-light dark:text-muted-dark hover:border-primary-light dark:hover:border-primary-dark hover:text-primary-light dark:hover:text-primary-dark transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark"
                  aria-label={`Show ${products.length - 2} more items`}
                >
                  +{products.length - 2} more
                </button>
              )}
            </div>
          )}

          {/* Expanded — full list */}
          <AnimatePresence>
            {expanded && (
              <motion.ul
                id={`products-${dog.id}`}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25 }}
                className="space-y-1.5 overflow-hidden"
                role="list"
                aria-label={`Products for ${dog.name}`}
              >
                {products.map((product) => (
                  <li key={product.id} role="listitem">
                    <button
                      type="button"
                      onClick={() => handleAdd(product)}
                      aria-label={`Add ${product.name} — $${product.price} for ${dog.name}`}
                      className={`w-full flex items-center justify-between px-3 py-2.5 border transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark text-left
                        ${
                          added.includes(product.id)
                            ? 'border-primary-light dark:border-primary-dark bg-primary-light/5 dark:bg-primary-dark/5'
                            : 'border-border-light dark:border-border-dark hover:border-primary-light/50 dark:hover:border-primary-dark/50'
                        }`}
                    >
                      <div className="min-w-0">
                        <p
                          className={`text-[11px] font-mono truncate ${added.includes(product.id) ? 'text-primary-light dark:text-primary-dark' : 'text-text-light dark:text-text-dark'}`}
                        >
                          {product.name}
                        </p>
                        {product.description && (
                          <p className="text-[10px] font-mono text-muted-light dark:text-muted-dark truncate mt-0.5">{product.description}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-2.5 ml-3 shrink-0">
                        <span
                          className={`text-xs font-mono font-bold tabular-nums ${added.includes(product.id) ? 'text-primary-light dark:text-primary-dark' : 'text-muted-light dark:text-muted-dark'}`}
                        >
                          ${product.price}
                        </span>
                        <div
                          className={`w-5 h-5 flex items-center justify-center border transition-colors duration-150
                          ${
                            added.includes(product.id)
                              ? 'border-primary-light dark:border-primary-dark bg-primary-light dark:bg-primary-dark'
                              : 'border-border-light dark:border-border-dark'
                          }`}
                        >
                          {added.includes(product.id) ? (
                            <Check className="w-3 h-3 text-white" aria-hidden="true" />
                          ) : (
                            <Plus className="w-3 h-3 text-muted-light dark:text-muted-dark" aria-hidden="true" />
                          )}
                        </div>
                      </div>
                    </button>
                  </li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </div>
      ) : (
        <div className="px-4 pt-3 pb-4">
          <p className="text-[10px] font-mono text-muted-light/60 dark:text-muted-dark/60">No items listed yet.</p>
        </div>
      )}

      {/* ── View full profile ── */}
      <div className="px-4 pb-4">
        <Link
          href={`/donate/welcome-wieners/${dog.id}`}
          className="flex items-center justify-between w-full px-3.5 py-2.5 border border-border-light dark:border-border-dark text-muted-light dark:text-muted-dark hover:border-primary-light dark:hover:border-primary-dark hover:text-primary-light dark:hover:text-primary-dark transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark group"
          aria-label={`View full profile for ${dog.name ?? 'this dog'}`}
        >
          <span className="text-[10px] font-mono tracking-[0.2em] uppercase">View Profile</span>
          <ChevronRight className="w-3 h-3 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden="true" />
        </Link>
      </div>
    </motion.article>
  )
}

// ─────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────

export function PublicWelcomeWienersClient({
  welcomeWieners,
  onAddProduct
}: {
  welcomeWieners: IWelcomeWiener[]
  onAddProduct?: (dog: IWelcomeWiener, product: WelcomeWienerProduct) => void
}) {
  const [activeFilter, setActiveFilter] = useState('all')

  const filtered = welcomeWieners.filter((d) => {
    if (activeFilter === 'all') return true
    return (d.associatedProducts as WelcomeWienerProduct[]).some((p) => p.category === activeFilter)
  })

  const counts = {
    all: welcomeWieners?.length ?? 0,
    boost: welcomeWieners?.filter((d) => d.isDogBoost).length ?? 0
  }

  const handleAddProduct = (dog: IWelcomeWiener, product: WelcomeWienerProduct) => {
    onAddProduct?.(dog, product)
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
          <p className="text-sm text-muted-light dark:text-muted-dark max-w-md leading-relaxed">
            These dogs are in our care and need your support. Pick an item from any dog&apos;s list to donate it directly.
          </p>
        </motion.div>

        {/* ── Filters ── */}
        <motion.nav variants={fadeUp} initial="hidden" animate="show" custom={1} aria-label="Filter dogs" className="mb-8">
          <ul className="flex items-center gap-2" role="list">
            {filters.map((f) => (
              <li key={f.value}>
                <button
                  onClick={() => setActiveFilter(f.value)}
                  aria-pressed={activeFilter === f.value}
                  aria-label={`${f.label} (${counts[f.value]})`}
                  className={`px-4 py-2 text-[10px] font-mono tracking-[0.2em] uppercase border transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark
                    ${
                      activeFilter === f.value
                        ? 'bg-primary-light dark:bg-primary-dark text-white border-primary-light dark:border-primary-dark'
                        : 'bg-transparent border-border-light dark:border-border-dark text-muted-light dark:text-muted-dark hover:border-primary-light dark:hover:border-primary-dark hover:text-primary-light dark:hover:text-primary-dark'
                    }`}
                >
                  {f.label}
                  <span className="ml-2 opacity-60 tabular-nums">{counts[f.value]}</span>
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
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
              role="list"
              aria-label="Welcome Wiener dogs"
            >
              {filtered.map((dog, i) => (
                <div key={dog.id} role="listitem">
                  <DogCard dog={dog} index={i} onAddProduct={handleAddProduct} />
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
    </main>
  )
}
