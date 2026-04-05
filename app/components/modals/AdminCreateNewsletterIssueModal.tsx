'use client'

import { useDispatch } from 'react-redux'
import { useState } from 'react'
import { X, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { setCloseCreateAdminNewsletterIssueModal } from 'app/lib/store/slices/uiSlice'
import createNewsletterIssue from 'app/lib/actions/createNewsletterIssue'
import { useUiSelector } from 'app/lib/store/store'

export default function AdminCreateNewsletterIssueModal() {
  const dispatch = useDispatch()
  const router = useRouter()
  const { adminCreateNewsletterIssueModal } = useUiSelector()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [pdfUrl, setPdfUrl] = useState('')
  const [publishedAt, setPublishedAt] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleClose = () => {
    dispatch(setCloseCreateAdminNewsletterIssueModal())
    setTitle('')
    setDescription('')
    setPdfUrl('')
    setPublishedAt('')
    setError(null)
  }

  const handleSubmit = async () => {
    if (!title.trim() || !pdfUrl.trim()) {
      setError('Title and PDF URL are required.')
      return
    }

    setLoading(true)
    setError(null)

    const result = await createNewsletterIssue({
      title: title.trim(),
      description: description.trim() || null,
      pdfUrl: pdfUrl.trim(),
      publishedAt: publishedAt ? new Date(publishedAt) : new Date()
    })

    setLoading(false)

    if (!result.success) {
      setError(result.error ?? 'Something went wrong.')
      return
    }

    router.refresh()
    handleClose()
  }

  return (
    <AnimatePresence>
      {adminCreateNewsletterIssueModal && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={handleClose}
            aria-hidden="true"
          />

          {/* Modal */}
          <motion.div
            key="modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="create-issue-title"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-x-4 xs:inset-x-6 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 top-1/2 -translate-y-1/2 z-50 w-auto sm:w-full sm:max-w-lg bg-bg-light dark:bg-bg-dark border border-border-light dark:border-border-dark shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-border-light dark:border-border-dark">
              <div className="flex items-center gap-3">
                <span className="block w-5 h-px bg-primary-light dark:bg-primary-dark shrink-0" aria-hidden="true" />
                <h2 id="create-issue-title" className="text-[10px] font-mono tracking-[0.2em] uppercase text-primary-light dark:text-primary-dark">
                  New Newsletter Issue
                </h2>
              </div>
              <button
                onClick={handleClose}
                aria-label="Close modal"
                className="text-muted-light dark:text-muted-dark hover:text-text-light dark:hover:text-text-dark transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark"
              >
                <X size={15} aria-hidden="true" />
              </button>
            </div>

            {/* Body */}
            <div className="px-5 py-6 space-y-4">
              {/* Title */}
              <div className="space-y-1.5">
                <label htmlFor="issue-title" className="text-[10px] font-mono tracking-[0.2em] uppercase text-muted-light dark:text-muted-dark">
                  Title <span aria-hidden="true">*</span>
                </label>
                <input
                  id="issue-title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Spring 2026 Newsletter"
                  className="w-full px-3 py-2 bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark text-xs font-mono text-text-light dark:text-text-dark placeholder:text-muted-light dark:placeholder:text-muted-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark transition-colors"
                />
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label htmlFor="issue-description" className="text-[10px] font-mono tracking-[0.2em] uppercase text-muted-light dark:text-muted-dark">
                  Description
                </label>
                <textarea
                  id="issue-description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Optional summary of this issue..."
                  rows={3}
                  className="w-full px-3 py-2 bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark text-xs font-mono text-text-light dark:text-text-dark placeholder:text-muted-light dark:placeholder:text-muted-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark transition-colors resize-none"
                />
              </div>

              {/* PDF URL */}
              <div className="space-y-1.5">
                <label htmlFor="issue-pdf-url" className="text-[10px] font-mono tracking-[0.2em] uppercase text-muted-light dark:text-muted-dark">
                  PDF URL <span aria-hidden="true">*</span>
                </label>
                <input
                  id="issue-pdf-url"
                  type="url"
                  value={pdfUrl}
                  onChange={(e) => setPdfUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3 py-2 bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark text-xs font-mono text-text-light dark:text-text-dark placeholder:text-muted-light dark:placeholder:text-muted-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark transition-colors"
                />
              </div>

              {/* Published At */}
              <div className="space-y-1.5">
                <label
                  htmlFor="issue-published-at"
                  className="text-[10px] font-mono tracking-[0.2em] uppercase text-muted-light dark:text-muted-dark"
                >
                  Published Date
                </label>
                <input
                  id="issue-published-at"
                  type="date"
                  value={publishedAt}
                  onChange={(e) => setPublishedAt(e.target.value)}
                  className="w-full px-3 py-2 bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark text-xs font-mono text-text-light dark:text-text-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark transition-colors"
                />
              </div>

              {/* Error */}
              {error && (
                <p role="alert" className="text-[10px] font-mono tracking-widest text-red-500 dark:text-red-400">
                  {error}
                </p>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 px-5 py-4 border-t border-border-light dark:border-border-dark">
              <button
                onClick={handleClose}
                className="px-4 py-2 text-[10px] font-mono tracking-[0.2em] uppercase text-muted-light dark:text-muted-dark border border-border-light dark:border-border-dark hover:text-text-light dark:hover:text-text-dark hover:border-text-light dark:hover:border-text-dark transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                aria-disabled={loading}
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary-light dark:bg-primary-dark text-[10px] font-mono tracking-[0.2em] uppercase text-white dark:text-bg-dark hover:bg-secondary-light dark:hover:bg-secondary-dark transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading && <Loader2 size={11} className="animate-spin" aria-hidden="true" />}
                {loading ? 'Creating...' : 'Create Issue'}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
