'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Gavel, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { store, useUiSelector } from 'app/lib/store/store'
import { setCloseAuctionDrawer } from 'app/lib/store/slices/uiSlice'
import { createAuction } from 'app/lib/actions/createAuction'

// ─── Input ────────────────────────────────────────────────────────────────────
function Field({ id, label, error, children }: { id: string; label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-[10px] font-mono tracking-[0.2em] uppercase text-muted-light dark:text-muted-dark">
        {label}
      </label>
      {children}
      {error && (
        <p role="alert" className="text-[10px] font-mono text-red-500 mt-0.5">
          {error}
        </p>
      )}
    </div>
  )
}

const inputClass =
  'w-full px-3.5 py-3 text-xs font-mono border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark text-text-light dark:text-text-dark placeholder:text-muted-light/50 dark:placeholder:text-muted-dark/50 transition-colors duration-150 focus:outline-none focus-visible:border-primary-light dark:focus-visible:border-primary-dark'
const inputErrorClass = 'border-red-500 focus-visible:border-red-500'

// ─── Drawer ───────────────────────────────────────────────────────────────────
export default function AdminAuctionDrawer() {
  const router = useRouter()
  const { auctionDrawer } = useUiSelector()

  const [title, setTitle] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [customAuctionLink, setCustomAuctionLink] = useState('')
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<{ title?: string; startDate?: string; endDate?: string; form?: string; customAuctionLink?: string }>({})

  // Close on Escape
  useEffect(() => {
    if (!auctionDrawer) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') store.dispatch(setCloseAuctionDrawer())
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [auctionDrawer])

  const validate = useCallback(() => {
    const errs: typeof errors = {}
    if (!title.trim()) errs.title = 'Title is required'
    if (!startDate) errs.startDate = 'Start date is required'
    if (!endDate) errs.endDate = 'End date is required'
    if (!customAuctionLink) errs.customAuctionLink = 'Custom auction link is required'
    if (startDate && endDate && new Date(startDate) >= new Date(endDate)) {
      errs.endDate = 'End date must be after start date'
    }
    return errs
  }, [title, startDate, endDate, customAuctionLink])

  const handleSubmit = async () => {
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }

    setLoading(true)
    setErrors({})

    const result = await createAuction({
      title: title.trim(),
      status: 'DRAFT',
      goal: 1000,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      customAuctionLink
    })

    if (!result.success) {
      setErrors({ form: result.error ?? 'Something went wrong.' })
      setLoading(false)
      return
    }

    router.refresh()
    store.dispatch(setCloseAuctionDrawer())
    setTitle('')
    setStartDate('')
    setEndDate('')
    setCustomAuctionLink('')
    setErrors({})
    setLoading(false)
  }

  return (
    <AnimatePresence>
      {auctionDrawer && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            onClick={() => store.dispatch(setCloseAuctionDrawer())}
            aria-hidden="true"
          />

          {/* Drawer */}
          <motion.aside
            key="drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Create auction"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 32 }}
            className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-bg-light dark:bg-bg-dark border-l border-border-light dark:border-border-dark flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-border-light dark:border-border-dark shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 flex items-center justify-center bg-primary-light/10 dark:bg-primary-dark/10">
                  <Gavel size={15} className="text-primary-light dark:text-primary-dark" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-[9px] font-mono tracking-[0.2em] uppercase text-muted-light dark:text-muted-dark">Admin</p>
                  <p className="text-sm font-quicksand font-black text-text-light dark:text-text-dark leading-snug">New Auction</p>
                </div>
              </div>
              <button
                onClick={() => store.dispatch(setCloseAuctionDrawer())}
                aria-label="Close drawer"
                className="p-2 text-muted-light dark:text-muted-dark hover:text-text-light dark:hover:text-text-dark border border-transparent hover:border-border-light dark:hover:border-border-dark transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark"
              >
                <X size={15} aria-hidden="true" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">
              {/* Form error */}
              <AnimatePresence>
                {errors.form && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    role="alert"
                    className="px-4 py-3 border border-red-500/30 bg-red-500/10 text-red-500 text-xs font-mono"
                  >
                    {errors.form}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Title */}
              <Field id="title" label="Title *" error={errors.title}>
                <input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value)
                    setErrors((p) => ({ ...p, title: undefined }))
                  }}
                  placeholder="e.g. Spring 2026 Auction"
                  className={`${inputClass} ${errors.title ? inputErrorClass : ''}`}
                  aria-invalid={!!errors.title}
                  aria-describedby={errors.title ? 'title-error' : undefined}
                  autoFocus
                />
              </Field>
              {/* Custom Auction Link */}
              <Field id="customAuctionLink" label="Custom Auction Link *" error={errors.customAuctionLink}>
                <input
                  id="customAuctionLink"
                  type="text"
                  value={customAuctionLink}
                  onChange={(e) => {
                    setCustomAuctionLink(e.target.value)
                    setErrors((p) => ({ ...p, customAuctionLink: undefined }))
                  }}
                  placeholder="e.g. Spring2026"
                  className={`${inputClass} ${errors.customAuctionLink ? inputErrorClass : ''}`}
                  aria-invalid={!!errors.customAuctionLink}
                  aria-describedby={errors.customAuctionLink ? 'customAuctionLink-error' : undefined}
                  autoFocus
                />
              </Field>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-3">
                <Field id="startDate" label="Start Date *" error={errors.startDate}>
                  <input
                    id="startDate"
                    type="datetime-local"
                    value={startDate}
                    onChange={(e) => {
                      setStartDate(e.target.value)
                      setErrors((p) => ({ ...p, startDate: undefined, endDate: undefined }))
                    }}
                    className={`${inputClass} ${errors.startDate ? inputErrorClass : ''}`}
                    aria-invalid={!!errors.startDate}
                  />
                </Field>
                <Field id="endDate" label="End Date *" error={errors.endDate}>
                  <input
                    id="endDate"
                    type="datetime-local"
                    value={endDate}
                    min={startDate}
                    onChange={(e) => {
                      setEndDate(e.target.value)
                      setErrors((p) => ({ ...p, endDate: undefined }))
                    }}
                    className={`${inputClass} ${errors.endDate ? inputErrorClass : ''}`}
                    aria-invalid={!!errors.endDate}
                  />
                </Field>
              </div>

              {/* Info note */}
              <div className="px-4 py-3 border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark">
                <p className="text-[10px] font-mono text-muted-light dark:text-muted-dark leading-relaxed">
                  Goal, custom link, anonymous bidding, and items can be configured after creation.
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-5 border-t border-border-light dark:border-border-dark shrink-0 flex items-center gap-3">
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-primary-light dark:bg-primary-dark hover:bg-secondary-light dark:hover:bg-secondary-dark text-white text-[10px] font-mono tracking-[0.2em] uppercase transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark"
                aria-busy={loading}
              >
                {loading ? (
                  <>
                    <Loader2 size={13} className="animate-spin" aria-hidden="true" /> Creating...
                  </>
                ) : (
                  <>
                    <Gavel size={13} aria-hidden="true" /> Create Auction
                  </>
                )}
              </button>
              <button
                onClick={() => store.dispatch(setCloseAuctionDrawer())}
                disabled={loading}
                className="px-4 py-3 border border-border-light dark:border-border-dark text-muted-light dark:text-muted-dark text-[10px] font-mono tracking-[0.2em] uppercase hover:text-text-light dark:hover:text-text-dark hover:border-primary-light/40 dark:hover:border-primary-dark/40 transition-colors duration-150 disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark"
              >
                Cancel
              </button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
