'use client'

import { useState, useRef, useCallback, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Picture from '../common/Picture'

const getTotalPages = (length: number) => Math.ceil(length / 4)

export const AvailableDogsBlock = ({ data }) => {
  const [page, setPage] = useState(0)
  const scrollRef = useRef<HTMLUListElement>(null)
  const dachshunds = data ?? []

  const containerRef = useRef<HTMLDivElement>(null)
  const [leftOffset, setLeftOffset] = useState(0)
  const SLIDES_PER_VIEW = { mobile: 1, sm: 2, lg: 4 }
  const totalPages = useMemo(() => getTotalPages(dachshunds?.length ?? 0), [dachshunds?.length])

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
      const cardWidth = el.scrollWidth / (dachshunds?.length ?? 1)
      const newPage = Math.round(el.scrollLeft / (cardWidth * SLIDES_PER_VIEW.lg))
      setPage(Math.min(newPage, totalPages - 1))
    }

    el.addEventListener('scroll', onScroll, { passive: true })
    return () => el.removeEventListener('scroll', onScroll)
  }, [SLIDES_PER_VIEW.lg, dachshunds?.length, totalPages])

  const scrollToPage = useCallback(
    (p: number) => {
      const el = scrollRef.current
      if (!el) return
      const cardWidth = el.scrollWidth / (dachshunds?.length ?? 1)
      el.scrollTo({ left: p * cardWidth * SLIDES_PER_VIEW.lg, behavior: 'smooth' })
      setPage(p)
    },
    [SLIDES_PER_VIEW.lg, dachshunds?.length]
  )

  const prev = useCallback(() => scrollToPage(Math.max(0, page - 1)), [page, scrollToPage])
  const next = useCallback(() => scrollToPage(Math.min(totalPages - 1, page + 1)), [page, totalPages, scrollToPage])
  return (
    <section aria-labelledby="available-heading" className="relative w-full overflow-hidden -mt-60 bg-bg-light dark:bg-bg-dark">
      <div className="px-4 sm:px-6 lg:px-8">
        <div ref={containerRef} className="relative max-w-300 mx-auto">
          {/* Header row */}
          <div className="flex items-end justify-between mb-10 sm:mb-14 gap-4">
            <div className="space-y-1">
              {/* Eyebrow */}
              <div className="flex items-center gap-3" aria-hidden="true">
                <div className="w-8 h-px bg-primary-light dark:bg-primary-dark" />
                <p className="text-xs font-bold uppercase tracking-widest text-muted-light dark:text-muted-dark font-nunito">
                  Available for Adoption
                </p>
              </div>
              <h2
                id="available-heading"
                className="font-quicksand leading-tight text-text-light dark:text-text-dark"
                style={{ fontSize: 'clamp(1.75rem, 4vw, 3rem)' }}
              >
                <span className="font-black block">DACHSHUNDS</span>
                <span className="font-light">LOOKING FOR HOMES</span>
              </h2>
            </div>

            {/* Dots + arrows */}
            <div className="flex flex-col items-end gap-3 shrink-0">
              {/* Dot indicators */}
              <div className="flex items-center gap-2" role="tablist" aria-label="Dog gallery pages">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    role="tab"
                    aria-selected={i === page}
                    aria-label={`Go to page ${i + 1}`}
                    onClick={() => setPage(i)}
                    className="relative flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark rounded-full"
                  >
                    {i === page ? (
                      <span className="relative flex items-center justify-center w-5 h-5" aria-hidden="true">
                        <span className="absolute inset-0 rounded-full border-2 border-primary-light dark:border-primary-dark" />
                        <span className="w-2 h-2 rounded-full bg-primary-light dark:bg-primary-dark" />
                      </span>
                    ) : (
                      <span
                        className="w-2.5 h-2.5 rounded-full bg-border-light dark:bg-border-dark hover:bg-primary-light/40 dark:hover:bg-primary-dark/40 transition-colors"
                        aria-hidden="true"
                      />
                    )}
                  </button>
                ))}
              </div>

              {/* Prev / next arrows */}
              <div className="flex items-center gap-2">
                <button
                  onClick={prev}
                  disabled={page === 0}
                  aria-label="Previous dogs"
                  className="w-9 h-9 flex items-center justify-center rounded-full border border-border-light dark:border-border-dark text-muted-light dark:text-muted-dark hover:border-primary-light dark:hover:border-primary-dark hover:text-primary-light dark:hover:text-primary-dark disabled:opacity-30 disabled:cursor-not-allowed transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark"
                >
                  <ChevronLeft className="w-4 h-4" aria-hidden="true" />
                </button>
                <button
                  onClick={next}
                  disabled={page === totalPages - 1}
                  aria-label="Next dogs"
                  className="w-9 h-9 flex items-center justify-center rounded-full border border-border-light dark:border-border-dark text-muted-light dark:text-muted-dark hover:border-primary-light dark:hover:border-primary-dark hover:text-primary-light dark:hover:text-primary-dark disabled:opacity-30 disabled:cursor-not-allowed transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark"
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
          aria-label="Dogs available for adoption"
          className="flex overflow-x-auto snap-x snap-mandatory gap-x-3 scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {dachshunds?.map((dog, i) => (
            <li key={dog.id} className="shrink-0 w-[80vw] sm:w-[45vw] lg:w-[25vw] min-w-65 max-w-[288px]">
              <Link
                href={`/dachshunds/${dog.id}`}
                aria-label={`Meet ${dog?.attributes?.name}, ${dog?.attributes?.ageString}${dog?.attributes?.colorDetails ? `, ${dog?.attributes?.colorDetails}` : ''} — available for adoption`}
                className="group relative block overflow-hidden focus:outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark aspect-4/6"
              >
                <Picture
                  priority={false}
                  src={dog.attributes?.photos[0]}
                  alt=""
                  aria-hidden="true"
                  className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                />

                {/* Gradient */}
                <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/10 to-transparent" aria-hidden="true" />

                {/* Hover teal/purple wash */}
                <div
                  className="absolute inset-0 bg-primary-light/0 group-hover:bg-primary-light/20 dark:group-hover:bg-primary-dark/20 transition-colors duration-300"
                  aria-hidden="true"
                />

                {/* Label */}
                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
                  <p className="text-white/50 text-sm font-mono mb-0.5" aria-hidden="true">
                    {String(i + 1).padStart(2, '0')}
                  </p>
                  <p className="text-white font-quicksand font-bold text-xl sm:text-2xl group-hover:text-primary-light dark:group-hover:text-primary-dark transition-colors">
                    {dog?.attributes?.name}
                  </p>
                  <p className="text-white/60 text-xs font-nunito mt-0.5 opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-300">
                    {dog?.attributes?.ageString}
                    {dog?.attributes?.colorDetails && ` · ${dog?.attributes?.colorDetails}`}
                  </p>
                </div>
              </Link>
            </li>
          ))}
          <li className="shrink-0" style={{ width: leftOffset - 12 }} aria-hidden="true" />
        </ul>
      </section>

      {/* Mobile: view all CTA */}
      <div className="mt-8 flex justify-center lg:hidden px-4">
        <Link
          href="/dachshunds"
          className="inline-flex items-center px-8 py-3 border-2 border-primary-light dark:border-primary-dark text-text-light dark:text-text-dark text-sm font-semibold font-nunito tracking-wide hover:bg-primary-light dark:hover:bg-primary-dark hover:text-white dark:hover:text-bg-dark transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark"
        >
          View all available dogs
        </Link>
      </div>
    </section>
  )
}
