'use client'

import { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import { ChevronLeft, ChevronRight, Plus, Check, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { IWelcomeWiener, WelcomeWienerProduct } from 'types/entities/welcome-wiener'
import { store } from 'app/lib/store/store'
import { addToCart } from 'app/lib/store/slices/cartSlice'
import Picture from '../common/Picture'
import { setOpenCartToast } from 'app/lib/store/slices/uiSlice'

const getTotalPages = (length: number) => Math.ceil(length / 3)

// ─────────────────────────────────────────────
// Block
// ─────────────────────────────────────────────

export const WelcomeWienersBlock = ({ data }: { data: IWelcomeWiener[] }) => {
  const [page, setPage] = useState(0)
  const scrollRef = useRef<HTMLUListElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [leftOffset, setLeftOffset] = useState(0)
  const dachshunds = data ?? []

  const SLIDES_PER_VIEW = { mobile: 1, sm: 2, lg: 3 }
  const totalPages = useMemo(() => getTotalPages(dachshunds.length), [dachshunds.length])

  useEffect(() => {
    const measure = () => {
      if (containerRef.current) {
        setLeftOffset(containerRef.current.getBoundingClientRect().left)
      }
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    const onScroll = () => {
      const cardWidth = el.scrollWidth / (dachshunds.length ?? 1)
      const newPage = Math.round(el.scrollLeft / (cardWidth * SLIDES_PER_VIEW.lg))
      setPage(Math.min(newPage, totalPages - 1))
    }
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => el.removeEventListener('scroll', onScroll)
  }, [SLIDES_PER_VIEW.lg, dachshunds.length, totalPages])

  const scrollToPage = useCallback(
    (p: number) => {
      const el = scrollRef.current
      if (!el) return
      const cardWidth = el.scrollWidth / (dachshunds.length ?? 1)
      el.scrollTo({ left: p * cardWidth * SLIDES_PER_VIEW.lg, behavior: 'smooth' })
      setPage(p)
    },
    [SLIDES_PER_VIEW.lg, dachshunds.length]
  )

  const [added, setAdded] = useState<Record<string, string[]>>({})

  const handleAdd = (e: React.MouseEvent, dog: IWelcomeWiener, product: WelcomeWienerProduct) => {
    e.preventDefault()
    e.stopPropagation()
    if (added[dog.id]?.includes(product.id)) return

    const cartItem = {
      id: product.id,
      name: `${product.name} for ${dog.name}`,
      image: dog.images[0] ?? null,
      price: product.price,
      quantity: 1,
      isPhysicalProduct: false,
      type: 'WELCOME_WIENER'
    }

    store.dispatch(addToCart(cartItem))
    store.dispatch(setOpenCartToast(cartItem))

    setAdded((prev) => ({ ...prev, [dog.id]: [...(prev[dog.id] ?? []), product.id] }))
    setTimeout(() => setAdded((prev) => ({ ...prev, [dog.id]: prev[dog.id].filter((id) => id !== product.id) })), 2000)
  }

  const preview = (dog: IWelcomeWiener) => (dog.associatedProducts ?? []).slice(0, 3) as WelcomeWienerProduct[]

  const prev = useCallback(() => scrollToPage(Math.max(0, page - 1)), [page, scrollToPage])
  const next = useCallback(() => scrollToPage(Math.min(totalPages - 1, page + 1)), [page, totalPages, scrollToPage])

  return (
    <section aria-labelledby="welcome-wieners-heading" className="relative w-full overflow-hidden bg-bg-light dark:bg-bg-dark pb-35">
      <div className="px-4 sm:px-6 lg:px-8">
        <div ref={containerRef} className="relative max-w-300 mx-auto">
          {/* Header */}
          <div className="flex items-end justify-between mb-10 sm:mb-14 gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-3" aria-hidden="true">
                <div className="w-8 h-px bg-primary-light dark:bg-primary-dark" />
                <p className="text-xs font-mono tracking-[0.2em] uppercase text-muted-light dark:text-muted-dark">Welcome Wieners</p>
              </div>
              <h2
                id="welcome-wieners-heading"
                className="font-quicksand leading-tight text-text-light dark:text-text-dark"
                style={{ fontSize: 'clamp(1.75rem, 4vw, 3rem)' }}
              >
                <span className="font-black block">DOGS IN OUR</span>
                <span className="font-light">CARE RIGHT NOW</span>
              </h2>
              <p className="text-sm font-mono text-muted-light dark:text-muted-dark pt-1 max-w-sm leading-relaxed">
                Pick an item to donate directly to a specific dog.
              </p>
            </div>

            {/* Dots + arrows */}
            <div className="flex flex-col items-end gap-3 shrink-0">
              <div className="flex items-center gap-2" role="tablist" aria-label="Dog gallery pages">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    role="tab"
                    aria-selected={i === page}
                    aria-label={`Go to page ${i + 1}`}
                    onClick={() => scrollToPage(i)}
                    className="relative flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark"
                  >
                    {i === page ? (
                      <span className="relative flex items-center justify-center w-5 h-5" aria-hidden="true">
                        <span className="absolute inset-0 border-2 border-primary-light dark:border-primary-dark" />
                        <span className="w-2 h-2 bg-primary-light dark:bg-primary-dark" />
                      </span>
                    ) : (
                      <span
                        className="w-2.5 h-2.5 bg-border-light dark:bg-border-dark hover:bg-primary-light/40 dark:hover:bg-primary-dark/40 transition-colors"
                        aria-hidden="true"
                      />
                    )}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={prev}
                  disabled={page === 0}
                  aria-label="Previous dogs"
                  className="w-9 h-9 flex items-center justify-center border border-border-light dark:border-border-dark text-muted-light dark:text-muted-dark hover:border-primary-light dark:hover:border-primary-dark hover:text-primary-light dark:hover:text-primary-dark disabled:opacity-30 disabled:cursor-not-allowed transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark"
                >
                  <ChevronLeft className="w-4 h-4" aria-hidden="true" />
                </button>
                <button
                  onClick={next}
                  disabled={page === totalPages - 1}
                  aria-label="Next dogs"
                  className="w-9 h-9 flex items-center justify-center border border-border-light dark:border-border-dark text-muted-light dark:text-muted-dark hover:border-primary-light dark:hover:border-primary-dark hover:text-primary-light dark:hover:text-primary-dark disabled:opacity-30 disabled:cursor-not-allowed transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark"
                >
                  <ChevronRight className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cards — full bleed, scrollable */}
      <section style={{ marginLeft: leftOffset }} className="overflow-x-hidden w-full">
        <ul
          ref={scrollRef}
          role="list"
          aria-label="Dogs available for donation"
          className="flex overflow-x-auto snap-x snap-mandatory gap-x-3 scroll-smooth mb-12.5"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {dachshunds.map((dog, i) => (
            <li key={dog.id} className="shrink-0 w-full sm:w-145" role="listitem">
              <div className="group relative block overflow-hidden h-[min(640px,80vw)] sm:h-160">
                {/* Photo */}
                {dog.images[0] ? (
                  <Picture
                    src={dog.images[0]}
                    alt=""
                    aria-hidden="true"
                    className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                    priority={false}
                  />
                ) : (
                  <div className="absolute inset-0 bg-surface-light dark:bg-surface-dark" />
                )}

                {/* Gradient */}
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" aria-hidden="true" />

                {/* Hover wash */}
                <div
                  className="absolute inset-0 bg-primary-light/0 group-hover:bg-primary-light/10 dark:group-hover:bg-primary-dark/10 transition-colors duration-300"
                  aria-hidden="true"
                />

                {/* Index */}
                <p className="absolute top-4 left-4 text-white/40 text-sm font-mono" aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </p>

                {/* Bottom content */}
                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
                  <p className="text-white font-quicksand font-black text-xl sm:text-2xl leading-tight mb-0.5">{dog.name ?? 'Unknown'}</p>
                  {dog.age && <p className="text-white/50 text-[10px] font-mono mb-3">{dog.age}</p>}

                  {/* Products */}
                  {preview(dog).length > 0 && (
                    <div className="space-y-1.5 mb-3" role="group" aria-label={`Donation items for ${dog.name}`}>
                      {preview(dog).map((product) => {
                        const isAdded = added[dog.id]?.includes(product.id)
                        return (
                          <button
                            key={product.id}
                            type="button"
                            onClick={(e) => handleAdd(e, dog, product)}
                            aria-label={`Add ${product.name} — $${product.price} for ${dog.name}`}
                            aria-pressed={isAdded}
                            className={`w-full flex items-center justify-between px-3 py-2 border transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white text-left
                        ${isAdded ? 'border-white/40 bg-white/20' : 'border-white/20 bg-black/30 hover:border-white/40 hover:bg-black/40'}`}
                          >
                            <span className="text-[10px] font-mono text-white/80 truncate">{product.name}</span>
                            <div className="flex items-center gap-2 shrink-0 ml-2">
                              <span className="text-[10px] font-mono text-white/60 tabular-nums">${product.price}</span>
                              <div
                                className={`w-4 h-4 flex items-center justify-center border transition-colors duration-150 ${isAdded ? 'border-white bg-white' : 'border-white/40'}`}
                              >
                                {isAdded ? (
                                  <Check className="w-2.5 h-2.5 text-black" aria-hidden="true" />
                                ) : (
                                  <Plus className="w-2.5 h-2.5 text-white/60" aria-hidden="true" />
                                )}
                              </div>
                            </div>
                          </button>
                        )
                      })}
                      {(dog.associatedProducts?.length ?? 0) > 3 && (
                        <p className="text-[10px] font-mono text-white/40 pl-1">+{(dog.associatedProducts?.length ?? 0) - 3} more on full profile</p>
                      )}
                    </div>
                  )}

                  {/* Profile link */}
                  <Link
                    href={`/donate/welcome-wieners/${dog.id}`}
                    aria-label={`View full profile for ${dog.name}`}
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center justify-between w-full px-3 py-2 border border-white/30 bg-black/20 hover:border-white/60 hover:bg-black/40 text-white transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white group/link"
                  >
                    <span className="text-[10px] font-mono tracking-[0.2em] uppercase">View Profile</span>
                    <ArrowRight className="w-3 h-3 transition-transform duration-200 group-hover/link:translate-x-0.5" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </li>
          ))}
          <li className="shrink-0" style={{ width: leftOffset - 12 }} aria-hidden="true" />
        </ul>

        {/* View all */}
        <Link
          href="/donate/welcome-wieners"
          className="inline-flex items-center gap-2 px-8 py-3 border-2 border-primary-light dark:border-primary-dark text-text-light dark:text-text-dark text-sm font-mono tracking-[0.2em] uppercase hover:bg-primary-light dark:hover:bg-primary-dark hover:text-white transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark"
        >
          View all welcome wieners
          <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
        </Link>
      </section>
    </section>
  )
}
