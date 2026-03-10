'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Minus, Plus, X, ShoppingBag } from 'lucide-react'
import { fadeUp } from 'app/lib/constants/motion'
import Picture from 'app/components/common/Picture'
import { formatMoney } from 'app/utils/currency.utils'

// ─── Types ────────────────────────────────────────────────────────────────────
interface CartItem {
  id: string
  name: string
  image: string | null
  price: number
  quantity: number
  isPhysicalProduct: boolean
}

const mockCartItems: CartItem[] = [
  {
    id: 'p1',
    name: 'Little Paws Dachshund Rescue Tote Bag',
    image: null,
    price: 18.99,
    quantity: 1,
    isPhysicalProduct: true
  },
  {
    id: 'p2',
    name: 'Doxie Dad Enamel Pin',
    image: null,
    price: 8.5,
    quantity: 2,
    isPhysicalProduct: true
  },
  {
    id: 'p3',
    name: 'Happy Tails E-Card Bundle',
    image: null,
    price: 5.0,
    quantity: 1,
    isPhysicalProduct: false
  },
  {
    id: 'p4',
    name: 'Little Paws Crew Neck Sweatshirt',
    image: null,
    price: 42.0,
    quantity: 1,
    isPhysicalProduct: true
  }
]

// ─── Cart Item Row ────────────────────────────────────────────────────────────
function CartItemRow({
  item,
  index,
  onIncrement,
  onDecrement,
  onRemove
}: {
  item: CartItem
  index: number
  onIncrement: (id: string) => void
  onDecrement: (id: string) => void
  onRemove: (id: string) => void
}) {
  return (
    <motion.li
      layout
      variants={fadeUp}
      initial="hidden"
      animate="show"
      exit={{ opacity: 0, x: -20, transition: { duration: 0.25 } }}
      custom={index}
      className="grid grid-cols-[auto_1fr_auto] gap-4 sm:gap-5 p-4 sm:p-5 bg-bg-light dark:bg-bg-dark"
    >
      {/* Image */}
      <div className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 overflow-hidden border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark">
        {item.image ? (
          <Picture priority={true} src={item.image} alt={item.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ShoppingBag size={18} className="text-muted-light dark:text-muted-dark" aria-hidden="true" />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="min-w-0 flex flex-col justify-between gap-2">
        <div>
          <p className="font-quicksand font-black text-sm sm:text-base text-text-light dark:text-text-dark leading-snug truncate">{item.name}</p>
          <p className="text-[10px] font-mono text-muted-light dark:text-muted-dark mt-0.5">
            {item.isPhysicalProduct ? 'Physical item' : 'Digital item'}
          </p>
        </div>

        {/* Quantity controls */}
        <div
          className="flex items-center gap-0 border border-border-light dark:border-border-dark w-fit"
          role="group"
          aria-label={`Quantity for ${item.name}`}
        >
          <button
            onClick={() => onDecrement(item.id)}
            aria-label={`Decrease quantity of ${item.name}`}
            disabled={item.quantity <= 1}
            className="w-8 h-8 flex items-center justify-center text-muted-light dark:text-muted-dark hover:text-primary-light dark:hover:text-primary-dark hover:bg-surface-light dark:hover:bg-surface-dark transition-colors duration-150 disabled:opacity-30 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark border-r border-border-light dark:border-border-dark"
          >
            <Minus size={11} aria-hidden="true" />
          </button>
          <span
            className="w-8 h-8 flex items-center justify-center text-xs font-mono text-text-light dark:text-text-dark"
            aria-live="polite"
            aria-atomic="true"
          >
            {item.quantity}
          </span>
          <button
            onClick={() => onIncrement(item.id)}
            aria-label={`Increase quantity of ${item.name}`}
            className="w-8 h-8 flex items-center justify-center text-muted-light dark:text-muted-dark hover:text-primary-light dark:hover:text-primary-dark hover:bg-surface-light dark:hover:bg-surface-dark transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark border-l border-border-light dark:border-border-dark"
          >
            <Plus size={11} aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Price + remove */}
      <div className="flex flex-col items-end justify-between">
        <button
          onClick={() => onRemove(item.id)}
          aria-label={`Remove ${item.name} from cart`}
          className="p-1 text-muted-light dark:text-muted-dark hover:text-red-500 dark:hover:text-red-400 transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
        >
          <X size={14} aria-hidden="true" />
        </button>
        <p className="font-quicksand font-black text-sm sm:text-base text-text-light dark:text-text-dark">
          {formatMoney(item.price * item.quantity)}
        </p>
      </div>
    </motion.li>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>(mockCartItems)

  function increment(id: string) {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, quantity: i.quantity + 1 } : i)))
  }

  function decrement(id: string) {
    setItems((prev) => prev.map((i) => (i.id === id && i.quantity > 1 ? { ...i, quantity: i.quantity - 1 } : i)))
  }

  function remove(id: string) {
    setItems((prev) => prev.filter((i) => i.id !== id))
  }

  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0)
  const shipping = items.some((i) => i.isPhysicalProduct) ? 5.99 : 0
  const total = subtotal + shipping
  const itemCount = items.reduce((s, i) => s + i.quantity, 0)
  const isEmpty = items.length === 0

  return (
    <main id="main-content" className="min-h-screen bg-bg-light dark:bg-bg-dark text-text-light dark:text-text-dark">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-12 sm:pt-16 pb-24 sm:pb-32">
        {/* ── Header ── */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={0} className="mb-10 sm:mb-12">
          <Link
            href="/store"
            className="inline-flex items-center gap-2 text-[10px] font-mono tracking-[0.2em] uppercase text-muted-light dark:text-muted-dark hover:text-primary-light dark:hover:text-primary-dark transition-colors duration-200 mb-6 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark"
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
            Continue Shopping
          </Link>

          <div className="flex items-center gap-3 mb-2">
            <span className="block w-6 h-px bg-primary-light dark:bg-primary-dark" aria-hidden="true" />
            <p className="text-xs font-mono tracking-[0.2em] uppercase text-primary-light dark:text-primary-dark">Your Cart</p>
          </div>
          <h1 className="font-quicksand font-black text-3xl sm:text-4xl text-text-light dark:text-text-dark leading-tight">
            {isEmpty ? (
              'Your cart is empty'
            ) : (
              <>
                {itemCount} {itemCount === 1 ? 'item' : 'items'}
              </>
            )}
          </h1>
        </motion.div>

        <AnimatePresence mode="wait">
          {isEmpty ? (
            /* ── Empty state ── */
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center justify-center py-24 border border-dashed border-border-light dark:border-border-dark text-center gap-5"
              role="status"
              aria-live="polite"
            >
              <div className="w-14 h-14 border border-border-light dark:border-border-dark flex items-center justify-center">
                <ShoppingBag size={22} className="text-muted-light dark:text-muted-dark" aria-hidden="true" />
              </div>
              <div>
                <p className="font-quicksand font-black text-lg text-text-light dark:text-text-dark mb-1">Nothing here yet</p>
                <p className="text-xs font-mono text-muted-light dark:text-muted-dark">Add some items from the store to get started.</p>
              </div>
              <Link
                href="/store"
                className="px-6 py-3 bg-primary-light dark:bg-primary-dark hover:bg-secondary-light dark:hover:bg-secondary-dark text-white text-[10px] font-mono font-black tracking-[0.25em] uppercase transition-colors duration-200 focus:outline-none focus-visible:ring-4 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark"
              >
                Browse Store
              </Link>
            </motion.div>
          ) : (
            /* ── Cart content ── */
            <motion.div
              key="cart"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 1000:grid-cols-[1fr_320px] gap-6 sm:gap-8 items-start"
            >
              {/* Items list */}
              <div>
                <ul
                  className="flex flex-col gap-px bg-border-light dark:bg-border-dark border border-border-light dark:border-border-dark"
                  aria-label="Cart items"
                  role="list"
                >
                  <AnimatePresence>
                    {items.map((item, i) => (
                      <CartItemRow key={item.id} item={item} index={i} onIncrement={increment} onDecrement={decrement} onRemove={remove} />
                    ))}
                  </AnimatePresence>
                </ul>

                {/* Clear cart */}
                <div className="mt-3 flex justify-end">
                  <button
                    onClick={() => setItems([])}
                    className="text-[10px] font-mono tracking-widest uppercase text-muted-light dark:text-muted-dark hover:text-red-500 dark:hover:text-red-400 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                  >
                    Clear Cart
                  </button>
                </div>
              </div>

              {/* Order summary */}
              <motion.aside
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.4 }}
                aria-label="Order summary"
                className="border border-border-light dark:border-border-dark sticky top-6"
              >
                {/* Summary header */}
                <div className="px-5 py-4 border-b border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark">
                  <div className="flex items-center gap-3">
                    <span className="block w-4 h-px bg-primary-light dark:bg-primary-dark" aria-hidden="true" />
                    <p className="text-[10px] font-mono tracking-[0.2em] uppercase text-primary-light dark:text-primary-dark">Order Summary</p>
                  </div>
                </div>

                {/* Line items */}
                <div className="px-5 py-4 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-mono text-muted-light dark:text-muted-dark">
                      Subtotal ({itemCount} {itemCount === 1 ? 'item' : 'items'})
                    </p>
                    <p className="text-xs font-mono text-text-light dark:text-text-dark">{formatMoney(subtotal)}</p>
                  </div>

                  {shipping > 0 && (
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-mono text-muted-light dark:text-muted-dark">Shipping</p>
                      <p className="text-xs font-mono text-text-light dark:text-text-dark">{formatMoney(shipping)}</p>
                    </div>
                  )}

                  {shipping === 0 && (
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-mono text-muted-light dark:text-muted-dark">Shipping</p>
                      <p className="text-[10px] font-mono text-green-600 dark:text-green-400">Free</p>
                    </div>
                  )}

                  {/* Divider */}
                  <div className="h-px bg-border-light dark:bg-border-dark" aria-hidden="true" />

                  {/* Total */}
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-mono font-black text-text-light dark:text-text-dark">Total</p>
                    <p className="font-quicksand font-black text-xl text-primary-light dark:text-primary-dark">{formatMoney(total)}</p>
                  </div>
                </div>

                {/* CTA */}
                <div className="px-5 pb-5 flex flex-col gap-2">
                  <motion.button
                    whileHover={{ y: -1 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-3.5 bg-primary-light dark:bg-primary-dark hover:bg-secondary-light dark:hover:bg-secondary-dark text-white text-[10px] font-mono font-black tracking-[0.25em] uppercase transition-colors duration-200 focus:outline-none focus-visible:ring-4 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark"
                    aria-label={`Proceed to checkout — total ${formatMoney(total)}`}
                  >
                    Checkout
                  </motion.button>
                  <p className="text-[9px] font-mono text-center text-muted-light dark:text-muted-dark mt-1">Proceeds support dachshund rescue</p>
                </div>
              </motion.aside>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  )
}
