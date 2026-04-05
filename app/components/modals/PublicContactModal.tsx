'use client'

import { X, Loader2, Send } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { createFormActions } from 'app/utils/formActions'
import { setCloseContactModal } from 'app/lib/store/slices/uiSlice'
import { store, useFormSelector, useUiSelector } from 'app/lib/store/store'
import sendContactEmail from 'app/lib/actions/sendContactEmail'
import { EMAIL_REGEX } from 'app/utils/regex'

const FORM_NAME = 'contactForm'

export default function PublicContactModal() {
  const { contactForm } = useFormSelector()
  const { contactModal } = useUiSelector()
  const inputs = contactForm.inputs
  const errors = contactForm.errors

  const { handleInput, setErrors, resetForm } = createFormActions(FORM_NAME, store.dispatch)

  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleClose = () => {
    store.dispatch(setCloseContactModal())
    resetForm()
    setSuccess(false)
  }

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()

    const newErrors: Record<string, string> = {}
    if (!inputs?.name?.trim()) newErrors.name = 'Name is required'
    if (!EMAIL_REGEX.test(inputs?.email?.trim())) newErrors.email = 'Email is required'
    if (!inputs?.subject?.trim()) newErrors.subject = 'Subject is required'
    if (!inputs?.message?.trim()) newErrors.message = 'Message is required'

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setLoading(true)
    setErrors({})

    const result = await sendContactEmail({
      name: inputs?.name,
      email: inputs?.email,
      subject: inputs?.subject,
      message: inputs?.message
    })

    setLoading(false)

    if (!result.success) {
      setErrors({ form: 'Something went wrong. Please try again.' })
      return
    }

    resetForm()
    setSuccess(true)
  }

  return (
    <AnimatePresence>
      {contactModal && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-110 bg-black/60 backdrop-blur-sm"
            onClick={handleClose}
            aria-hidden="true"
          />

          {/* Modal */}
          <motion.div
            key="modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="contact-modal-title"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-x-4 xs:inset-x-6 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 top-1/2 -translate-y-1/2 z-120 w-auto sm:w-full sm:max-w-lg bg-bg-light dark:bg-bg-dark border border-border-light dark:border-border-dark shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-border-light dark:border-border-dark">
              <div className="flex items-center gap-3">
                <span className="block w-5 h-px bg-primary-light dark:bg-primary-dark shrink-0" aria-hidden="true" />
                <h2 id="contact-modal-title" className="text-[10px] font-mono tracking-[0.2em] uppercase text-primary-light dark:text-primary-dark">
                  Contact Us
                </h2>
              </div>
              <button
                onClick={handleClose}
                aria-label="Close contact modal"
                className="text-muted-light dark:text-muted-dark hover:text-text-light dark:hover:text-text-dark transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark"
              >
                <X size={15} aria-hidden="true" />
              </button>
            </div>

            {/* Success */}
            {success ? (
              <div className="px-5 py-12 text-center space-y-2">
                <p className="text-[10px] font-mono tracking-[0.2em] uppercase text-primary-light dark:text-primary-dark">Message Sent</p>
                <p className="text-sm font-mono text-muted-light dark:text-muted-dark">
                  Thanks for reaching out. We&apos;ll get back to you as soon as we can.
                </p>
                <button
                  onClick={handleClose}
                  className="mt-4 inline-flex items-center gap-2 px-4 py-2 text-[10px] font-mono tracking-[0.2em] uppercase bg-primary-light dark:bg-primary-dark text-white dark:text-bg-dark hover:bg-secondary-light dark:hover:bg-secondary-dark transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark"
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate>
                <div className="px-5 py-6 space-y-4">
                  {/* Name + Email */}
                  <div className="grid grid-cols-1 xs:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label
                        htmlFor="contact-name"
                        className="text-[10px] font-mono tracking-[0.2em] uppercase text-muted-light dark:text-muted-dark"
                      >
                        Name <span aria-hidden="true">*</span>
                      </label>
                      <input
                        id="contact-name"
                        name="name"
                        type="text"
                        value={inputs?.name ?? ''}
                        onChange={handleInput}
                        placeholder="Jane Smith"
                        autoComplete="name"
                        aria-invalid={!!errors?.name}
                        aria-describedby={errors?.name ? 'contact-name-error' : undefined}
                        className="w-full px-3 py-2 bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark text-xs font-mono text-text-light dark:text-text-dark placeholder:text-muted-light dark:placeholder:text-muted-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark transition-colors"
                      />
                      {errors?.name && (
                        <p id="contact-name-error" role="alert" className="text-[10px] font-mono text-red-500 dark:text-red-400">
                          {errors?.name}
                        </p>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <label
                        htmlFor="contact-email"
                        className="text-[10px] font-mono tracking-[0.2em] uppercase text-muted-light dark:text-muted-dark"
                      >
                        Email <span aria-hidden="true">*</span>
                      </label>
                      <input
                        id="contact-email"
                        name="email"
                        type="email"
                        value={inputs?.email ?? ''}
                        onChange={handleInput}
                        placeholder="jane@example.com"
                        autoComplete="email"
                        aria-invalid={!!errors?.email}
                        aria-describedby={errors?.email ? 'contact-email-error' : undefined}
                        className="w-full px-3 py-2 bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark text-xs font-mono text-text-light dark:text-text-dark placeholder:text-muted-light dark:placeholder:text-muted-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark transition-colors"
                      />
                      {errors?.email && (
                        <p id="contact-email-error" role="alert" className="text-[10px] font-mono text-red-500 dark:text-red-400">
                          {errors?.email}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Subject */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor="contact-subject"
                      className="text-[10px] font-mono tracking-[0.2em] uppercase text-muted-light dark:text-muted-dark"
                    >
                      Subject <span aria-hidden="true">*</span>
                    </label>
                    <input
                      id="contact-subject"
                      name="subject"
                      type="text"
                      value={inputs?.subject ?? ''}
                      onChange={handleInput}
                      placeholder="How can we help?"
                      aria-invalid={!!errors?.subject}
                      aria-describedby={errors?.subject ? 'contact-subject-error' : undefined}
                      className="w-full px-3 py-2 bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark text-xs font-mono text-text-light dark:text-text-dark placeholder:text-muted-light dark:placeholder:text-muted-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark transition-colors"
                    />
                    {errors?.subject && (
                      <p id="contact-subject-error" role="alert" className="text-[10px] font-mono text-red-500 dark:text-red-400">
                        {errors?.subject}
                      </p>
                    )}
                  </div>

                  {/* Message */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor="contact-message"
                      className="text-[10px] font-mono tracking-[0.2em] uppercase text-muted-light dark:text-muted-dark"
                    >
                      Message <span aria-hidden="true">*</span>
                    </label>
                    <textarea
                      id="contact-message"
                      name="message"
                      value={inputs?.message ?? ''}
                      onChange={handleInput as any}
                      placeholder="Tell us what's on your mind..."
                      rows={5}
                      aria-invalid={!!errors?.message}
                      aria-describedby={errors?.message ? 'contact-message-error' : undefined}
                      className="w-full px-3 py-2 bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark text-xs font-mono text-text-light dark:text-text-dark placeholder:text-muted-light dark:placeholder:text-muted-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark transition-colors resize-none"
                    />
                    {errors?.message && (
                      <p id="contact-message-error" role="alert" className="text-[10px] font-mono text-red-500 dark:text-red-400">
                        {errors?.message}
                      </p>
                    )}
                  </div>

                  {errors?.form && (
                    <p role="alert" className="text-[10px] font-mono tracking-widest text-red-500 dark:text-red-400">
                      {errors?.form}
                    </p>
                  )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 px-5 py-4 border-t border-border-light dark:border-border-dark">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="px-4 py-2 text-[10px] font-mono tracking-[0.2em] uppercase text-muted-light dark:text-muted-dark border border-border-light dark:border-border-dark hover:text-text-light dark:hover:text-text-dark hover:border-text-light dark:hover:border-text-dark transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-primary-light dark:bg-primary-dark text-[10px] font-mono tracking-[0.2em] uppercase text-white dark:text-bg-dark hover:bg-secondary-light dark:hover:bg-secondary-dark transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading && <Loader2 size={11} className="animate-spin" aria-hidden="true" />}
                    {loading ? 'Sending...' : 'Send Message'}
                    {!loading && <Send size={11} aria-hidden="true" />}
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
