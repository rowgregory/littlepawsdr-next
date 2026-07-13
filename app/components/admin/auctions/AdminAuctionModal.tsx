'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Gavel, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useAppDispatch, useUiSelector } from 'app/lib/store/store'
import { setCloseAuctionDrawer } from 'app/lib/store/slices/uiSlice'
import { createAuction } from 'app/lib/actions/auction/createAuction'
import { useEscapeKey } from '@hooks/useEscapeKey.hook'
import { FormField } from 'app/components/_primitives/FormField'
import { FormError } from 'app/components/_primitives/FormError'

// ─── Types ────────────────────────────────────────────────────────────────────

interface FormInputs {
  title: string
  startDate: string
  endDate: string
  customAuctionLink: string
}

interface FormErrors {
  title?: string
  startDate?: string
  endDate?: string
  customAuctionLink?: string
  form?: string
}

// ─── Constants ────────────────────────────────────────────────────────────────

const EMPTY: FormInputs = {
  title: '',
  startDate: '',
  endDate: '',
  customAuctionLink: ''
}

const INFO_NOTE = 'Goal, anonymous bidding, and items can be configured after creation.'

function validate(inputs: FormInputs): FormErrors {
  const errs: FormErrors = {}
  if (!inputs.title.trim()) errs.title = 'Title is required'
  if (!inputs.startDate) errs.startDate = 'Start date is required'
  if (!inputs.endDate) errs.endDate = 'End date is required'
  if (!inputs.customAuctionLink.trim()) errs.customAuctionLink = 'Custom auction link is required'
  if (inputs.startDate && inputs.endDate && new Date(inputs.startDate) >= new Date(inputs.endDate)) {
    errs.endDate = 'End date must be after start date'
  }
  return errs
}

export default function AdminAuctionModal() {
  const router = useRouter()
  const { auctionDrawer } = useUiSelector()
  const dispatch = useAppDispatch()

  const [inputs, setInputs] = useState<FormInputs>(EMPTY)
  const [errors, setErrors] = useState<FormErrors>({})
  const [loading, setLoading] = useState(false)

  const patch = (data: Partial<FormInputs>) => setInputs((prev) => ({ ...prev, ...data }))

  const clearError = (key: keyof FormErrors) => setErrors((prev) => ({ ...prev, [key]: undefined }))

  const onClose = () => dispatch(setCloseAuctionDrawer())

  useEscapeKey(auctionDrawer, onClose)

  const handleSubmit = async () => {
    const errs = validate(inputs)
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }

    setLoading(true)
    setErrors({})

    const result = await createAuction({
      title: inputs.title.trim(),
      status: 'DRAFT',
      goal: 1000,
      startDate: new Date(inputs.startDate),
      endDate: new Date(inputs.endDate),
      customAuctionLink: inputs.customAuctionLink
    })

    if (!result.success) {
      setErrors({ form: result.error ?? 'Something went wrong.' })
      setLoading(false)
      return
    }

    router.push(`/admin/auctions/${result.data.id}`)
    onClose()
    setInputs(EMPTY)
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
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Modal */}
          <motion.div
            key="modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="auction-modal-title"
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-4 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 top-1/2 -translate-y-1/2 z-50 w-auto sm:w-full sm:max-w-lg bg-bg-light dark:bg-bg-dark border border-border-light dark:border-border-dark shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-border-light dark:border-border-dark">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 flex items-center justify-center bg-primary-light/10 dark:bg-primary-dark/10">
                  <Gavel size={14} className="text-primary-light dark:text-primary-dark" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-[9px] font-mono tracking-[0.2em] uppercase text-muted-light dark:text-muted-dark">
                    Admin
                  </p>
                  <h2
                    id="auction-modal-title"
                    className="text-sm font-quicksand font-black text-text-light dark:text-text-dark leading-snug"
                  >
                    New Auction
                  </h2>
                </div>
              </div>
              <button
                onClick={onClose}
                aria-label="Close modal"
                className="p-2 text-muted-light dark:text-muted-dark hover:text-text-light dark:hover:text-text-dark border border-transparent hover:border-border-light dark:hover:border-border-dark transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark"
              >
                <X size={15} aria-hidden="true" />
              </button>
            </div>

            {/* Body */}
            <div className="px-6 py-6 space-y-4">
              <FormError error={errors.form} />

              <FormField
                id="auction-title"
                label="Title"
                name="title"
                value={inputs.title}
                onChange={(e) => {
                  patch({ title: e.target.value })
                  clearError('title')
                }}
                placeholder="e.g. Spring 2026 Auction"
                error={errors.title}
                required
              />

              <FormField
                id="auction-customAuctionLink"
                label="Custom Auction Link"
                name="customAuctionLink"
                value={inputs.customAuctionLink}
                onChange={(e) => {
                  patch({ customAuctionLink: e.target.value })
                  clearError('customAuctionLink')
                }}
                placeholder="e.g. spring-2026"
                error={errors.customAuctionLink}
                required
              />

              <div className="grid grid-cols-2 gap-3">
                <FormField
                  id="auction-startDate"
                  label="Start Date"
                  name="startDate"
                  type="datetime-local"
                  value={inputs.startDate}
                  onChange={(e) => {
                    patch({ startDate: e.target.value })
                    clearError('startDate')
                    clearError('endDate')
                  }}
                  error={errors.startDate}
                  required
                />
                <FormField
                  id="auction-endDate"
                  label="End Date"
                  name="endDate"
                  type="datetime-local"
                  value={inputs.endDate}
                  onChange={(e) => {
                    patch({ endDate: e.target.value })
                    clearError('endDate')
                  }}
                  error={errors.endDate}
                  required
                />
              </div>

              <div className="px-4 py-3 border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark">
                <p className="text-[10px] font-mono text-muted-light dark:text-muted-dark leading-relaxed">
                  {INFO_NOTE}
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-border-light dark:border-border-dark flex items-center justify-end gap-3">
              <button
                onClick={onClose}
                disabled={loading}
                className="px-4 py-2.5 border border-border-light dark:border-border-dark text-muted-light dark:text-muted-dark text-[10px] font-mono tracking-[0.2em] uppercase hover:text-text-light dark:hover:text-text-dark hover:border-primary-light/40 dark:hover:border-primary-dark/40 transition-colors duration-150 disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                aria-busy={loading}
                className="flex items-center gap-2 px-4 py-2.5 bg-primary-light dark:bg-primary-dark hover:bg-secondary-light dark:hover:bg-secondary-dark text-white text-[10px] font-mono tracking-[0.2em] uppercase transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark"
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
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
