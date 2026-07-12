'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppDispatch } from 'app/lib/store/store'
import { setShowConfetti } from 'app/lib/store/slices/uiSlice'
import { TalkingDachshund } from '../unique/TalkingDachshund'

export function WelcomeGate({
  show,
  userName,
  onClose
}: {
  show: boolean
  userName: string | null
  onClose: () => void
}) {
  const dispatch = useAppDispatch()
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    if (show) {
      dispatch(setShowConfetti())
    }
  }, [dispatch, show])

  const open = show && !dismissed

  const firstName = userName?.split(' ')[0]

  const handleClose = () => {
    setDismissed(true)
    onClose()
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          role="dialog"
          aria-modal="true"
          aria-labelledby="welcome-heading"
        >
          <motion.div
            className="relative w-full max-w-md bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark px-6 py-10 sm:px-8 sm:py-12 flex flex-col items-center text-center"
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Mascot — front and center, large */}
            <div className="mb-8">
              <TalkingDachshund
                message={
                  firstName
                    ? `Welcome to your pack, ${firstName}! Your history has been restored.`
                    : 'Welcome to your pack! Your history has been restored.'
                }
                bubbleSide="top"
                size={200}
                typeSpeed={45}
                startDelay={500}
              />
            </div>

            {/* One-line explainer */}
            <h2
              id="welcome-heading"
              className="text-sm text-muted-light dark:text-muted-dark leading-relaxed mb-8 max-w-xs"
            >
              Everything from the previous site is here — your orders, donations, and auction history are all waiting
              for you.
            </h2>

            {/* Single close button */}
            <button
              onClick={handleClose}
              className="w-full bg-primary-light dark:bg-primary-dark hover:bg-secondary-light dark:hover:bg-secondary-dark text-white text-[10px] font-mono font-black tracking-[0.25em] uppercase py-3.5 px-6 transition-colors duration-200 focus:outline-none focus-visible:ring-4 focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark"
            >
              Let&apos;s explore
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
