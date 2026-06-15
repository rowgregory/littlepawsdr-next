'use client'

import { motion } from 'framer-motion'
import { ArrowLeft, Package, Plus } from 'lucide-react'
import Picture from '../../../components/common/Picture'
import Link from 'next/link'

export function AdminProductsClient({ products }) {
  return (
    <div className="min-h-screen bg-bg-light dark:bg-bg-dark text-text-light dark:text-text-dark">
      {/* ── Top bar ── */}
      <div className="h-16.25 px-5 border-b border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark flex items-center justify-between gap-3 sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/dashboard"
            aria-label="Back to dashboard"
            className="inline-flex items-center text-muted-light dark:text-muted-dark hover:text-primary-light dark:hover:text-primary-dark transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark"
          >
            <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
          </Link>
          <div className="w-px h-4 bg-border-light dark:bg-border-dark" aria-hidden="true" />
          <Package className="w-3.5 h-3.5 text-primary-light dark:text-primary-dark" aria-hidden="true" />
          <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-muted-light dark:text-muted-dark">Products</span>
          <span className="text-[10px] font-mono text-primary-light dark:text-primary-dark">{products?.length}</span>
        </div>

        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 px-4 py-2 text-[10px] font-mono tracking-[0.2em] uppercase bg-primary-light dark:bg-primary-dark hover:bg-secondary-light dark:hover:bg-secondary-dark text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark shrink-0"
        >
          <Plus className="w-3.5 h-3.5" aria-hidden="true" />
          Add Product
        </Link>
      </div>

      {/* ── Table ── */}
      <div className="overflow-x-auto">
        <table className="w-full" role="table" aria-label="Product list">
          <thead>
            <tr className="border-b border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark">
              {['Name', 'Price', 'Shipping', 'Quantity', 'Sold', 'Status', ''].map((h) => (
                <th
                  key={h}
                  className="px-5 py-3 text-left text-[10px] font-mono tracking-[0.2em] uppercase text-muted-light dark:text-muted-dark whitespace-nowrap"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {products?.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-12 text-center">
                  <p className="text-[10px] font-mono tracking-[0.2em] uppercase text-muted-light dark:text-muted-dark">No products yet</p>
                  <Link
                    href="/admin/products/new"
                    className="mt-3 inline-block text-[10px] font-mono tracking-[0.2em] uppercase text-primary-light dark:text-primary-dark hover:text-secondary-light dark:hover:text-secondary-dark transition-colors focus:outline-none focus-visible:underline"
                  >
                    Add the first one →
                  </Link>
                </td>
              </tr>
            ) : (
              products?.map((product, i) => (
                <motion.tr
                  key={product.id}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: i * 0.04 }}
                  className="border-b border-border-light dark:border-border-dark hover:bg-surface-light dark:hover:bg-surface-dark transition-colors duration-150 group"
                >
                  {/* Product */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      {product.images[0] ? (
                        <Picture
                          priority={true}
                          src={product.images[0]}
                          alt={product.name ?? 'Dog photo'}
                          className="w-8 h-8 object-cover shrink-0"
                        />
                      ) : (
                        <div className="w-8 h-8 bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark shrink-0 flex items-center justify-center">
                          <span className="text-[10px] font-mono text-muted-light dark:text-muted-dark">?</span>
                        </div>
                      )}
                      <div>
                        <p className="text-xs font-mono text-text-light dark:text-text-dark">
                          {product.name ?? <span className="text-muted-light dark:text-muted-dark italic">Unnamed</span>}
                        </p>
                        {product.description && (
                          <p className="text-[10px] font-mono text-muted-light dark:text-muted-dark truncate max-w-45">{product.description}</p>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Price */}
                  <td className="px-5 py-4 whitespace-nowrap">
                    <span className="text-xs font-mono text-muted-light dark:text-muted-dark">${Number(product.price).toFixed(2)}</span>
                  </td>

                  {/* Shipping */}
                  <td className="px-5 py-4 whitespace-nowrap">
                    <span className="text-xs font-mono text-muted-light dark:text-muted-dark">${Number(product.shippingPrice ?? 0).toFixed(2)}</span>
                  </td>

                  {/* Quantity */}
                  <td className="px-5 py-4 whitespace-nowrap">
                    <span className="text-xs font-mono text-muted-light dark:text-muted-dark">{product.countInStock}</span>
                  </td>

                  {/* Sold */}
                  <td className="px-5 py-4 whitespace-nowrap">
                    <span className="text-xs font-mono text-muted-light dark:text-muted-dark">{product.sold ?? 0}</span>
                  </td>

                  {/* Status */}
                  <td className="px-5 py-4 whitespace-nowrap">
                    <span
                      className={`inline-block px-2 py-0.5 text-[9px] font-mono tracking-[0.15em] uppercase border
      ${
        product.isLive
          ? 'text-emerald-600 dark:text-emerald-400 border-emerald-600/30 dark:border-emerald-400/30 bg-emerald-500/10'
          : 'text-muted-light dark:text-muted-dark border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark'
      }`}
                    >
                      {product.isLive ? 'Live' : 'Draft'}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-5 py-4 text-right whitespace-nowrap">
                    <Link
                      href={`/admin/products/${product.id}`}
                      className="text-[10px] font-mono tracking-[0.2em] uppercase text-muted-light dark:text-muted-dark hover:text-primary-light dark:hover:text-primary-dark transition-colors duration-150 focus:outline-none focus-visible:underline"
                      aria-label={`Edit ${product.name ?? 'product'}`}
                    >
                      Edit →
                    </Link>
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
