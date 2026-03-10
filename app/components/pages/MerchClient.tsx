'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { fadeUp } from 'app/lib/constants/motion'
import { IProduct } from 'types/entities/product'
import Picture from '../common/Picture'

type SortOption = 'latest' | 'price-asc' | 'price-desc'

export default function MerchClient({ products }: { products: IProduct[] }) {
  const [sort, setSort] = useState<SortOption>('latest')

  const filtered = products.sort((a, b) => {
    if (sort === 'price-asc') return a.price - b.price
    if (sort === 'price-desc') return b.price - a.price
    return 0
  })

  return (
    <main id="main-content" className="min-h-screen bg-bg-light dark:bg-bg-dark text-text-light dark:text-text-dark">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-12 sm:pt-16 pb-24 sm:pb-32">
        {/* ── Header ── */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={0} className="mb-10 sm:mb-12">
          <div className="flex items-center gap-3 mb-4">
            <span className="block w-8 h-px bg-primary-light dark:bg-primary-dark" aria-hidden="true" />
            <p className="text-xs font-mono tracking-[0.2em] uppercase text-primary-light dark:text-primary-dark">Shop</p>
          </div>
          <h1 className="font-quicksand text-4xl sm:text-5xl font-bold text-text-light dark:text-text-dark leading-tight">
            Little Paws <span className="font-light text-muted-light dark:text-muted-dark">Merch</span>
          </h1>
        </motion.div>

        {/* ── Toolbar ── */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={1}
          className="flex flex-col xs:flex-row items-start xs:items-center justify-between gap-4 mb-8"
        >
          {/* Sort */}
          <div className="flex items-center gap-2">
            <label
              htmlFor="sort-select"
              className="text-xs font-mono tracking-widest uppercase text-muted-light dark:text-muted-dark whitespace-nowrap"
            >
              Sort by
            </label>
            <select
              id="sort-select"
              value={sort}
              onChange={(e) => setSort(e.target.value as SortOption)}
              className="text-xs font-mono bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark text-text-light dark:text-text-dark px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark"
            >
              <option value="latest">Latest</option>
              <option value="price-asc">Price: Low → High</option>
              <option value="price-desc">Price: High → Low</option>
            </select>
          </div>
        </motion.div>

        {/* ── Grid ── */}
        <AnimatePresence mode="wait">
          {filtered?.length > 0 ? (
            <motion.ul
              initial="hidden"
              animate="show"
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-px bg-border-light dark:bg-border-dark border border-border-light dark:border-border-dark"
              role="list"
              aria-label="Products"
            >
              {filtered?.map((product, i) => {
                return (
                  <motion.li key={product?.id} variants={fadeUp} custom={i % 8} className="group bg-bg-light dark:bg-bg-dark flex flex-col">
                    <Link
                      href={`/merch/${product?.id}`}
                      aria-label={`${product?.name ?? 'Product'} — $${Number(product?.price).toFixed(2)}`}
                      className="flex flex-col flex-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark"
                    >
                      {/* Image */}
                      <div className="relative aspect-square overflow-hidden bg-surface-light dark:bg-surface-dark">
                        {product?.images?.[0] ? (
                          <Picture
                            priority={false}
                            src={product?.images?.[0] ?? product?.image ?? ''}
                            alt={product?.name ?? 'Product'}
                            className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center text-muted-light dark:text-muted-dark text-xs font-mono">
                            No image
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="p-3 sm:p-4 flex flex-col gap-1 flex-1 justify-between">
                        <p className="text-xs sm:text-sm font-semibold text-text-light dark:text-text-dark leading-snug group-hover:text-primary-light dark:group-hover:text-primary-dark transition-colors line-clamp-2">
                          {product?.name}
                        </p>
                        <p className="text-xs font-mono text-muted-light dark:text-muted-dark mt-1">${product?.price.toFixed(2)} USD</p>
                      </div>
                    </Link>
                  </motion.li>
                )
              })}
            </motion.ul>
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
              <p className="text-muted-light dark:text-muted-dark font-mono text-sm">No products found.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  )
}
